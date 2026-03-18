exports.handler = async (event) => {
  try {
    // Only POST allowed
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method not allowed",
      };
    }

    // Parse request body
    const { image } = JSON.parse(event.body);

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: image,
                },
              },
              {
                type: "text",
                text: `
You are a professional YouTube thumbnail expert.

Analyze this thumbnail and return ONLY JSON (no extra text):

{
  "score": number (0-100),
  "ctr_prediction": "low" | "medium" | "high",
  "tips": ["tip1", "tip2", "tip3"],
  "title_suggestion": "better viral title"
}

Focus on:
- CTR (click-through rate)
- Emotion
- Contrast
- Text clarity
- Curiosity
`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // Safe parse
    let parsed;

    try {
      const txt =
        data.content?.map((b) => b.text || "").join("") || "";

      const clean = txt.replace(/```json|```/g, "").trim();

      parsed = JSON.parse(clean);
    } catch (e) {
      parsed = {
        score: 50,
        ctr_prediction: "medium",
        tips: ["AI response parsing failed"],
        title_suggestion: "Try improving text clarity",
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
