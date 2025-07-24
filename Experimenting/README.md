# 🏆 Athlete.AI - AI-Powered Athletic Evaluation Platform

<div align="center">

![Athlete.AI Logo](https://img.shields.io/badge/Athlete-AI-blue?style=for-the-badge&logo=artificial-intelligence)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

**Unlock Your Athletic Potential with AI-Powered Evaluation**

*Comprehensive athlete analysis using advanced artificial intelligence to evaluate physical performance, academic excellence, and sport-specific skills through highlight video analysis.*

</div>

---

## 🎯 **Overview**

Athlete.AI is a cutting-edge web application that revolutionizes athlete evaluation by combining traditional athletic metrics with advanced AI video analysis. Our platform provides comprehensive 100-point scale evaluations across three critical dimensions.

### 📊 **Evaluation Categories**

| Category | Weight | Analysis Focus |
|----------|--------|----------------|
| 💪 **Physical Performance** | 35% | Height, weight, speed, strength, sport-specific measurements |
| 🎓 **Academic Excellence** | 30% | GPA, standardized test scores, AP courses, class ranking |
| 🎬 **Sport Performance** | 35% | AI video analysis, awards, leadership, achievements |

---

## ✨ **Key Features**

### 🤖 **AI-Powered Video Analysis**
- **OpenAI Vision Integration**: Advanced frame-by-frame analysis of athletic highlights
- **Sport-Specific Evaluation**: Tailored analysis for Basketball, Football, Soccer, Lacrosse, Hockey
- **Technical Breakdown**: Technique, execution, and game IQ scoring
- **Contextual Insights**: Strategic decision-making and tactical awareness evaluation

### 🏅 **Comprehensive Athletic Assessment**
- **Multi-Sport Support**: 15+ sports with sport-specific benchmarks
- **Awards Recognition**: State championships, all-league selections, MVP awards
- **Leadership Evaluation**: Team captain experience, mentorship roles
- **Historical Tracking**: Complete evaluation history with date/time stamps

### 🎨 **Modern User Experience**
- **Responsive Design**: Seamless experience across all devices
- **Real-Time Analysis**: Instant AI processing with professional loading indicators
- **Interactive Dashboard**: Intuitive navigation and data visualization
- **Secure Authentication**: JWT-based user accounts with encrypted passwords

---

## 🛠 **Technical Architecture**

### **Backend Stack**
```
Node.js + Express.js
├── 🔐 Authentication (JWT + bcrypt)
├── 🗄️ Database (SQLite with promise-based wrapper)
├── 🤖 AI Services
│   ├── OpenAI Vision Analysis (simulated)
│   ├── Video Processing Pipeline
│   └── Sport-Specific Grading Algorithms
├── 🛡️ Security (Helmet, CORS, Rate Limiting)
└── ✅ Validation (express-validator)
```

### **Frontend Stack**
```
Modern Web Technologies
├── 📱 Responsive HTML5
├── 🎨 Advanced CSS3 (Grid, Flexbox, Animations)
├── ⚡ Vanilla JavaScript (ES6+)
├── 🔄 AJAX API Integration
└── ♿ Accessibility Features
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v14 or higher)
- npm (v6 or higher)

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/AthleteAI.git
cd AthleteAI
```

2. **Install dependencies:**
```bash
npm install
```

3. **Initialize the database:**
```bash
npm run init-db
```

4. **Start the development server:**
```bash
npm start
```

5. **Open your browser:**
```
http://localhost:3000
```

---

## 📱 **Usage Guide**

### **Getting Your Athletic Evaluation**

1. **🔐 Create Account** - Register with your basic information
2. **🏃 Select Sport** - Choose your primary sport from 15+ options
3. **📊 Enter Data** - Input physical stats and academic achievements
4. **🎬 Add Video** - Provide your highlight reel URL (YouTube, Hudl, Vimeo)
5. **🤖 AI Analysis** - Watch as our AI analyzes your performance
6. **📈 View Results** - Get comprehensive grades and improvement suggestions
7. **📚 Track Progress** - Monitor your development over time

---

## 🔧 **API Reference**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User authentication |
| `/api/athlete/sports` | GET | Available sports list |
| `/api/athlete/profile` | POST | Submit athlete profile |
| `/api/athlete/evaluation` | GET | Current evaluation results |
| `/api/athlete/evaluation/history` | GET | Complete evaluation history |

---

## 🎮 **Development**

### **Available Scripts**
```bash
npm start          # Start production server
npm run dev        # Start development server (if available)
npm run init-db    # Initialize/reset database
```

### **Project Structure**
```
AthleteAI/
├── backend/
│   ├── database/       # Database models and initialization
│   ├── middleware/     # Authentication and validation
│   ├── routes/         # API endpoints
│   ├── services/       # AI analysis and grading logic
│   └── server.js       # Express server configuration
├── frontend/
│   └── index.html      # Main application HTML
├── public/
│   ├── css/           # Stylesheets
│   └── js/            # Client-side JavaScript
├── database/          # SQLite database files
└── docs/             # Documentation
```

---

## 🤖 **AI Analysis Features**

### **OpenAI Vision Integration**
- **Frame-by-Frame Analysis**: Detailed evaluation of 4-6 key video frames
- **Sport-Specific Recognition**: Tailored analysis for each sport
- **Technical Assessment**: Form, technique, and execution evaluation
- **Game Intelligence**: Decision-making and tactical awareness scoring

### **Upgrade to Real AI**
Currently using sophisticated simulation. To enable real OpenAI Vision:

```javascript
// Set your OpenAI API key
process.env.OPENAI_API_KEY = "your-api-key-here";

// Enable real analysis
const service = require('./backend/services/openaiVideoAnalysis');
service.enableRealAPI('your-api-key-here');
```

**Cost**: ~$0.50-2.00 per video analysis

---

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ **Support & Contact**

- **Issues**: [GitHub Issues](https://github.com/yourusername/AthleteAI/issues)
- **Email**: [Your Contact Email]

---

<div align="center">

**Built with ❤️ for athletes everywhere**

*Empowering the next generation of athletic talent through AI-driven insights*

**Created by Ari Krane**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/AthleteAI?style=social)](https://github.com/yourusername/AthleteAI/stargazers)

</div> 