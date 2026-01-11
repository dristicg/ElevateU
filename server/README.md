# 🎓 ElevateYou Backend

This is the **Node.js + Express + PostgreSQL** backend for the ElevateYou project.  
It provides REST APIs for authentication, resume analysis, and (later) AI interview features.

---

## 🚀 Tech Stack
- Node.js + Express
- PostgreSQL (pg / pool)
- Multer (file uploads)
- pdf-parse (extract text from resumes)
- dotenv
- CORS

---

## 🏗️ Phases Implemented

### ✅ Phase 1: Backend Setup
**1.1 Project Setup**
- Initialized Node.js + Express project.
- Installed dependencies (`express`, `cors`, `pg`, `dotenv`).

**1.2 Authentication Routes**
- Added `auth.routes.js` (Register & Login placeholder).
- Integrated PostgreSQL connection (`db.js`).
- Tested DB with `/test-db` route.

---

### ✅ Phase 2: AI Resume Analyzer

**2.1 File Upload Setup**
- Configured **Multer** for PDF uploads.
- Created `uploads/` folder for storing temporary resume files.

**2.2 PDF Text Extraction**
- Used **pdf-parse** to extract raw text from uploaded resumes.

**2.3 AI Feedback (Mock)**
- Built `aiFeedback.js` that returns:
  - `summary`
  - `strengths`
  - `improvements`
  - `atsKeywords`
- Currently mocked (real OpenAI integration will be Phase 4).

**2.4 API Endpoint**
- `/upload-resume`  
  Accepts PDF file → Extracts text → Sends to `getResumeFeedback()` → Returns structured feedback JSON.

---

## ▶️ Running the Backend
```bash
# Install dependencies
npm install

# Start server
node index.js

PORT=5000
DATABASE_URL=your_postgres_url_here
