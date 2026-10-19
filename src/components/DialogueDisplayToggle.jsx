/** Segmented Manglish / Malayalam script control. */
export default function DialogueDisplayToggle({ mode, onChange, className = "" }) {
  return (
    <div
      className={`dialogue-toggle ${className}`.trim()}
      role="group"
      aria-label="Dialogue display language"
    >
      <button
        type="button"
        className={`dialogue-toggle__option ${mode === "manglish" ? "dialogue-toggle__option--active" : ""}`}
        aria-pressed={mode === "manglish"}
        onClick={() => onChange("manglish")}
      >
        Manglish
      </button>
      <button
        type="button"
        className={`dialogue-toggle__option ${mode === "malayalam" ? "dialogue-toggle__option--active" : ""}`}
        aria-pressed={mode === "malayalam"}
        onClick={() => onChange("malayalam")}
      >
        മലയാളം
      </button>
    </div>
  );
}
