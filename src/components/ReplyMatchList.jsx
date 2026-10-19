import { useDialogueDisplay } from "../hooks/useDialogueDisplay.js";
import { primaryDialogueText } from "../lib/dialogueDisplay.js";
import { similarityLabel } from "../lib/replySimilarity.js";

export default function ReplyMatchList({ replyChecks }) {
  const { mode } = useDialogueDisplay();

  if (!replyChecks?.length) return null;

  return (
    <section className="reply-match" aria-labelledby="reply-match-heading">
      <h2 id="reply-match-heading">How your replies matched</h2>
      <p className="summary-note">Each score compares what you typed to the phrase we suggested for that turn.</p>
      <ol className="reply-match__list">
        {replyChecks.map((c, i) => {
          const suggestedLine = {
            manglish: c.expectedManglish,
            ml: c.expectedMl,
            en: c.expectedEn,
          };
          const suggestedPrimary = primaryDialogueText(suggestedLine, mode);
          return (
            <li key={i} className="reply-match__item">
              <div className="reply-match__score" data-tier={tier(c.similarity)}>
                {c.similarity != null ? `${c.similarity}%` : "—"}
              </div>
              <div className="reply-match__body">
                <p className="reply-match__label">{similarityLabel(c.similarity)}</p>
                <p>
                  <strong>You:</strong> {c.userReply || "(empty)"}
                </p>
                {suggestedPrimary ? (
                  <p className="reply-match__expected">
                    <strong>Suggested:</strong> {suggestedPrimary}
                  </p>
                ) : null}
                {c.expectedEn ? (
                  <p className="reply-match__expected-en">{c.expectedEn}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function tier(sim) {
  if (sim == null) return "na";
  if (sim >= 75) return "high";
  if (sim >= 50) return "mid";
  return "low";
}
