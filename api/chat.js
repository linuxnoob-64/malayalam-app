import { SCENARIOS } from "../src/lib/scenarios.js";

const OPENER = "(conversation starts, you speak first)";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { scenarioId, history = [] } = req.body ?? {};

  const s = SCENARIOS[scenarioId];
  if (!s) return res.status(400).json({ error: "unknown scenario" });

  const turn = Math.floor(history.length / 2) + 1;
  const done = turn >= 8;
  const first = history.length === 0;

  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const user_message = first ? OPENER : lastUser?.content ?? OPENER;
  const chat_history = first ? OPENER : history.map((m) => `${m.role}: ${m.content}`).join("\n");
  const scenario = [s.character, s.setting, s.targetPhrases.join("; ")].join("; ");

  const host = req.headers.host ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  let data;
  try {
    const r = await fetch(`${protocol}://${host}/api/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_message, scenario, turn: String(turn), chat_history }),
    });
    data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(502).json({ error: data.error ?? `backend returned ${r.status}` });
  } catch (err) {
    return res.status(502).json({ error: String(err?.message ?? err) });
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
