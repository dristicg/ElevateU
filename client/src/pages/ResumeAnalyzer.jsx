import axios from "axios";
import React, { useState } from "react";
import './ResumeAnalyzer.css';
import ResultCard from '../components/ResultCard';
import { FiFileText, FiUpload, FiThumbsUp, FiAlertCircle, FiTarget } from 'react-icons/fi';

// Call backend API for resume analysis
export async function analyzeResume(extractedText) {
  try {
    const response = await axios.post("/api/analyze-resume", { resumeText: extractedText });
    return response.data;
  } catch (error) {
    console.error("Error analyzing resume:", error.message);
    return {
      summary: "Could not analyze resume right now.",
      strengths: [],
      improvements: [],
      atsKeywords: [],
    };
  }
}

// ---- Function to call Ollama ----
async function analyzeWithOllama(extractedText) {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `You are a resume analyzer. Analyze the following resume text and return JSON with:
      summary, strengths (3), improvements (3), atsKeywords (list of 5).
      
      Resume:
      ${extractedText}`,
      stream: false,
    });

    const text = response.data.response;

    // Try parsing JSON
    return JSON.parse(text);
  } catch (error) {
    console.error("Ollama error:", error.message);
    return null; // fallback to OpenAI
  }
}

// ---- Function to call OpenAI ----
async function analyzeWithOpenAI(extractedText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a resume analyzer. Return only JSON with summary, strengths, improvements, atsKeywords.",
        },
        {
          role: "user",
          content: extractedText,
        },
      ],
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI error:", error.message);
    return {
      summary: "Could not analyze resume right now.",
      strengths: [],
      improvements: [],
      atsKeywords: [],
    };
  }
}

// ---- Hybrid Analyzer (internal) ----
// This is an internal helper that tries Ollama first and falls back to OpenAI.
// It is not exported to avoid duplicate top-level exports in this module.
async function analyzeResumeHybrid(extractedText) {
  // 1st try Ollama
  const ollamaResult = await analyzeWithOllama(extractedText);
  if (ollamaResult) return ollamaResult;

  // fallback OpenAI
  return await analyzeWithOpenAI(extractedText);
}

// --- Default React component for the Resume Analyzer page ---
export default function ResumeAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = React.createRef();

  const handleAnalyze = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const result = await analyzeResume(text);
      setFeedback(result);
    } catch (err) {
      console.error(err);
      setFeedback({ summary: "Analysis failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // This is a simplified example.
      // For PDF, you'd need a library like pdf.js on the client
      // or send the file to the backend for parsing.
      const reader = new FileReader();
      reader.onload = (e) => {
        // For simplicity, we assume the file is text-based.
        // A real implementation would handle PDF parsing.
        setText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const resetState = () => {
    setText("");
    setFeedback(null);
    setLoading(false);
  }

  return (
    <div className="analyzer-container">
      <div className="analyzer-header">
        <h1>ElevateYou</h1>
        <p>AI-Powered Resume Insights, Instantly.</p>
      </div>

      {!feedback ? (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept=".pdf,.txt,.md"
          />
          <button className="upload-btn" onClick={triggerFileUpload}>
            <FiUpload /> Upload Resume (PDF)
          </button>

          <div className="divider">or</div>

          <textarea
            className="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste Resume Text"
          />
          <button className="analyze-btn" onClick={handleAnalyze} disabled={loading || !text}>
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          <p className="privacy-note">Your data stays private and is never stored.</p>
        </>
      ) : (
        <div className="results-container">
          <h2 className="results-header">Your Analysis Results</h2>
          <ResultCard icon={<FiFileText />} title="Summary">
            <p>{feedback.summary}</p>
          </ResultCard>
          <ResultCard icon={<FiThumbsUp />} title="Strengths">
            <ul>
              {(feedback.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </ResultCard>
          <ResultCard icon={<FiAlertCircle />} title="Areas for Improvement">
            <ul>
              {(feedback.improvements || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </ResultCard>
          <ResultCard icon={<FiTarget />} title="ATS Keywords">
            <ul>
              {(feedback.atsKeywords || []).map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </ResultCard>
          <a onClick={resetState} className="reanalyze-link">Re-analyze or Upload Another Resume</a>
        </div>
      )}
    </div>
  );
}
