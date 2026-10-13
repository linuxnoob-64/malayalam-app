// The freeze button. No extra API call: every AI turn already includes
// `suggested_reply`, so hints are pure front-end logic (your code, visible to judges).
//
// level 0 = nothing shown
// level 1 = first word of a good reply
// level 2 = full reply in Manglish
// level 3 = full reply + English meaning (+ script)

export function getHint(suggested, level) {
  if (!suggested || level <= 0) return null;
  const words = suggested.manglish.trim().split(/\s+/);
  if (level === 1) return { text: words[0] + " ...", level };
  if (level === 2) return { text: suggested.manglish, level };
  return { text: suggested.manglish, ml: suggested.ml, en: suggested.en, level: 3 };
}

// Track hint use per turn so the Summary screen can show
// "phrases you needed help with" vs "phrases you said on your own".
export function recordTurn(stats, { hintLevel, phrasesUsed, suggested }) {
  stats.turns += 1;
  stats.hintsUsed += hintLevel > 0 ? 1 : 0;
  for (const p of phrasesUsed) stats.saidOnOwn.add(p);
  if (hintLevel >= 2) stats.neededHelp.push(suggested);
  return stats;
}

export const newStats = () => ({ turns: 0, hintsUsed: 0, saidOnOwn: new Set(), neededHelp: [] });
