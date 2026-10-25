export function buildSummaryPhrases(messages) {
  const seen = new Set();
  const out = [];

  for (const m of messages) {
    if (m.role !== "assistant") continue;
    const p = m.suggested_reply;
    if (!p?.manglish?.trim()) continue;
    const key = p.manglish.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      ml: p.ml ?? "",
      manglish: p.manglish.trim(),
      en: p.en ?? "",
    });
  }

  return out;
}
