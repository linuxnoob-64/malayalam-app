const STORAGE_KEY = "malayalam-app-saved-phrases";

/** @typedef {{ id: string, ml: string, manglish: string, en: string, savedAt: number, scenarioId?: string }} SavedPhrase */

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeKey(phrase) {
  const m = (phrase.manglish ?? "").toLowerCase().trim();
  if (m) return m;
  return (phrase.ml ?? "").toLowerCase().trim();
}

/** @returns {SavedPhrase[]} */
export function loadSavedPhrases() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) => p && typeof p.id === "string" && (p.manglish || p.ml));
  } catch {
    return [];
  }
}

/** @param {SavedPhrase[]} phrases */
function persist(phrases) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
    window.dispatchEvent(new CustomEvent("malayalam-phrases-updated"));
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {{ ml?: string, manglish?: string, en?: string, scenarioId?: string }} phrase
 */
export function savePhrase(phrase) {
  const manglish = phrase?.manglish?.trim() ?? "";
  const ml = phrase?.ml?.trim() ?? "";
  if (!manglish && !ml) {
    return { saved: false, phrases: loadSavedPhrases(), persisted: false };
  }

  const key = normalizeKey({ manglish, ml });
  const existing = loadSavedPhrases();
  if (existing.some((p) => normalizeKey(p) === key)) {
    return { saved: false, phrases: existing, persisted: true };
  }

  const entry = {
    id: newId(),
    ml,
    manglish: manglish || ml,
    en: phrase.en ?? "",
    savedAt: Date.now(),
    scenarioId: phrase.scenarioId,
  };
  const next = [entry, ...existing];
  const persisted = persist(next);
  return { saved: persisted, phrases: persisted ? next : existing, persisted };
}

/** @param {Array<{ ml?: string, manglish?: string, en?: string }>} phrases @param {string} [scenarioId] */
export function savePhrasesBulk(phrases, scenarioId) {
  let list = loadSavedPhrases();
  let added = 0;
  for (const p of phrases) {
    const key = normalizeKey(p);
    if (!key || list.some((x) => normalizeKey(x) === key)) continue;
    list = [
      {
        id: newId(),
        ml: p.ml ?? "",
        manglish: (p.manglish ?? p.ml ?? "").trim(),
        en: p.en ?? "",
        savedAt: Date.now(),
        scenarioId,
      },
      ...list,
    ];
    added += 1;
  }
  const persisted = added > 0 ? persist(list) : true;
  return { added, phrases: list, persisted };
}

export function isPhraseSaved(phrase) {
  const key = normalizeKey(phrase);
  if (!key) return false;
  return loadSavedPhrases().some((p) => normalizeKey(p) === key);
}

/** @param {string} id */
export function removePhrase(id) {
  const next = loadSavedPhrases().filter((p) => p.id !== id);
  persist(next);
  return next;
}

export function subscribePhrasesUpdated(callback) {
  const handler = () => callback(loadSavedPhrases());
  window.addEventListener("malayalam-phrases-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("malayalam-phrases-updated", handler);
    window.removeEventListener("storage", handler);
  };
}
