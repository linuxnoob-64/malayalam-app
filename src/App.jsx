import { useCallback, useState } from "react";
import ConversationScreen from "./components/ConversationScreen.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import MyPhrasesScreen from "./components/MyPhrasesScreen.jsx";
import SummaryScreen from "./components/SummaryScreen.jsx";
import { SiteFooter, SiteHeader } from "./components/SiteChrome.jsx";
import { newStats } from "./lib/hints.js";

const VIEWS = {
  home: "home",
  conversation: "conversation",
  summary: "summary",
  phrases: "phrases",
};

export default function App() {
  const [view, setView] = useState(VIEWS.home);
  const [scenarioId, setScenarioId] = useState(null);
  const [conversationKey, setConversationKey] = useState(0);
  const [phrasesRevision, setPhrasesRevision] = useState(0);
  const [session, setSession] = useState(() => ({
    stats: newStats(),
    messages: [],
    finishedNaturally: false,
  }));

  const bumpPhrases = useCallback(() => {
    setPhrasesRevision((n) => n + 1);
  }, []);

  const resetConversationShell = useCallback(() => {
    setConversationKey((k) => k + 1);
    setSession({ stats: newStats(), messages: [], finishedNaturally: false });
  }, []);

  const goHome = useCallback(() => {
    if (view === VIEWS.conversation) {
      resetConversationShell();
    }
    setView(VIEWS.home);
    setScenarioId(null);
  }, [view, resetConversationShell]);

  const startScenario = useCallback(
    (id) => {
      resetConversationShell();
      setScenarioId(id);
      setView(VIEWS.conversation);
    },
    [resetConversationShell],
  );

  const completeSession = useCallback((payload) => {
    setSession(payload);
    setView(VIEWS.summary);
  }, []);

  const openPhrases = useCallback(() => {
    setPhrasesRevision((n) => n + 1);
    setView(VIEWS.phrases);
  }, []);

  const compactHeader = view === VIEWS.conversation;

  return (
    <div className={`app-root${compactHeader ? " app-root--chat" : ""}`}>
      <SiteHeader
        onHome={goHome}
        onOpenPhrases={openPhrases}
        compact={compactHeader}
        phrasesRevision={phrasesRevision}
      />
      <main className={`app-shell${compactHeader ? " app-shell--chat" : ""}`}>
        {view === VIEWS.home ? (
          <HomeScreen
            onStartScenario={startScenario}
            onOpenPhrases={openPhrases}
            phrasesRevision={phrasesRevision}
          />
        ) : null}

        {view === VIEWS.conversation && scenarioId ? (
          <ConversationScreen
            key={`${scenarioId}-${conversationKey}`}
            scenarioId={scenarioId}
            onComplete={completeSession}
            onHome={goHome}
          />
        ) : null}

        {view === VIEWS.summary ? (
          <SummaryScreen
            scenarioId={scenarioId}
            session={session}
            onHome={goHome}
            onStartScenario={startScenario}
            onOpenPhrases={openPhrases}
            onPhrasesSaved={bumpPhrases}
          />
        ) : null}

        {view === VIEWS.phrases ? (
          <MyPhrasesScreen
            key={phrasesRevision}
            onHome={goHome}
            onStartScenario={startScenario}
          />
        ) : null}
      </main>
      {view !== VIEWS.conversation ? <SiteFooter /> : null}
    </div>
  );
}
