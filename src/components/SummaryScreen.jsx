import { useEffect, useMemo, useRef, useState } from "react";
import {
  isPhraseSaved,
  loadSavedPhrases,
  savePhrase,
  savePhrasesBulk,
} from "../lib/phrasesStorage.js";
import { recordSessionComplete } from "../lib/practiceStats.js";
import { markScenarioCompleted } from "../lib/scenarioProgress.js";
import { buildSummaryPhrases } from "../lib/sessionSummary.js";
import { computeSessionGrade } from "../lib/sessionGrade.js";
import { getScenario } from "../lib/scenarios.js";
import ReplyMatchList from "./ReplyMatchList.jsx";
import SessionGradeCard from "./SessionGradeCard.jsx";
import TripleLine from "./TripleLine.jsx";

export default function SummaryScreen({
  scenarioId,
  session,
  onHome,
  onStartScenario,
  onOpenPhrases,
  onPhrasesSaved,
}) {
  const scenario = getScenario(scenarioId);
  const phrases = useMemo(
    () => buildSummaryPhrases(session.stats, session.messages),
    [session],
  );
  const grade = useMemo(
    () =>
      computeSessionGrade(session.stats, {
        finishedNaturally: session.finishedNaturally,
        turnCount: session.stats.turns,
      }),
    [session],
  );

  const [savedKeysOverride, setSavedKeysOverride] = useState(null);
  const [toast, setToast] = useState(null);
  const recorded = useRef(false);

  const savedKeysFromStorage = useMemo(() => {
    const keys = new Set();
    for (const p of phrases) {
      if (isPhraseSaved(p)) keys.add((p.manglish || p.ml).toLowerCase().trim());
    }
    return keys;
  }, [phrases]);

  const savedKeys = savedKeysOverride ?? savedKeysFromStorage;

  useEffect(() => {
    if (recorded.current || !scenarioId) return;
    recorded.current = true;
    recordSessionComplete(scenarioId);
    markScenarioCompleted(scenarioId);
  }, [scenarioId]);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2400);
  };

  const handleSave = (phrase) => {
    const result = savePhrase({ ...phrase, scenarioId });
    const key = (phrase.manglish || phrase.ml).toLowerCase().trim();
    setSavedKeysOverride((prev) => new Set(prev ?? savedKeysFromStorage).add(key));
    if (result.persisted === false) {
      notify("Could not save. Check browser storage is allowed.");
      return;
    }
    notify(result.saved ? "Saved to My Phrases" : "Already in My Phrases");
    onPhrasesSaved?.();
  };

  const handleSaveAll = () => {
    const result = savePhrasesBulk(phrases, scenarioId);
    if (result.persisted === false) {
      notify("Could not save. Check browser storage is allowed.");
      return;
    }
    const keys = new Set(loadSavedPhrases().map((p) => (p.manglish || p.ml).toLowerCase().trim()));
    setSavedKeysOverride(keys);
    notify(
      result.added > 0
        ? `Saved ${result.added} phrase${result.added === 1 ? "" : "s"} to My Phrases`
        : "All phrases were already saved",
    );
    onPhrasesSaved?.();
  };

  return (
    <div className="screen summary-screen">
      <div className="summary-card">
        <p className="eyebrow">Session complete</p>
        <h1>Nice work practicing</h1>
        {scenario ? (
          <p className="summary-scenario">
            Scenario: <strong>{scenario.cardTitle}</strong>
          </p>
        ) : null}

        <SessionGradeCard gradeResult={grade} />

        <ReplyMatchList replyChecks={grade.replyChecks} />

        <p className="summary-meta">
          {session.stats.turns} repl{session.stats.turns === 1 ? "y" : "ies"}
          {session.stats.hintsUsed > 0
            ? ` · ${session.stats.hintsUsed} hint${session.stats.hintsUsed === 1 ? "" : "s"} used`
            : " · no hints needed"}
        </p>

        <section className="summary-phrases" aria-labelledby="summary-phrases-heading">
          <div className="summary-phrases__head">
            <h2 id="summary-phrases-heading">Phrases from this chat</h2>
            {phrases.length > 0 ? (
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleSaveAll}>
                Save all
              </button>
            ) : null}
          </div>
          <p className="summary-note">Saved phrases stay on this device, even after you refresh.</p>
          {phrases.length === 0 ? (
            <p className="empty-inline">No phrases captured yet. Try another conversation.</p>
          ) : (
            <ul className="phrase-list">
              {phrases.map((p) => {
                const key = (p.manglish || p.ml).toLowerCase().trim();
                const isSaved = savedKeys.has(key);
                return (
                  <li key={key} className="phrase-list__item">
                    <TripleLine line={p} compact />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSave(p)}
                      disabled={isSaved}
                    >
                      {isSaved ? "Saved" : "Save phrase"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="summary-actions">
          {scenarioId ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onStartScenario(scenarioId)}
            >
              New conversation (same scenario)
            </button>
          ) : null}
          <button type="button" className="btn btn-secondary" onClick={onHome}>
            Choose another scenario
          </button>
          <button type="button" className="link-btn" onClick={onOpenPhrases}>
            View My Phrases ({loadSavedPhrases().length})
          </button>
        </div>
      </div>

      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
