const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const db = require('../database/database');
const aiGrading = require('../services/aiGrading');

const router = express.Router();

// Submit athlete profile
router.post('/profile', authMiddleware, [
  body('sportId').isInt().withMessage('Valid sport selection is required'),
  body('height').optional().isInt({ min: 48, max: 96 }).withMessage('Height must be between 48-96 inches'),
  body('weight').optional().isInt({ min: 80, max: 400 }).withMessage('Weight must be between 80-400 lbs'),
  body('age').isInt({ min: 13, max: 25 }).withMessage('Age must be between 13-25'),
  body('gpa').optional().isFloat({ min: 0, max: 4.0 }).withMessage('GPA must be between 0-4.0'),
  body('satScore').optional().isInt({ min: 400, max: 1600 }).withMessage('SAT score must be between 400-1600'),
  body('actScore').optional().isInt({ min: 1, max: 36 }).withMessage('ACT score must be between 1-36'),
  body('videoUrl').isURL().withMessage('Valid video URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const {
      sportId,
      height,
      weight,
      age,
      position,
      yearsExperience,
      fortyYardDash,
      verticalJump,
      benchPress,
      squatMax,
      mileTime,
      gpa,
      satScore,
      actScore,
      apClasses,
      honorsClasses,
      classRank,
      classSize,
      graduationYear,
      majorInterest,
      videoUrl,
      videoTitle,
      videoDescription,
      videoDuration
    } = req.body;

    // Get sport name for AI grading
    const sport = await db.get('SELECT name FROM sports WHERE id = ?', [sportId]);
    if (!sport) {
      return res.status(400).json({ error: 'Invalid sport selection' });
    }

    // Insert athlete profile
    const athleteResult = await db.run(`
      INSERT INTO athlete_profiles (
        user_id, sport_id, height_inches, weight_lbs, age, position, 
        years_experience, forty_yard_dash, vertical_jump_inches, 
        bench_press_reps, squat_max_lbs, mile_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, sportId, height, weight, age, position,
      yearsExperience, fortyYardDash, verticalJump,
      benchPress, squatMax, mileTime
    ]);

    // Insert academic profile
    const academicResult = await db.run(`
      INSERT INTO academic_profiles (
        user_id, gpa, sat_score, act_score, ap_classes_count,
        honors_classes_count, class_rank, class_size,
        graduation_year, major_interest
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, gpa, satScore, actScore, apClasses,
      honorsClasses, classRank, classSize,
      graduationYear, majorInterest
    ]);

    // Insert sport performance (enhanced highlight reel)
    const sportPerformanceResult = await db.run(`
      INSERT INTO sport_performance (
        user_id, video_url, title, description, duration_seconds,
        awards, achievements, team_captain, varsity_years,
        leadership_roles, tournament_wins, statistical_highlights
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, videoUrl, videoTitle, videoDescription, videoDuration,
      req.body.awards, req.body.achievements, req.body.teamCaptain ? 1 : 0,
      req.body.varsityYears, req.body.leadershipRoles, req.body.tournamentWins,
      req.body.statisticalHighlights
    ]);

    // Prepare data for AI grading
    const athleteData = {
      height_inches: height,
      weight_lbs: weight,
      age,
      years_experience: yearsExperience,
      forty_yard_dash: fortyYardDash,
      vertical_jump_inches: verticalJump,
      bench_press_reps: benchPress,
      squat_max_lbs: squatMax
    };

    const academicData = {
      gpa,
      sat_score: satScore,
      act_score: actScore,
      ap_classes_count: apClasses,
      honors_classes_count: honorsClasses,
      class_rank: classRank,
      class_size: classSize
    };

    const sportPerformanceData = {
      video_url: videoUrl,
      title: videoTitle,
      description: videoDescription,
      duration_seconds: videoDuration,
      awards: req.body.awards,
      achievements: req.body.achievements,
      team_captain: req.body.teamCaptain,
      varsity_years: req.body.varsityYears,
      leadership_roles: req.body.leadershipRoles,
      tournament_wins: req.body.tournamentWins,
      statistical_highlights: req.body.statisticalHighlights
    };

    // Generate AI evaluation with enhanced sport performance
    const evaluation = await aiGrading.evaluateAthlete(
      userId,
      athleteData,
      academicData,
      sportPerformanceData,
      sport.name
    );

    // Mark previous evaluations as not current
    await db.run('UPDATE evaluations SET is_current = 0 WHERE user_id = ?', [userId]);
    
    // Store new evaluation results
    await db.run(`
      INSERT INTO evaluations (
        user_id, physical_grade, academic_grade, sport_performance_grade,
        overall_grade, physical_analysis, academic_analysis,
        sport_performance_analysis, overall_analysis, improvement_suggestions,
        is_current
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      evaluation.physicalGrade,
      evaluation.academicGrade,
      evaluation.sportPerformanceGrade,
      evaluation.overallGrade,
      evaluation.physicalAnalysis,
      evaluation.academicAnalysis,
      evaluation.sportPerformanceAnalysis,
      evaluation.overallAnalysis,
      evaluation.improvementSuggestions,
      1
    ]);

    res.status(201).json({
      message: 'Athlete profile submitted and evaluated successfully',
      evaluation: {
        physicalGrade: evaluation.physicalGrade,
        academicGrade: evaluation.academicGrade,
        sportPerformanceGrade: evaluation.sportPerformanceGrade,
        overallGrade: evaluation.overallGrade,
        physicalAnalysis: evaluation.physicalAnalysis,
        academicAnalysis: evaluation.academicAnalysis,
        sportPerformanceAnalysis: evaluation.sportPerformanceAnalysis,
        overallAnalysis: evaluation.overallAnalysis,
        improvementSuggestions: evaluation.improvementSuggestions
      }
    });

  } catch (error) {
    console.error('Profile submission error:', error);
    res.status(500).json({ error: 'Failed to process athlete profile' });
  }
});

