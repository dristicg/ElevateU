const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const resumeRoutes = require('./routes/resume');
const { getResumeFeedback } = require('./aiFeedback');

const app = express();
app.use(cors());

// Increase body size limits
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
const authRoutes = require('./auth.routes');
app.use('/api/auth', authRoutes);
app.use('/api', resumeRoutes);

// DB Test
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ DB query failed:", err);
    res.status(500).send('DB connection failed');
  }
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// Upload route
app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    const extractedText = data.text;
    const feedback = await getResumeFeedback(extractedText);

    res.status(200).json({
      message: 'Resume analyzed successfully',
      extractedText,
      feedback
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Resume analysis failed' });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
