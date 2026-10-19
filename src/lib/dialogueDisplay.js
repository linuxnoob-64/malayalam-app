export const DIALOGUE_DISPLAY_KEY = "malayalam-app-dialogue-display";

/** @typedef {'manglish' | 'malayalam'} DialogueDisplayMode */

/** @returns {DialogueDisplayMode} */
export function loadDialogueDisplayMode() {
  if (typeof window === "undefined") return "manglish";
  try {
    const v = localStorage.getItem(DIALOGUE_DISPLAY_KEY);
    if (v === "malayalam" || v === "manglish") return v;
  } catch {
    /* ignore */
  }
  return "manglish";
}

/** @param {DialogueDisplayMode} mode */
export function saveDialogueDisplayMode(mode) {
  try {
    localStorage.setItem(DIALOGUE_DISPLAY_KEY, mode);
    window.dispatchEvent(new CustomEvent("dialogue-display-change", { detail: mode }));
  } catch {
    /* ignore */
  }
}

/** @param {{ ml?: string, manglish?: string, en?: string }} line @param {DialogueDisplayMode} mode */
export function primaryDialogueText(line, mode) {
  if (!line) return "";
  if (mode === "malayalam") {
    return line.ml?.trim() || line.manglish?.trim() || "";
  }
  return line.manglish?.trim() || line.ml?.trim() || "";
}
