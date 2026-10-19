/**
 * Build 3–5 summary phrases from real session stats and messages.
 * Phrases from hints, corrections, and API phrases_used.
 */

/** @param {import('./hints.js').SessionStats} stats */
/** @param {Array<{ correction?: { better_manglish: string, en: string } | null }>} messages */
export function buildSummaryPhrases(stats, messages) {
  const seen = new Set();
  /** @type {{ ml: string, manglish: string, en: string }[]} */
  const out = [];

  const add = (p) => {
    if (!p?.manglish?.trim()) return;
    const key = p.manglish.toLowerCase().trim();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      ml: p.ml ?? "",
      manglish: p.manglish.trim(),
      en: p.en ?? "",
    });
  };

  for (const s of stats.neededHelp ?? []) add(s);

  for (const m of messages) {
    if (m.correction?.better_manglish) {
      add({
        ml: "",
        manglish: m.correction.better_manglish,
        en: m.correction.en ?? "",
      });
    }
  }

  if (out.length < 3 && stats.saidOnOwn?.size) {
    for (const p of stats.saidOnOwn) {
      if (out.length >= 5) break;
      add({ ml: "", manglish: p, en: "" });
    }
  }

  return out.slice(0, 5);
}
