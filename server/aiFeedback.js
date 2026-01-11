const axios = require("axios");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getResumeFeedback = async (resumeText) => {
  try {
    if (process.env.AI_PROVIDER === "ollama") {
      console.log("⚡ Using Ollama locally...");

      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt: `
        Analyze the following resume text and return a JSON object with:
        - summary
        - strengths (array)
        - improvements (array)
        - atsKeywords (array)

        Resume Text:
        ${resumeText}
        `,
        stream: false
      });

      return JSON.parse(response.data.response); // expects JSON format
    } else {
      console.log("🌐 Using OpenAI (cloud)...");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a resume feedback assistant. Respond only in JSON."
          },
          {
            role: "user",
            content: `
            Analyze the following resume text and return a JSON object with:
            - summary
            - strengths (array)
            - improvements (array)
            - atsKeywords (array)

            Resume Text:
            ${resumeText}
            `
          }
        ],
      });

      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (err) {
    console.error("❌ AI Feedback Error:", err.message);

    // fallback mode
    return {
      summary: "Could not analyze resume right now.",
      strengths: [],
      improvements: [],
      atsKeywords: []
    };
  }
};

module.exports = { getResumeFeedback };