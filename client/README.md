# 🎓 ElevateYou Frontend

This is the **React + Vite + Tailwind CSS** frontend for the ElevateYou project.  
It provides a modern UI for resume analysis and AI interview features.  

---

## 🚀 Tech Stack
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios

---

## 🏗️ Phases Implemented

### ✅ Phase 1: Project Setup
- Created React project using **Vite**.
- Configured **Tailwind CSS**.
- Set up **React Router DOM** for navigation.

### ✅ Phase 2: AI Resume Analyzer
**2.1 Backend Integration**
- Connected to backend `/upload-resume` route using Axios.

**2.2 File Upload Form**
- Implemented PDF upload UI in `ResumeAnalyzer.jsx`.

**2.3 Feedback Parsing**
- Displayed feedback (summary, strengths, improvements, ATS keywords) returned by backend.

**2.4 UI Enhancement**
- Built reusable `FeedbackCard.jsx` component for clean display.
- Integrated into `ResumeAnalyzer.jsx` for structured feedback.

---

## ▶️ Running the Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
