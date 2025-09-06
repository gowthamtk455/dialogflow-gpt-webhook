const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Replace with your OpenAI API key
const OPENAI_API_KEY = "// Read OpenAI API key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Webhook endpoint for Dialogflow
app.post("/webhook", async (req, res) => {
  try {
    const userMessage = req.body.queryResult.queryText;

    // Call GPT API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const botReply = response.data.choices[0].message.content;

    // Send reply to Dialogflow
    res.json({
      fulfillmentText: botReply
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({
      fulfillmentText: "Sorry, something went wrong."
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});