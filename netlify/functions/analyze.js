exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Only POST allowed" };
    }

    const { image } = JSON.parse(event.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
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
Analyze this YouTube thumbnail and return ONLY JSON:

{
  "score": 0-100,
  "ctr_prediction": "low/medium/high",
  "tips": ["tip1", "tip2"],
  "title_suggestion": "better title"
}
`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    let parsed;

    try {
      const txt = data.content?.map((b) => b.text || "").join("") || "";
      parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());
    } catch {
      parsed = {
        score: 50,
        ctr_prediction: "medium",
        tips: ["AI error"],
        title_suggestion: "Improve thumbnail",
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
