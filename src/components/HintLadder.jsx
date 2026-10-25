import { getHint } from "../lib/hints.js";

export default function HintLadder({ suggested, level, onAdvance, disabled }) {
  const hint = getHint(suggested, level);
  const canAdvance = level < 3 && suggested?.manglish && !disabled;

  return (
    <div className="hint-ladder">
      <div className="hint-ladder__steps" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span key={step} className={`hint-ladder__step ${level >= step ? "is-on" : ""}`} />
        ))}
      </div>
      <button
        type="button"
        className="hint-ladder__btn"
        onClick={onAdvance}
        disabled={disabled || (!canAdvance && level >= 3)}
        aria-expanded={level > 0}
        aria-label={
          level === 0
            ? "Hint step 1 of 3: first word in Manglish"
            : level === 1
              ? "Hint step 2 of 3: full Manglish phrase"
              : level === 2
                ? "Hint step 3 of 3: Manglish and English meaning"
                : "All hint steps revealed"
        }
      >
        <span className="hint-ladder__icon" aria-hidden="true" />
        {level === 0 ? "Stuck? Tap for a hint" : `Hint ${level} / 3`}
      </button>

      {hint ? (
        <div className="hint-ladder__reveal" role="status" aria-live="polite">
          <p className="hint-ladder__reveal-label">
            {level === 1 ? "First word" : level === 2 ? "Full phrase (Manglish)" : "Phrase + meaning"}
          </p>
          <p className="hint-ladder__text">{hint.text}</p>
          {level === 3 && hint.en ? <p className="hint-ladder__en">{hint.en}</p> : null}
        </div>
      ) : null}

      {!suggested?.manglish ? (
        <p className="hint-ladder__unavailable">No hint available for this turn.</p>
      ) : null}
    </div>
  );
}
