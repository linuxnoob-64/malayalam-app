import { useCallback, useEffect, useState } from "react";
import {
  loadDialogueDisplayMode,
  saveDialogueDisplayMode,
} from "../lib/dialogueDisplay.js";

export function useDialogueDisplay() {
  const [mode, setModeState] = useState(() => loadDialogueDisplayMode());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "malayalam-app-dialogue-display") {
        setModeState(loadDialogueDisplayMode());
      }
    };
    const onCustom = (e) => {
      if (e.detail === "malayalam" || e.detail === "manglish") {
        setModeState(e.detail);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("dialogue-display-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("dialogue-display-change", onCustom);
    };
  }, []);

  const setMode = useCallback((next) => {
    if (next !== "manglish" && next !== "malayalam") return;
    saveDialogueDisplayMode(next);
    setModeState(next);
  }, []);

  return { mode, setMode, isMalayalam: mode === "malayalam", isManglish: mode === "manglish" };
}
