/** Normalize for Manglish / Malayalam / English comparison. */
export function normalizeReplyText(text) {
  return (text ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Manglish-friendly normalization (hyphens, common spelling drift). */
export function normalizeManglish(text) {
  return normalizeReplyText(text)
    .replace(/-/g, " ")
    .replace(/\b(njan|njaan)\b/g, "njan")
    .replace(/\s+/g, " ")
    .trim();
}

function hasMalayalamScript(text) {
  return /[\u0D00-\u0D7F]/.test(text ?? "");
}

function words(text) {
  const n = normalizeManglish(text);
  if (!n) return [];
  return n.split(" ").filter(Boolean);
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const row = new Array(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[n];
}

function levenshteinRatio(a, b) {
  const na = normalizeManglish(a);
  const nb = normalizeManglish(b);
  if (!na && !nb) return 1;
  if (!na || !nb) return 0;
  const dist = levenshtein(na, nb);
  const maxLen = Math.max(na.length, nb.length);
  return 1 - dist / maxLen;
}

function malayalamCharRatio(a, b) {
  const na = normalizeReplyText(a).replace(/[^\u0D00-\u0D7F\s]/gu, "").replace(/\s+/g, "");
  const nb = normalizeReplyText(b).replace(/[^\u0D00-\u0D7F\s]/gu, "").replace(/\s+/g, "");
  if (!na && !nb) return 0;
  if (!na || !nb) return 0;
  const dist = levenshtein(na, nb);
  const maxLen = Math.max(na.length, nb.length);
  return 1 - dist / maxLen;
}

/** Fuzzy word overlap — credit partial / misspelled Manglish. */
function fuzzyWordScore(user, expected) {
  const uw = words(user);
  const ew = words(expected);
  if (ew.length === 0) return 0;
  if (uw.length === 0) return 0;

  let matched = 0;
  for (const target of ew) {
    let best = 0;
    for (const u of uw) {
      if (u === target) {
        best = 1;
        break;
      }
      const maxLen = Math.max(u.length, target.length);
      if (maxLen === 0) continue;
      const sim = 1 - levenshtein(u, target) / maxLen;
      best = Math.max(best, sim);
    }
    if (best >= 0.62) matched += best;
  }
  return matched / ew.length;
}

function diceSimilarity(a, b) {
  const sa = new Set(words(a));
  const sb = new Set(words(b));
  if (sa.size === 0 && sb.size === 0) return 0;
  if (sa.size === 0 || sb.size === 0) return 0;
  let overlap = 0;
  for (const w of sa) {
    if (sb.has(w)) overlap += 1;
  }
  return (2 * overlap) / (sa.size + sb.size);
}

/**
 * 0–100 similarity between user reply and suggested_reply (Manglish and/or Malayalam script).
 * @param {string} userReply
 * @param {{ manglish?: string, ml?: string }} suggested
 */
export function scoreReplySimilarity(userReply, suggested) {
  if (!userReply?.trim()) return 0;
  const manglish = suggested?.manglish?.trim();
  const ml = suggested?.ml?.trim();
  if (!manglish && !ml) return null;

  const scores = [];

  if (manglish) {
    const fuzzy = fuzzyWordScore(userReply, manglish);
    const dice = diceSimilarity(userReply, manglish);
    const lev = levenshteinRatio(userReply, manglish);
    scores.push(fuzzy * 0.45 + dice * 0.2 + lev * 0.35);
  }

  if (ml && hasMalayalamScript(userReply)) {
    scores.push(malayalamCharRatio(userReply, ml) * 0.85 + fuzzyWordScore(userReply, manglish || "") * 0.15);
  }

  if (ml && !hasMalayalamScript(userReply) && manglish) {
    scores.push(levenshteinRatio(userReply, manglish) * 0.5 + fuzzyWordScore(userReply, manglish) * 0.5);
  }

  let best = scores.length ? Math.max(...scores) : 0;

  if (manglish) {
    const u = normalizeManglish(userReply);
    const e = normalizeManglish(manglish);
    if (u && e && (u.includes(e) || e.includes(u))) {
      best = Math.max(best, 0.88);
    }
  }

  let pct = Math.round(Math.min(1, Math.max(0, best)) * 100);
  if (pct === 0 && userReply.trim() && (manglish || ml)) {
    pct = 22;
  }
  return pct;
}

export function similarityLabel(score) {
  if (score == null) return "No suggested line to compare";
  if (score >= 85) return "Very close match";
  if (score >= 70) return "Good match";
  if (score >= 50) return "Partial match";
  if (score >= 30) return "Loose match";
  return "Try closer to the suggested phrase";
}
