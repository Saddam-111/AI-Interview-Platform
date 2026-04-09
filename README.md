# AI Interview Platform - Complete Production Guide

## Quick Start

### Development
```bash
# Backend
cd server && npm install && npm run dev

# Frontend
cd client && npm install && npm run dev
```

## Project Structure

```
interview_project/
├── client/                 # React Frontend (Vite)
├── server/                 # Express Backend
└── README.md              # This file
```

## Features

- 🔐 User Authentication (JWT)
- 🎯 AI-Powered Interview Questions
- 📝 Multiple Rounds (Assessment, Coding, Core, HR)
- 📊 Performance Reports & Analytics
- 💬 AI Chat Coach with Resume Context
- 📄 Resume Parsing with AI
- 🎓 Personalized Mock Tests
- 🌙 Dark/Light Mode
- 📱 Responsive UI

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-3.5-turbo
CLIENT_URL=http://localhost:5173
```

## Production Build

### Frontend
```bash
cd client
npm run build
# Deploy 'dist' folder
```

### Backend
```bash
cd server
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current User |
| POST | /api/interview/start | Start Interview |
| GET | /api/interview/:id | Get Interview |
| GET | /api/interview/:id/questions | Get Questions |
| POST | /api/interview/:id/answer | Submit MCQ |
| POST | /api/interview/:id/code | Submit Code |
| POST | /api/interview/:id/subjective | Submit Answer |
| POST | /api/interview/:id/next-round | Next Round |
| POST | /api/report/generate/:id | Generate Report |
| GET | /api/report/:id | Get Report |
| POST | /api/ai/chat | AI Chat |
| POST | /api/ai/resume-parse | Parse Resume |

## Bug Fixes Applied

1. ✅ Fixed score calculation (average instead of sum)
2. ✅ Added /auth/me route protection middleware
3. ✅ Fixed User model education field type (String → [String])
4. ✅ Fixed resume parsing JSON error handling
5. ✅ Fixed AI chat with resume context
6. ✅ Fixed interview totalScore calculation in nextRound

## Works Without AI Key

The platform works in fallback mode without OpenAI API:
- Fallback questions for all rounds
- Template-based reports
- Basic answer evaluation
- Default AI chat responses