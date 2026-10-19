import { loadSavedPhrases } from "../lib/phrasesStorage.js";

export function SiteHeader({ onHome, onOpenPhrases, compact = false, phrasesRevision = 0 }) {
  const savedCount = loadSavedPhrases().length;
  void phrasesRevision;

  return (
    <header className={`site-header ${compact ? "site-header--compact" : ""}`}>
      <button type="button" className="site-brand" onClick={onHome}>
        <span className="site-brand__mark" lang="ml" aria-hidden="true">
          സം
        </span>
        <span className="site-brand__text">
          <strong>Samsaram</strong>
          <span>conversation practice</span>
        </span>
      </button>
      <nav className="site-nav" aria-label="Main">
        {!compact ? (
          <button type="button" className="site-nav__link" onClick={onHome}>
            Scenarios
          </button>
        ) : null}
        <button
          type="button"
          className={`site-nav__link ${savedCount > 0 ? "site-nav__link--badge" : ""}`}
          onClick={onOpenPhrases}
        >
          {compact ? "Phrases" : "My Phrases"}
          {savedCount > 0 ? <span className="site-nav__count">{savedCount}</span> : null}
        </button>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Samsaram · practice Malayalam conversations on this device. No account required.</p>
    </footer>
  );
}
