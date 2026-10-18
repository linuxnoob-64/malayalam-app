// Vercel serverless function: POST /api/chat
// The browser sends { scenarioId, history }. This file holds the API key,
// builds the prompt, calls the LLM, and returns one validated character turn.

import { GoogleGenAI } from "@google/genai";
import { SCENARIOS } from "../src/lib/scenarios.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";
const MAX_TURNS = 8;

function systemPrompt(s, turn) {
  return `You are ${s.character} in this situation: ${s.setting}.
You are talking with a teenager who grew up in the US hearing Malayalam at home. They understand a lot but freeze when speaking.

Rules:
- Speak casual, everyday spoken Malayalam (Kerala colloquial), never formal written Malayalam.
- Keep every line short: one or two sentences.
- Stay in character. Never mention being an AI.
- Steer the conversation so the user gets chances to use these target phrases: ${s.targetPhrases.join("; ")}.
- If the user's last message had a mistake or English mixed in, give ONE gentle correction, otherwise null.
- This is turn ${turn} of ${MAX_TURNS}. On the last turn, wrap the conversation up naturally.

Reply with ONLY this JSON, no other text:
{
  "line": { "ml": "<Malayalam script>", "manglish": "<romanized>", "en": "<English meaning>" },
  "correction": null or { "said": "<what they said>", "better_manglish": "<better phrasing>", "en": "<meaning>" },
  "suggested_reply": { "ml": "...", "manglish": "...", "en": "..." },
  "phrases_used": ["<target phrases the user used correctly in their last message>"]
}`;
}

function parseTurn(text) {
  const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  for (const k of ["ml", "manglish", "en"]) {
    if (typeof json.line?.[k] !== "string") throw new Error(`missing line.${k}`);
    if (typeof json.suggested_reply?.[k] !== "string") throw new Error(`missing suggested_reply.${k}`);
  }
  json.phrases_used ??= [];
  return json;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { scenarioId, history = [] } = req.body ?? {};
  const s = SCENARIOS[scenarioId];
  if (!s) return res.status(400).json({ error: "unknown scenario" });

  // history = [{ role: "user"|"assistant", content: "..." }]; assistant turns stored as their Manglish line
  const turn = Math.floor(history.length / 2) + 1;
  const messages = history.length ? history : [{ role: "user", content: "(conversation starts, you speak first)" }];

  // one retry if the model returns broken JSON
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
     const out = await ai.models.generateContent({
          model: MODEL,
          contents: messages.map(m => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
           })),
           config: {
           	systemInstruction: systemPrompt(s, turn),
    		maxOutputTokens: 600,
   	        responseMimeType: "application/json",
  	      },
            });
      const result = parseTurn(out.text);
      return res.status(200).json({ ...result, turn, done: turn >= MAX_TURNS });
    } catch (e) {
      if (attempt === 1) return res.status(502).json({ error: "AI reply failed, try again" });
    }
  }
}
