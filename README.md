# 🎯 AI Calling Platform

An intelligent voice-based AI assistant platform designed for mock interviews, HR query handling, and interactive entertainment. Practice interviews, get real-time feedback, and improve your communication skills.

🌐 **Live Demo:** [ai-frontend-peach-five.vercel.app](https://ai-frontend-peach-five.vercel.app)

---

## ✨ Features

### Core Functionality
- **AI-Powered Mock Interviews** - Practice interviews with an intelligent AI assistant
- **Personalized Questions** - Questions tailored to your candidate profile and skills
- **Real-Time Feedback** - Instant suggestions and performance analysis
- **Timed Sessions** - Simulate real interview conditions with countdown timers
- **Multi-Domain Support** - Interviews, HR queries, and entertainment modes

### Candidate Profile
- **Tech Stack Selection** - Choose your technologies (React, JavaScript, CSS, etc.)
- **Experience Level** - Tailored questions based on seniority
- **Role Specification** - Frontend, Backend, Full Stack, or specialized roles

### User Experience
- **Voice Interaction** - Natural conversation with AI assistant
- **Responsive Design** - Access from any device
- **Real-Time Processing** - Instant responses and feedback
- **Session Recording** - Review your performance after each session

---

## 🛠️ Technologies

| Category | Technologies |
|----------|-------------|
| **Frontend** | React.js, React Router |
| **Styling** | CSS3 / Tailwind CSS |
| **Voice/AI** | Web Speech API / AI Service Integration |
| **HTTP Client** | Axios |
| **State Management** | React Context API / Hooks |

---

## 🚀 Quick Start

bash
# Clone the repository
git clone https://github.com/Mourya7603/ai-frontend.git
cd ai-frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

---

## 📡 API Integration

This frontend connects to an AI backend service for question generation, voice processing, and feedback analysis.

### Expected API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profile/create` | Create candidate profile |
| GET | `/api/questions/generate` | Generate personalized questions |
| POST | `/api/response/analyze` | Analyze candidate response |
| GET | `/api/feedback/:sessionId` | Get session feedback |
| POST | `/api/interview/start` | Start interview session |
| POST | `/api/interview/end` | End interview session |

---

## 🎯 Key Features Breakdown

### Candidate Profile Setup
- **Technology Selection** - Choose your tech stack (React, JavaScript, CSS, etc.)
- **Experience Level** - Select from Entry, Mid, Senior, Lead levels
- **Role Focus** - Frontend, Backend, Full Stack, or specialized roles
- **Goal Setting** - Practice mode, assessment mode, or entertainment

### Interview Modes

| Mode | Description | Features |
|------|-------------|----------|
| **Mock Interview** | Simulate real job interview | Timed questions, scoring, detailed feedback |
| **HR Query** | Practice HR-related questions | Behavioral questions, company culture fit |
| **Entertainment** | Casual conversation with AI | Fun facts, trivia, general chat |

### Real-Time Features
- **Voice Recognition** - Speak naturally, AI understands and responds
- **Text-to-Speech** - AI responses read aloud for immersive experience
- **Typing Indicators** - Visual feedback while AI processes
- **Performance Metrics** - Real-time scoring on clarity, relevance, confidence

### Feedback & Analytics
- **Question-by-Question Analysis** - Detailed breakdown of each response
- **Strengths & Weaknesses** - Identify areas for improvement
- **Suggested Resources** - Learning materials for weak areas
- **Progress Tracking** - Monitor improvement over multiple sessions

---

## 🎨 User Interface

### Dashboard
- Quick access to different interview modes
- View recent sessions and scores
- Profile management

### Interview Screen
- Question display area
- Voice input controls (mic on/off)
- Timer showing remaining time
- Real-time feedback during response
- Next question / End session buttons

### Results Screen
- Overall score and performance rating
- Detailed feedback per question
- Comparison with previous sessions
- Option to retry or start new session

---

## 📱 Responsive Design

| Device | Experience |
|--------|------------|
| **Desktop** | Full interface with all controls visible |
| **Tablet** | Optimized layout with touch-friendly buttons |
| **Mobile** | Simplified view, voice-first interaction |

---

## 🚦 Future Enhancements

- [ ] Multiple language support
- [ ] Video interview simulation
- [ ] Code challenge integration
- [ ] Peer-to-peer mock interviews
- [ ] Resume parsing for personalized questions
- [ ] Company-specific interview practice
- [ ] Certification upon completion
- [ ] Social sharing of achievements
- [ ] Mobile app version

---

## 📧 Contact

**Developer:** Mangalapalli Mourya

**Email:** magalapallimourya@gmail.com

**GitHub:** [@Mourya7603](https://github.com/Mourya7603)

---

⭐ If you find this project helpful, please give it a star on GitHub!

---
