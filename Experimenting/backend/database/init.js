const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/athlete_ai.db');

async function initializeDatabase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return;
    }
    console.log('Connected to SQLite database');
  });

  // Create tables in sequence to avoid dependency issues
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err);
        else console.log('Users table created successfully');
      });

      // Sports table
      db.run(`
        CREATE TABLE IF NOT EXISTS sports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(50) UNIQUE NOT NULL,
          category VARCHAR(30) NOT NULL
        )
      `, (err) => {
        if (err) console.error('Error creating sports table:', err);
        else console.log('Sports table created successfully');
      });

      // Athlete profiles table
      db.run(`
        CREATE TABLE IF NOT EXISTS athlete_profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          sport_id INTEGER NOT NULL,
          height_inches INTEGER,
          weight_lbs INTEGER,
          age INTEGER,
          position VARCHAR(50),
          years_experience INTEGER,
          forty_yard_dash DECIMAL(4,2),
          vertical_jump_inches INTEGER,
          bench_press_reps INTEGER,
          squat_max_lbs INTEGER,
          mile_time VARCHAR(10),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (sport_id) REFERENCES sports (id)
        )
      `, (err) => {
        if (err) console.error('Error creating athlete_profiles table:', err);
        else console.log('Athlete profiles table created successfully');
      });

      // Academic profiles table
      db.run(`
        CREATE TABLE IF NOT EXISTS academic_profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          gpa DECIMAL(3,2),
          sat_score INTEGER,
          act_score INTEGER,
          ap_classes_count INTEGER,
          honors_classes_count INTEGER,
          class_rank INTEGER,
          class_size INTEGER,
          graduation_year INTEGER,
          major_interest VARCHAR(100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) console.error('Error creating academic_profiles table:', err);
        else console.log('Academic profiles table created successfully');
      });

      // Sport performance table (expanded from highlight reels)
      db.run(`
        CREATE TABLE IF NOT EXISTS sport_performance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          video_url VARCHAR(500) NOT NULL,
          title VARCHAR(200),
          description TEXT,
          duration_seconds INTEGER,
          upload_date DATE,
          awards TEXT,
          achievements TEXT,
          team_captain BOOLEAN DEFAULT 0,
          varsity_years INTEGER,
          leadership_roles TEXT,
          tournament_wins TEXT,
          statistical_highlights TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) console.error('Error creating sport_performance table:', err);
        else console.log('Sport performance table created successfully');
      });

      // Evaluations table (enhanced with video analysis)
      db.run(`
        CREATE TABLE IF NOT EXISTS evaluations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          physical_grade INTEGER,
          academic_grade INTEGER,
          sport_performance_grade INTEGER,
          video_analysis_grade INTEGER,
          overall_grade INTEGER,
          physical_analysis TEXT,
          academic_analysis TEXT,
          sport_performance_analysis TEXT,
          video_analysis_results TEXT,
          overall_analysis TEXT,
          improvement_suggestions TEXT,
          evaluation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_current BOOLEAN DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) console.error('Error creating evaluations table:', err);
        else console.log('Evaluations table created successfully');
      });

      // Insert default sports after all tables are created
      const sports = [
        ['Football', 'Team Sport'],
        ['Basketball', 'Team Sport'],
        ['Baseball', 'Team Sport'],
        ['Soccer', 'Team Sport'],
        ['Track and Field', 'Individual'],
        ['Swimming', 'Individual'],
        ['Tennis', 'Individual'],
        ['Golf', 'Individual'],
        ['Wrestling', 'Individual'],
        ['Volleyball', 'Team Sport'],
        ['Cross Country', 'Individual'],
        ['Lacrosse', 'Team Sport'],
        ['Hockey', 'Team Sport'],
        ['Softball', 'Team Sport'],
        ['Gymnastics', 'Individual']
      ];

      const stmt = db.prepare('INSERT OR IGNORE INTO sports (name, category) VALUES (?, ?)');
      sports.forEach(sport => {
        stmt.run(sport);
      });
      stmt.finalize((err) => {
        if (err) console.error('Error inserting sports:', err);
        else console.log('Default sports data inserted successfully');
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
          } else {
            console.log('Database initialized successfully');
            resolve();
          }
        });
      });
    });
  });
}

// Run initialization if this file is called directly
if (require.main === module) {
  initializeDatabase().catch(console.error);
}

module.exports = { initializeDatabase }; 