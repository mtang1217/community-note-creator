// summarizer.js

console.log("Loaded Gemini API key?", window.GEMINI_API_KEY ? "YES" : "NO");

function fallbackSummarizer(comments, n = 5) {
  // ... (this function remains the same)
  try {
    if (!Array.isArray(comments) || comments.length === 0) {
      return "No comments to summarize.";
    }
    const texts = comments
      .map(c => (typeof c === "string" ? c : (c && c.text) ? c.text : ""))
      .filter(Boolean);
    if (texts.length === 0) return "No comments to summarize.";
    const top = texts.slice(0, n).map((t, i) => {
      const trimmed = t.length > 180 ? t.slice(0, 180) + "…" : t;
      return `${i + 1}. ${trimmed}`;
    });
    return "Top comments:\n\n" + top.join("\n\n");
  } catch (e) {
    console.error("[CN] fallbackSummarizer failed:", e);
    return "No comments to summarize.";
  }
}

window.summarizeComments = async function (comments, n = 10) {
  try {
    if (!window.GEMINI_API_KEY) {
      console.warn("[CN] No Gemini API key found. Falling back to local summarizer.");
      return fallbackSummarizer(comments, n);
    }

    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return "No comments to summarize.";
    }

    const topComments = comments.slice(0, n).map(c =>
      typeof c === "string" ? c : (c?.text || "")
    ).join("\n\n");

    const API_KEY = window.GEMINI_API_KEY;
    
    // --- THIS IS THE CORRECTED LINE ---
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const prompt = `You are an AI that summarizes social media comments in the style of Twitter's Community Notes. Your goal is to provide neutral, factual context based on the provided comments. Do not add your own opinion.

Your output should be a short, easy-to-read summary. Start the summary with a title like "### Community Note". Follow it with a sub-header like "**Readers added context they thought people might want to know**".

Here are the top ${n} comments to summarize:
---
${topComments}
---

Generate the summary now.`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 250,
        }
      })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error("[CN] Gemini API Error:", JSON.stringify(errorData, null, 2));
        return fallbackSummarizer(comments, n);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      console.error("[CN] Gemini API returned no content:", JSON.stringify(data, null, 2));
      return fallbackSummarizer(comments, n);
    }

  } catch (err) {
    console.error("[CN] Gemini API request failed:", err);
    return fallbackSummarizer(comments, n);
  }
};