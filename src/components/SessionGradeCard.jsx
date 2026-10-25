export default function SessionGradeCard({ gradeResult }) {
  if (!gradeResult) return null;
  const { score, grade, headline, feedback } = gradeResult;

  return (
    <section className="grade-card" aria-labelledby="grade-heading">
      <div className="grade-card__visual">
        <div className="grade-card__ring-wrap">
          <div className="grade-card__ring" style={{ "--pct": score ?? 0 }} aria-hidden="true" />
          <div className="grade-card__ring-inner">
            <span className="grade-card__letter">{grade}</span>
          </div>
        </div>
        <p className="grade-card__score">{score != null ? `${score} / 100` : "Not graded"}</p>
      </div>
      <div className="grade-card__copy">
        <h2 id="grade-heading">{headline}</h2>
        <p className="grade-card__sub">Average of the grades your replies earned each turn.</p>
        {feedback.length ? (
          <ul className="grade-card__list">
            {feedback.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
