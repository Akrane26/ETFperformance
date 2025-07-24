// Athlete.AI Frontend Application
class AthleteAI {
    constructor() {
        this.apiBaseUrl = '/api';
        this.currentUser = null;
        this.token = localStorage.getItem('athleteai_token');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadSports();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showModal('login'));
        document.getElementById('signupBtn')?.addEventListener('click', () => this.showModal('signup'));
        document.getElementById('getStartedBtn')?.addEventListener('click', () => this.handleGetStarted());
        document.getElementById('learnMoreBtn')?.addEventListener('click', () => this.scrollToFeatures());
        
        // Modal controls
        document.querySelector('.close-btn')?.addEventListener('click', () => this.hideModal());
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') this.hideModal();
        });
        
        // Auth form switching
        document.getElementById('showSignup')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('signup');
        });
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('login');
        });
        
        // Form submissions
        document.querySelector('#loginForm form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.querySelector('#signupForm form')?.addEventListener('submit', (e) => this.handleSignup(e));
        document.getElementById('athleteProfileForm')?.addEventListener('submit', (e) => this.handleProfileSubmission(e));
        
        // Dashboard
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
        document.getElementById('dashboardLogo')?.addEventListener('click', () => this.handleLogoClick());
        
        // Set up dynamic event listeners that work even when elements are added later
        document.addEventListener('click', (e) => {
            if (e.target.id === 'viewHistoryBtn') {
                this.showEvaluationHistory();
            }
            if (e.target.id === 'backToCurrentBtn') {
                this.showCurrentEvaluation();
            }
            if (e.target.id === 'viewHistoryMainBtn') {
                this.showEvaluationHistoryOnMain();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideModal();
        });
    }

    // Authentication Status Check
    async checkAuthStatus() {
        if (this.token) {
            try {
                const response = await this.apiCall('/athlete/evaluation', 'GET');
                if (response.evaluation) {
                    this.currentUser = { token: this.token };
                    this.showDashboard();
                    this.displayEvaluation(response.evaluation);
                } else {
                    this.currentUser = { token: this.token };
                    this.showDashboard();
                }
                // Also load history for main page
                this.loadMainPageHistory();
            } catch (error) {
                console.log('No existing evaluation found');
                if (this.token) {
                    this.currentUser = { token: this.token };
                    this.showDashboard();
                    this.loadMainPageHistory();
                }
            }
        }
    }

    // API Call Helper
    async apiCall(endpoint, method = 'GET', data = null) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            method,
            headers,
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    // Load Sports List
    async loadSports() {
        try {
            const response = await this.apiCall('/athlete/sports');
            const sportSelect = document.getElementById('sport');
            
            if (sportSelect && response.sports) {
                sportSelect.innerHTML = '<option value="">Select your sport...</option>';
                response.sports.forEach(sport => {
                    const option = document.createElement('option');
                    option.value = sport.id;
                    option.textContent = sport.name;
                    sportSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load sports:', error);
        }
    }

    // Modal Management
    showModal(type = 'login') {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'block';
            this.switchAuthForm(type);
        }
    }

    hideModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    switchAuthForm(type) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (type === 'signup') {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        }
    }

    // Authentication Handlers
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            this.showLoading();
            const response = await this.apiCall('/auth/login', 'POST', loginData);
            
            this.token = response.token;
            this.currentUser = response.user;
            localStorage.setItem('athleteai_token', this.token);
            
            this.hideModal();
            this.showDashboard();
            this.showMessage('Welcome back! Ready to get evaluated?', 'success');
            this.loadMainPageHistory();
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const signupData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            this.showLoading();
            const response = await this.apiCall('/auth/register', 'POST', signupData);
            
            this.token = response.token;
            this.currentUser = response.user;
            localStorage.setItem('athleteai_token', this.token);
            
            this.hideModal();
            this.showDashboard();
            this.showMessage(`Welcome to Athlete.AI, ${response.user.firstName}!`, 'success');
            this.loadMainPageHistory();
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    handleLogout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('athleteai_token');
        
        this.showLandingPage();
        this.hideMainPageHistory();
        this.showMessage('You have been logged out successfully', 'info');
    }

    // Handle clicking the Athlete.AI logo in dashboard
    handleLogoClick() {
        // Always show the landing page when logo is clicked
        this.showLandingPage();
        this.showMessage('Welcome back to Athlete.AI! Your evaluations are saved in your account.', 'info');
        // Load history for main page if user is logged in
        if (this.currentUser) {
            this.loadMainPageHistory();
        }
    }

    // Profile Submission
    async handleProfileSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = {};
        
        // Extract all form data
        for (let [key, value] of formData.entries()) {
            if (value.trim() !== '') {
                // Convert numeric fields
                const numericFields = ['sportId', 'height', 'weight', 'age', 'yearsExperience', 
                                     'fortyYardDash', 'verticalJump', 'benchPress', 'squatMax',
                                     'gpa', 'satScore', 'actScore', 'apClasses', 'honorsClasses',
                                     'classRank', 'classSize', 'graduationYear', 'videoDuration', 'varsityYears'];
                
                // Convert boolean fields
                const booleanFields = ['teamCaptain'];
                
                if (numericFields.includes(key)) {
                    profileData[key] = parseFloat(value) || parseInt(value);
                } else if (booleanFields.includes(key)) {
                    profileData[key] = value === 'true';
                } else {
                    profileData[key] = value;
                }
            }
        }

        // Validate required fields
        if (!profileData.sportId) {
            this.showMessage('Please select your primary sport', 'error');
            return;
        }
        
        if (!profileData.age) {
            this.showMessage('Age is required', 'error');
            return;
        }
        
        if (!profileData.videoUrl) {
            this.showMessage('Highlight reel URL is required', 'error');
            return;
        }

        try {
            this.showLoading('Analyzing your profile with AI...');
            
            const response = await this.apiCall('/athlete/profile', 'POST', profileData);
            
            this.hideSection('profileSection');
            this.showSection('evaluationSection');
            this.displayEvaluation(response.evaluation);
            
            this.showMessage('Your profile has been evaluated successfully!', 'success');
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // UI Management
    showDashboard() {
        document.querySelector('.main-content').style.display = 'none';
        document.querySelector('.navbar').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
        if (this.currentUser) {
            const greeting = document.getElementById('userGreeting');
            if (greeting) {
                greeting.textContent = `Welcome back, ${this.currentUser.firstName || 'Athlete'}!`;
            }
        }
    }

    showLandingPage() {
        document.querySelector('.main-content').style.display = 'block';
        document.querySelector('.navbar').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }

    showSection(sectionId) {
        document.getElementById(sectionId).style.display = 'block';
    }

    hideSection(sectionId) {
        document.getElementById(sectionId).style.display = 'none';
    }

    scrollToFeatures() {
        document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    }

    handleGetStarted() {
        if (this.currentUser) {
            this.showDashboard();
        } else {
            this.showModal('signup');
        }
    }

    // Evaluation Display
    displayEvaluation(evaluation) {
        const resultsContainer = document.getElementById('evaluationResults');
        if (!resultsContainer) return;

        const getScoreClass = (score) => {
            if (score >= 90) return 'score-excellent';
            if (score >= 80) return 'score-good';
            if (score >= 70) return 'score-average';
            return 'score-poor';
        };

        const getScoreLabel = (score) => {
            if (score >= 90) return 'Excellent';
            if (score >= 80) return 'Good';
            if (score >= 70) return 'Average';
            return 'Needs Improvement';
        };

        // Format sport performance analysis for better display
        const formatAnalysis = (text) => {
            return text.replace(/\n/g, '<br>').replace(/•/g, '&bull;');
        };

        // Check if this is an OpenAI Vision analysis result
        const isOpenAIAnalysis = evaluation.sportPerformanceAnalysis.includes('AI Vision Analysis Results');

        resultsContainer.innerHTML = `
            <div class="evaluation-header">
                <h3>${evaluation.athleteName || 'Your'} Athletic Evaluation</h3>
                <p>Sport: ${evaluation.sport || 'Not specified'}</p>
                <p>Evaluation Date: ${new Date(evaluation.evaluationDate).toLocaleDateString()}</p>
                ${isOpenAIAnalysis ? '<span class="ai-powered-badge">🤖 AI Vision Powered</span>' : ''}
            </div>

            <div class="evaluation-scores">
                <div class="score-card">
                    <h4>💪 Physical Performance</h4>
                    <div class="score-value ${getScoreClass(evaluation.physicalGrade)}">${evaluation.physicalGrade}</div>
                    <div class="score-label">${getScoreLabel(evaluation.physicalGrade)}</div>
                </div>
                
                <div class="score-card">
                    <h4>🎓 Academic Achievement</h4>
                    <div class="score-value ${getScoreClass(evaluation.academicGrade)}">${evaluation.academicGrade}</div>
                    <div class="score-label">${getScoreLabel(evaluation.academicGrade)}</div>
                </div>
                
                <div class="score-card ${isOpenAIAnalysis ? 'ai-enhanced' : ''}">
                    <h4>🎬 Sport Performance</h4>
                    <div class="score-value ${getScoreClass(evaluation.sportPerformanceGrade)}">${evaluation.sportPerformanceGrade}</div>
                    <div class="score-label">${getScoreLabel(evaluation.sportPerformanceGrade)}</div>
                </div>
                
                <div class="score-card overall-score">
                    <h4>🏆 Overall Grade</h4>
                    <div class="score-value ${getScoreClass(evaluation.overallGrade)}">${evaluation.overallGrade}</div>
                    <div class="score-label">${getScoreLabel(evaluation.overallGrade)}</div>
                </div>
            </div>

            <div class="analysis-section">
                <h4>💪 Physical Performance Analysis</h4>
                <p class="analysis-text">${evaluation.physicalAnalysis}</p>
            </div>

            <div class="analysis-section">
                <h4>🎓 Academic Performance Analysis</h4>
                <p class="analysis-text">${evaluation.academicAnalysis}</p>
            </div>

            <div class="analysis-section ${isOpenAIAnalysis ? 'ai-enhanced-section' : ''}">
                <h4>🎬 Sport Performance & AI Video Analysis</h4>
                <div class="sport-performance-analysis">
                    ${formatAnalysis(evaluation.sportPerformanceAnalysis)}
                </div>
            </div>

            <div class="analysis-section">
                <h4>📊 Overall Assessment</h4>
                <p class="analysis-text">${evaluation.overallAnalysis}</p>
            </div>

            <div class="improvement-suggestions">
                <h4>🎯 Improvement Recommendations</h4>
                <p>${evaluation.improvementSuggestions}</p>
            </div>
        `;
    }

    // Show evaluation history
    async showEvaluationHistory() {
        try {
            const response = await this.apiCall('/athlete/evaluation/history');
            this.hideSection('evaluationSection');
            this.showSection('historySection');
            this.displayEvaluationHistory(response.evaluations);
        } catch (error) {
            this.showMessage('Failed to load evaluation history', 'error');
        }
    }

    // Show current evaluation
    showCurrentEvaluation() {
        this.hideSection('historySection');
        this.showSection('evaluationSection');
    }

    // Display evaluation history
    displayEvaluationHistory(evaluations) {
        const historyContainer = document.getElementById('historyResults');
        if (!historyContainer || !evaluations || evaluations.length === 0) {
            historyContainer.innerHTML = '<p>No evaluation history found.</p>';
            return;
        }

        const getScoreClass = (score) => {
            if (score >= 90) return 'score-excellent';
            if (score >= 80) return 'score-good';
            if (score >= 70) return 'score-average';
            return 'score-poor';
        };

        historyContainer.innerHTML = evaluations.map(evaluation => `
            <div class="history-item ${evaluation.isCurrent ? 'current' : ''}">
                <div class="history-info">
                    <h4>${evaluation.sport} Evaluation ${evaluation.isCurrent ? '<span class="current-badge">Current</span>' : ''}</h4>
                    <p>Evaluated on ${new Date(evaluation.evaluationDate).toLocaleDateString()}</p>
                </div>
                <div class="history-grade ${getScoreClass(evaluation.overallGrade)}">
                    ${evaluation.overallGrade}
                </div>
            </div>
        `).join('');
    }

    // Load and display evaluation history on main page
    async loadMainPageHistory() {
        try {
            const response = await this.apiCall('/athlete/evaluation/history');
            if (response.evaluations && response.evaluations.length > 0) {
                this.showMainPageHistory();
                this.displayMainPageHistory(response.evaluations.slice(0, 3)); // Show only last 3
            }
        } catch (error) {
            console.log('No evaluation history found for main page');
            this.hideMainPageHistory();
        }
    }

    // Show main page history section
    showMainPageHistory() {
        const section = document.getElementById('mainHistorySection');
        if (section) {
            section.style.display = 'block';
        }
    }

    // Hide main page history section
    hideMainPageHistory() {
        const section = document.getElementById('mainHistorySection');
        if (section) {
            section.style.display = 'none';
        }
    }

    // Display evaluation history on main page
    displayMainPageHistory(evaluations) {
        const historyContainer = document.getElementById('mainHistoryResults');
        if (!historyContainer || !evaluations || evaluations.length === 0) {
            this.hideMainPageHistory();
            return;
        }

        const getScoreClass = (score) => {
            if (score >= 90) return 'score-excellent';
            if (score >= 80) return 'score-good';
            if (score >= 70) return 'score-average';
            return 'score-poor';
        };

        historyContainer.innerHTML = evaluations.map(evaluation => `
            <div class="main-history-card ${evaluation.isCurrent ? 'current' : ''}">
                <h4>${evaluation.sport} Evaluation</h4>
                <div class="main-history-date">
                    ${new Date(evaluation.evaluationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })} at ${new Date(evaluation.evaluationDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <div class="main-history-grade ${getScoreClass(evaluation.overallGrade)}">
                    ${evaluation.overallGrade}
                </div>
                ${evaluation.isCurrent ? '<span class="main-history-badge">Current</span>' : ''}
            </div>
        `).join('');
    }

    // Show evaluation history from main page (opens dashboard)
    showEvaluationHistoryOnMain() {
        if (this.currentUser) {
            this.showDashboard();
            this.showEvaluationHistory();
        } else {
            this.showModal('login');
        }
    }

    // Loading State Management
    showLoading(message = 'Loading...') {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            const text = spinner.querySelector('p');
            if (text) text.textContent = message;
            spinner.style.display = 'flex';
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    // Message System
    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;

        container.appendChild(messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);

        // Click to dismiss
        messageDiv.addEventListener('click', () => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        });
    }

    // Form Validation Helpers
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Utility Functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(timeString) {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Form Helper - Convert height to inches
    convertHeightToInches(feet, inches) {
        return (parseInt(feet) || 0) * 12 + (parseInt(inches) || 0);
    }

    // Form Helper - Format height display
    formatHeight(totalInches) {
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return `${feet}'${inches}"`;
    }
}

// Enhanced Form Validation
class FormValidator {
    static validateAthleteProfile(formData) {
        const errors = [];

        // Required fields
        if (!formData.sportId) {
            errors.push('Sport selection is required');
        }

        if (!formData.age || formData.age < 13 || formData.age > 25) {
            errors.push('Valid age (13-25) is required');
        }

        if (!formData.videoUrl) {
            errors.push('Highlight reel URL is required');
        } else if (!this.isValidURL(formData.videoUrl)) {
            errors.push('Please provide a valid video URL');
        }

        // Optional field validations
        if (formData.height && (formData.height < 48 || formData.height > 96)) {
            errors.push('Height must be between 48-96 inches');
        }

        if (formData.weight && (formData.weight < 80 || formData.weight > 400)) {
            errors.push('Weight must be between 80-400 lbs');
        }

        if (formData.gpa && (formData.gpa < 0 || formData.gpa > 4.0)) {
            errors.push('GPA must be between 0.0-4.0');
        }

        if (formData.satScore && (formData.satScore < 400 || formData.satScore > 1600)) {
            errors.push('SAT score must be between 400-1600');
        }

        if (formData.actScore && (formData.actScore < 1 || formData.actScore > 36)) {
            errors.push('ACT score must be between 1-36');
        }

        return errors;
    }

    static isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Enhanced Performance Tracking
class PerformanceTracker {
    static trackFormSubmission(formType, success, errorMessage = null) {
        console.log(`Form Submission: ${formType}`, {
            success,
            timestamp: new Date().toISOString(),
            error: errorMessage
        });
    }

    static trackAPICall(endpoint, method, duration, success) {
        console.log(`API Call: ${method} ${endpoint}`, {
            duration: `${duration}ms`,
            success,
            timestamp: new Date().toISOString()
        });
    }

    static trackUserAction(action, details = {}) {
        console.log(`User Action: ${action}`, {
            ...details,
            timestamp: new Date().toISOString()
        });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    window.athleteAI = new AthleteAI();
    
    // Add global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        window.athleteAI?.showMessage('An unexpected error occurred. Please try again.', 'error');
    });
    
    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        window.athleteAI?.showMessage('An unexpected error occurred. Please try again.', 'error');
        event.preventDefault();
    });
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AthleteAI, FormValidator, PerformanceTracker };
} 