import { getScenarioOpeningLine } from "../lib/demoScripts.js";
import ScenarioIcon from "./ScenarioIcon.jsx";
import SpeakerButton from "./SpeakerButton.jsx";

export default function ScenarioCard({ scenario, onStart, featured = false, replayCount = 0 }) {
  const openingLine = getScenarioOpeningLine(scenario.id);
  return (
    <article
      className={`scenario-card scenario-card--${scenario.accent} ${featured ? "scenario-card--featured" : ""}`}
    >
      <header className="scenario-card__head">
        <div className={`scenario-card__icon-wrap scenario-card__icon-wrap--${scenario.accent}`}>
          <ScenarioIcon icon={scenario.icon} accent={scenario.accent} label={scenario.subtitle} />
        </div>
        <span className="scenario-card__time">{scenario.minutes}</span>
      </header>

      {replayCount > 0 ? (
        <p className="scenario-card__replay">Replay · new lines</p>
      ) : (
        <p className="scenario-card__replay scenario-card__replay--empty" aria-hidden="true">
          &nbsp;
        </p>
      )}

      <p className="scenario-card__subtitle">{scenario.subtitle}</p>
      <div className="scenario-card__title-row">
        <h2>{scenario.cardTitle}</h2>
        <SpeakerButton line={openingLine} className="speaker-btn--card" />
      </div>
      <p className="scenario-card__desc">{scenario.description}</p>
      <button
        type="button"
        className="btn btn-primary scenario-card__cta"
        onClick={() => onStart(scenario.id)}
      >
        {replayCount > 0 ? "Practice again" : "Start conversation"}
      </button>
    </article>
  );
}
