import { useEffect, useState } from "react";
import {
  loadSavedPhrases,
  removePhrase,
  subscribePhrasesUpdated,
} from "../lib/phrasesStorage.js";
import TripleLine from "./TripleLine.jsx";

export default function MyPhrasesScreen({ onHome, onStartScenario }) {
  const [phrases, setPhrases] = useState(() => loadSavedPhrases());

  useEffect(() => subscribePhrasesUpdated(setPhrases), []);

  const handleRemove = (id) => {
    setPhrases(removePhrase(id));
  };

  return (
    <div className="screen phrases-screen">
      <header className="phrases-header">
        <button type="button" className="back-btn" onClick={onHome}>
          ← Home
        </button>
        <div>
          <h1>My Phrases</h1>
          <p className="phrases-sub">{phrases.length} saved on this device</p>
        </div>
      </header>

      {phrases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true" />
          <h2>No saved phrases yet</h2>
          <p>
            Finish a conversation, then tap Save phrase or Save all on the summary screen. Your list
            persists after refresh. No account needed.
          </p>
          <button type="button" className="btn btn-primary" onClick={onHome}>
            Start practicing
          </button>
        </div>
      ) : (
        <ul className="phrase-list phrase-list--saved">
          {phrases.map((p) => (
            <li key={p.id} className="phrase-list__item phrase-list__item--saved">
              <TripleLine line={p} compact />
              <div className="phrase-list__meta">
                {p.scenarioId ? <span className="phrase-tag">{p.scenarioId}</span> : null}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleRemove(p.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {phrases.length > 0 ? (
        <div className="phrases-footer">
          <button type="button" className="btn btn-secondary" onClick={() => onStartScenario("uncle")}>
            Practice a scenario
          </button>
        </div>
      ) : null}
    </div>
  );
}
