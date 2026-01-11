// const express = require('express');
// const router = express.Router();
// const { getResumeFeedback } = require('../aiFeedback'); // Your AI logic

// router.post('/analyze-resume', async (req, res) => {
//   const { resumeText } = req.body;
//   if (!resumeText) {
//     return res.status(400).json({ error: 'Resume text is required' });
//   }

//   try {
//     const feedback = await getResumeFeedback(resumeText); // Use OpenAI/Ollama here
//     res.json(feedback);
//   } catch (error) {
//     console.error("AI error:", error.message);
//     res.status(500).json({
//       summary: "Could not analyze resume right now.",
//       strengths: [],
//       improvements: [],
//       atsKeywords: [],
//     });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getResumeFeedback } = require('../aiFeedback');

router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'No resume text provided' });

    const feedback = await getResumeFeedback(resumeText);
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

module.exports = router;
