import { useMemo, useState } from "react";
import { loadAddressAs, saveAddressAs } from "../lib/addressAs.js";
import { loadPracticeStats } from "../lib/practiceStats.js";
import { loadSavedPhrases } from "../lib/phrasesStorage.js";
import { getScenarioPlayCount } from "../lib/scenarioProgress.js";
import {
  SCENARIO_CATEGORIES,
  SCENARIO_LIST,
  scenariosByCategory,
} from "../lib/scenarios.js";
import ScenarioCard from "./ScenarioCard.jsx";

const FEATURED_IDS = ["uncle", "grandma", "kerala"];

export default function HomeScreen({ onStartScenario, onOpenPhrases, phrasesRevision = 0 }) {
  const [category, setCategory] = useState("all");
  const [addressAs, setAddressAs] = useState(() => loadAddressAs());
  const stats = useMemo(() => loadPracticeStats(), []);
  void phrasesRevision;
  const savedCount = loadSavedPhrases().length;

  const filtered = useMemo(() => scenariosByCategory(category), [category]);
  const featured = useMemo(
    () => SCENARIO_LIST.filter((s) => FEATURED_IDS.includes(s.id)),
    [],
  );

  const chooseAddressAs = (value) => {
    saveAddressAs(value);
    setAddressAs(value);
  };

  return (
    <div className="screen home-screen">
      <section className="home-hero">
        <div className="home-hero__grid">
          <div className="home-hero__copy">
            <p className="eyebrow">For heritage speakers</p>
            <h1>
              Your Malayalam is already there.
              <span className="home-hero__script" lang="ml">
                പറയാൻ പഠിക്കാം.
              </span>
            </h1>
            <p className="home-lead">
              Practice short back-and-forth scenes with people you actually meet. When you freeze mid-sentence,
              hints give you the first word, then the full phrase, then English.
            </p>
            <div className="address-setting">
              <span className="address-setting__label" id="address-setting-label">
                Call me
              </span>
              <div className="dialogue-toggle" role="group" aria-labelledby="address-setting-label">
                {[
                  { id: "mone", label: "Mone (son)" },
                  { id: "mole", label: "Mole (daughter)" },
                  { id: "kunje", label: "Kunje (neutral)" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`dialogue-toggle__option ${addressAs === opt.id ? "dialogue-toggle__option--active" : ""}`}
                    aria-pressed={addressAs === opt.id}
                    onClick={() => chooseAddressAs(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="home-hero__actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => onStartScenario("uncle")}
              >
                Start practicing
              </button>
              {savedCount > 0 ? (
                <button type="button" className="btn btn-secondary btn-lg" onClick={onOpenPhrases}>
                  My Phrases ({savedCount})
                </button>
              ) : null}
            </div>
            {stats.sessions > 0 ? (
              <p className="home-stats">
                {stats.sessions} session{stats.sessions === 1 ? "" : "s"} on this device
              </p>
            ) : (
              <p className="home-stats home-stats--muted">
                {SCENARIO_LIST.length} scenes · saved on this device only
              </p>
            )}
          </div>
          <aside className="hero-aside" aria-label="How lines appear in a session">
            <figure className="hero-line-sample">
              <p className="hero-line-sample__ml" lang="ml">
                നിങ്ങൾ ഇവിടെ news കേൾക്കുന്നുണ്ടോ?
              </p>
              <p className="hero-line-sample__roman">ningal ivide news kelkkunnundo?</p>
              <p className="hero-line-sample__en">Do you still follow the news from here?</p>
            </figure>
            <ul className="hero-aside__legend">
              <li>
                <span className="hero-aside__mark hero-aside__mark--ml" aria-hidden="true" />
                Malayalam script
              </li>
              <li>
                <span className="hero-aside__mark hero-aside__mark--roman" aria-hidden="true" />
                Manglish
              </li>
              <li>
                <span className="hero-aside__mark hero-aside__mark--en" aria-hidden="true" />
                English gloss
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="mission-panel" aria-labelledby="mission-heading">
        <div className="mission-panel__copy">
          <h2 id="mission-heading">Built for the in-between</h2>
          <p>
            You are not learning your first words. You are training the moment your brain goes blank
            while someone waits for an answer. That is a different skill, and it takes reps.
          </p>
        </div>
        <div className="mission-panel__stats">
          <div className="stat-card">
            <span className="stat-card__num">{SCENARIO_LIST.length}</span>
            <span className="stat-card__label">scenarios</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__num">3</span>
            <span className="stat-card__label">hint steps</span>
          </div>
          <div className="stat-card stat-card--light">
            <span className="stat-card__num">8</span>
            <span className="stat-card__label">turns each</span>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="how-heading">
        <h2 id="how-heading">How a session works</h2>
        <ol className="how-grid">
          <li>
            <span className="how-grid__num">1</span>
            <h3>Choose a scene</h3>
            <p>Pick someone you might actually talk to. Replay anytime for a slightly different flow.</p>
          </li>
          <li>
            <span className="how-grid__num">2</span>
            <h3>Listen, then answer</h3>
            <p>They go first. You reply in Manglish or script, or use voice if your browser allows it.</p>
          </li>
          <li>
            <span className="how-grid__num">3</span>
            <h3>Unfreeze</h3>
            <p>Tap hints for the first word, the full phrase, then what it means in English.</p>
          </li>
        </ol>
      </section>

      <section className="home-section home-section--contrast" aria-labelledby="why-heading">
        <h2 id="why-heading">Speaking, not flashcards</h2>
        <div className="why-columns">
          <div>
            <h3>Vocabulary apps</h3>
            <p>Great when you are starting from zero.</p>
          </div>
          <div className="why-columns__emphasis">
            <h3>Samsaram</h3>
            <p>
              For when you already know what kazhicho means but your mouth will not say it on the spot.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-heading">
        <h2 id="featured-heading">Popular first sessions</h2>
        <p className="section-lead">Three scenes most people start with.</p>
        <div className="scenario-grid scenario-grid--featured">
          {featured.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              onStart={onStartScenario}
              featured
              replayCount={getScenarioPlayCount(s.id)}
            />
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="all-heading">
        <div className="section-head">
          <h2 id="all-heading">All scenarios</h2>
          <p className="section-lead">
            {SCENARIO_LIST.length} scenes ·{" "}
            {category === "all" ? "all topics" : SCENARIO_CATEGORIES.find((c) => c.id === category)?.label}
          </p>
        </div>
        <div className="category-chips" role="tablist" aria-label="Scenario categories">
          {SCENARIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={category === cat.id}
              className={`chip ${category === cat.id ? "chip--active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="scenario-grid">
          {filtered.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              onStart={onStartScenario}
              replayCount={getScenarioPlayCount(s.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