// Get user's evaluation
router.get('/evaluation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const evaluation = await db.get(`
      SELECT e.*, s.name as sport_name, u.first_name, u.last_name
      FROM evaluations e
      JOIN athlete_profiles ap ON e.user_id = ap.user_id
      JOIN sports s ON ap.sport_id = s.id
      JOIN users u ON e.user_id = u.id
      WHERE e.user_id = ? AND e.is_current = 1
      ORDER BY e.evaluation_date DESC
      LIMIT 1
    `, [userId]);

    if (!evaluation) {
      return res.status(404).json({ error: 'No evaluation found' });
    }

    res.json({
      evaluation: {
        id: evaluation.id,
        sport: evaluation.sport_name,
        athleteName: `${evaluation.first_name} ${evaluation.last_name}`,
        physicalGrade: evaluation.physical_grade,
        academicGrade: evaluation.academic_grade,
        sportPerformanceGrade: evaluation.sport_performance_grade,
        overallGrade: evaluation.overall_grade,
        physicalAnalysis: evaluation.physical_analysis,
        academicAnalysis: evaluation.academic_analysis,
        sportPerformanceAnalysis: evaluation.sport_performance_analysis,
        overallAnalysis: evaluation.overall_analysis,
        improvementSuggestions: evaluation.improvement_suggestions,
        evaluationDate: evaluation.evaluation_date,
        isCurrent: evaluation.is_current === 1
      }
    });

  } catch (error) {
    console.error('Get evaluation error:', error);
    res.status(500).json({ error: 'Failed to retrieve evaluation' });
  }
});

// Get user's evaluation history
router.get('/evaluation/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const evaluations = await db.all(`
      SELECT e.*, s.name as sport_name, u.first_name, u.last_name
      FROM evaluations e
      JOIN athlete_profiles ap ON e.user_id = ap.user_id
      JOIN sports s ON ap.sport_id = s.id
      JOIN users u ON e.user_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.evaluation_date DESC
    `, [userId]);

    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ error: 'No evaluation history found' });
    }

    const formattedEvaluations = evaluations.map(evaluation => ({
      id: evaluation.id,
      sport: evaluation.sport_name,
      athleteName: `${evaluation.first_name} ${evaluation.last_name}`,
      physicalGrade: evaluation.physical_grade,
      academicGrade: evaluation.academic_grade,
      sportPerformanceGrade: evaluation.sport_performance_grade,
      overallGrade: evaluation.overall_grade,
      physicalAnalysis: evaluation.physical_analysis,
      academicAnalysis: evaluation.academic_analysis,
      sportPerformanceAnalysis: evaluation.sport_performance_analysis,
      overallAnalysis: evaluation.overall_analysis,
      improvementSuggestions: evaluation.improvement_suggestions,
      evaluationDate: evaluation.evaluation_date,
      isCurrent: evaluation.is_current === 1
    }));

    res.json({
      evaluations: formattedEvaluations
    });

  } catch (error) {
    console.error('Get evaluation history error:', error);
    res.status(500).json({ error: 'Failed to retrieve evaluation history' });
  }
});

// Get all sports
router.get('/sports', async (req, res) => {
  try {
    const sports = await db.all('SELECT id, name, category FROM sports ORDER BY name');
    res.json({ sports });
  } catch (error) {
    console.error('Get sports error:', error);
    res.status(500).json({ error: 'Failed to retrieve sports' });
  }
});

module.exports = router; 