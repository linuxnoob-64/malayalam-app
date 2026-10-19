import { useDialogueDisplay } from "../hooks/useDialogueDisplay.js";
import { primaryDialogueText } from "../lib/dialogueDisplay.js";
import SpeakerButton from "./SpeakerButton.jsx";

/** Primary dialogue (Manglish or Malayalam) plus English meaning. */
export default function TripleLine({ line, compact = false, showListen = false }) {
  const { mode } = useDialogueDisplay();

  if (!line) return null;

  const primary = primaryDialogueText(line, mode);
  const primaryIsScript = mode === "malayalam" && Boolean(line.ml?.trim());

  return (
    <div className={`triple-line ${compact ? "triple-line--compact" : ""}`}>
      <div className="triple-line__content">
        {primary ? (
          <p
            className={
              primaryIsScript
                ? "triple-line__ml triple-line__primary"
                : "triple-line__manglish triple-line__primary"
            }
            lang={primaryIsScript ? "ml" : undefined}
          >
            {primary}
          </p>
        ) : null}
        {line.en ? <p className="triple-line__en">{line.en}</p> : null}
      </div>
      {showListen ? <SpeakerButton line={line} /> : null}
    </div>
  );
}
