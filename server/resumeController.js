import { extractTextFromPDF } from "../services/pdfExtractor.js";
import { analyzeResume } from "../services/resumeAnalyzer.js";

export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const extractedText = await extractTextFromPDF(filePath);

    const feedback = await analyzeResume(extractedText);

    res.json({
      message: "Resume analyzed successfully",
      extractedText,
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error analyzing resume" });
  }
};
