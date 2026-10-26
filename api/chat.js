import { SCENARIOS } from "../src/lib/scenarios.js";

const OPENER = "(conversation starts, you speak first)";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { scenarioId, history = [], addressAs } = req.body ?? {};

  const s = SCENARIOS[scenarioId];
  if (!s) return res.status(400).json({ error: "unknown scenario" });

  const turn = Math.floor(history.length / 2) + 1;
  const done = turn >= 8;
  const first = history.length === 0;

  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const user_message = first ? OPENER : lastUser?.content ?? OPENER;
  const chat_history = first ? OPENER : history.map((m) => `${m.role}: ${m.content}`).join("\n");
  const address =
    addressAs === "mole"
      ? "Address the learner as mole (daughter, female)"
      : addressAs === "kunje"
        ? "Address the learner as kunje, gender-neutral, avoid mone or mole"
        : "Address the learner as mone (son, male)";
  const scenario = [s.character, s.setting, s.targetPhrases.join("; "), address].join("; ");

  const host = req.headers.host ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  const retryDelays = [1500, 3000];
  let data;
  for (let attempt = 0; ; attempt++) {
    let status;
    let error;
    try {
      const r = await fetch(`${protocol}://${host}/api/index`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_message, scenario, turn, chat_history }),
      });
      data = await r.json().catch(() => ({}));
      if (r.ok) break;
      status = r.status;
      error = data.error ?? `backend returned ${r.status}`;
    } catch (err) {
      error = String(err?.message ?? err);
    }

    const message = typeof error === "string" ? error : JSON.stringify(error);
    const busy = status === 503 || message.includes("UNAVAILABLE") || /high demand/i.test(message);
    if (!busy) return res.status(502).json({ error });
    if (attempt >= retryDelays.length) {
      return res.status(503).json({ error: "The AI is busy right now, please tap Retry in a moment." });
    }
    await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
  }

  const grade = first ? null : data.grade;
  const rationale = first ? null : data.rationale;
  const correction =
    !first && !done && typeof grade === "number" && grade <= 3
      ? { said: user_message, better_manglish: data.hint_full_romanized, en: rationale }
      : null;

  return res.status(200).json({
    line: { ml: data.script, manglish: data.romanized, en: data.english },
    correction,
    suggested_reply: done
      ? null
      : {
          ml: data.hint_word,
          manglish: data.hint_full_romanized,
          en: data.hint_full_english,
        },
    phrases_used: [],
    turn,
    done,
    grade,
    rationale,
  });
}
