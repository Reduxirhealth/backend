const express = require("express");
const cors    = require("cors");
require("dotenv").config();

// v4 import
const { OpenAI } = require("openai");

const app    = express();
const port   = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

app.get("/", (req, res) => res.send("CoachBot backend running"));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
