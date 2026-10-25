import { useDialogueDisplay } from "../hooks/useDialogueDisplay.js";
import { primaryDialogueText } from "../lib/dialogueDisplay.js";

export default function ReplyMatchList({ turnGrades }) {
  const { mode } = useDialogueDisplay();

  if (!turnGrades?.length) return null;

  return (
    <section className="reply-match" aria-labelledby="reply-match-heading">
      <h2 id="reply-match-heading">How your replies were graded</h2>
      <ol className="reply-match__list">
        {turnGrades.map((t, i) => {
          const suggestedPrimary = t.suggested ? primaryDialogueText(t.suggested, mode) : "";
          return (
            <li key={i} className="reply-match__item">
              <div className="reply-match__score" data-tier={tier(t.grade)}>
                {t.score}%
              </div>
              <div className="reply-match__body">
                <p className="reply-match__label">{t.label}</p>
                <p>
                  <strong>You:</strong> {t.userReply || "(empty)"}
                </p>
                {t.rationale ? <p className="reply-match__rationale">{t.rationale}</p> : null}
                {suggestedPrimary ? (
                  <p className="reply-match__expected">
                    <strong>Another way to say it:</strong> {suggestedPrimary}
                  </p>
                ) : null}
                {t.suggested?.en ? (
                  <p className="reply-match__expected-en">{t.suggested.en}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function tier(grade) {
  if (grade >= 4) return "high";
  if (grade >= 3) return "mid";
  return "low";
}
