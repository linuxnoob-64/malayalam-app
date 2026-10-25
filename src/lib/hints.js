// Three-tap hint ladder uses suggested_reply from each assistant turn.

export function getHint(suggested, level) {
  if (!suggested || level <= 0) return null;
  const words = suggested.manglish.trim().split(/\s+/);
  if (level === 1) return { text: words[0] + " ...", level };
  if (level === 2) return { text: suggested.manglish, level };
  if (level === 3) {
    return { text: suggested.manglish, en: suggested.en, level: 3 };
  }
  return null;
}

export function recordTurn(stats, { hintLevel, phrasesUsed, suggested }) {
  stats.turns += 1;
  stats.hintsUsed += hintLevel > 0 ? 1 : 0;
  for (const p of phrasesUsed) stats.saidOnOwn.add(p);
  if (hintLevel >= 2 && suggested) stats.neededHelp.push(suggested);
  return stats;
}

export const newStats = () => ({
  turns: 0,
  hintsUsed: 0,
  saidOnOwn: new Set(),
  neededHelp: [],
});
