import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildChatHistory,
  fetchChatTurn,
  getDemoLabel,
  isDemoChatEnabled,
} from "../lib/chatApi.js";
import { useDialogueDisplay } from "../hooks/useDialogueDisplay.js";
import { useSpeechInput } from "../hooks/useSpeechInput.js";
import { getHint, newStats, recordTurn } from "../lib/hints.js";
import { getScenario } from "../lib/scenarios.js";
import DialogueDisplayToggle from "./DialogueDisplayToggle.jsx";
import HintLadder from "./HintLadder.jsx";
import TripleLine from "./TripleLine.jsx";

const MAX_TURNS = 8;

function lastAssistantIndex(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") return i;
  }
  return -1;
}

/** suggested_reply for the user turn we just sent (last assistant before trailing user msg). */
function suggestedForLatestUserTurn(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      return messages[i].suggested_reply ?? null;
    }
  }
  return null;
}

export default function ConversationScreen({ scenarioId, onComplete, onHome }) {
  const scenario = getScenario(scenarioId);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(() => newStats());
  const statsRef = useRef(stats);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(isDemoChatEnabled());
  const [hintLevel, setHintLevel] = useState(0);
  const [activeSuggested, setActiveSuggested] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [done, setDone] = useState(false);
  const pendingRef = useRef({ hintLevel: 0, suggested: null });
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const appendSpeech = useCallback((text) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  }, [setInput]);

  const speech = useSpeechInput(appendSpeech);
  const dialogueDisplay = useDialogueDisplay();

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const finishSession = useCallback(
    (finalMessages, finalStats, finishedNaturally = false) => {
      onComplete({
        stats: finalStats ?? statsRef.current,
        messages: finalMessages,
        finishedNaturally,
      });
    },
    [onComplete],
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  const ingestTurn = useCallback(
    (data, priorMessages, { afterUserSend = false } = {}) => {
      if (afterUserSend) {
        const suggested =
          pendingRef.current.suggested ??
          suggestedForLatestUserTurn(priorMessages);
        const nextStats = recordTurn(statsRef.current, {
          hintLevel: pendingRef.current.hintLevel,
          phrasesUsed: data.phrases_used ?? [],
          suggested,
        });
        setStats(nextStats);
        pendingRef.current = { hintLevel: 0, suggested: null };
      }

      const assistantMsg = {
        role: "assistant",
        line: data.line,
        correction: data.correction,
        suggested_reply: data.suggested_reply ?? null,
        grade: typeof data.grade === "number" ? data.grade : null,
        rationale: data.rationale ?? null,
        turn: data.turn,
      };
      const nextMessages = [...priorMessages, assistantMsg];
      setMessages(nextMessages);
      setActiveSuggested(data.suggested_reply ?? null);
      setHintLevel(0);
      setCurrentTurn(data.turn ?? 1);
      if (data.demo) setDemoMode(true);

      if (data.done) setDone(true);
      return nextMessages;
    },
    [],
  );

  const requestTurn = useCallback(
    async (history, priorMessages, opts = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchChatTurn(scenarioId, history);
        ingestTurn(data, priorMessages, opts);
      } catch (e) {
        setError(e.message ?? "Could not reach the conversation service.");
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    },
    [scenarioId, ingestTurn, scrollToBottom],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads first AI message on mount
    void requestTurn([], []);
  }, [requestTurn]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, hintLevel, scrollToBottom]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || done) return;

    pendingRef.current = { hintLevel, suggested: activeSuggested };
    const userMsg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setHintLevel(0);
    setActiveSuggested(null);
    setLoading(true);
    setError(null);

    try {
      const history = buildChatHistory(nextMessages);
      const data = await fetchChatTurn(scenarioId, history);
      ingestTurn(data, nextMessages, { afterUserSend: true });
    } catch (e) {
      setError(e.message ?? "Message failed to send.");
      setMessages(messages);
      setInput(text);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) {
      requestTurn([], []);
      return;
    }
    const last = messages[messages.length - 1];
    if (last.role === "user") {
      const prior = messages.slice(0, -1);
      requestTurn(buildChatHistory(messages), prior, { afterUserSend: true });
    } else {
      const prior = messages.slice(0, -1);
      requestTurn(buildChatHistory(prior), prior);
    }
  };

  const handleEnd = () => {
    finishSession(messages, statsRef.current, done);
  };

  const handleSeeResults = () => {
    finishSession(messages, statsRef.current, true);
  };

  const advanceHint = () => {
    if (!activeSuggested?.manglish || loading || done) return;
    setHintLevel((l) => Math.min(3, l + 1));
  };

  if (!scenario) {
    return (
      <div className="screen">
        <p>Unknown scenario.</p>
        <button type="button" className="btn" onClick={onHome}>
          Back home
        </button>
      </div>
    );
  }

  const latestAssistantIndex = lastAssistantIndex(messages);
  const showHint =
    !done &&
    !loading &&
    latestAssistantIndex >= 0 &&
    messages[messages.length - 1]?.role === "assistant";

  const hintPreview = hintLevel > 0 && activeSuggested ? getHint(activeSuggested, hintLevel) : null;

  return (
    <div className={`screen conversation-screen conversation-screen--${scenario.accent}`}>
      <div className="conversation-shell">
        <header className="conversation-header">
          <button type="button" className="back-btn" onClick={onHome}>
            ← Scenarios
          </button>
          <div className="conversation-header__meta">
            <h1>{scenario.cardTitle}</h1>
            <p>
              <span className={`character-pill character-pill--${scenario.accent}`}>
                {scenario.characterShort}
              </span>
            </p>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleEnd}>
            End
          </button>
        </header>

        <div className="conversation-toolbar">
          <DialogueDisplayToggle
            mode={dialogueDisplay.mode}
            onChange={dialogueDisplay.setMode}
          />
        </div>

        <div className="turn-progress" aria-label={`Conversation turn ${currentTurn} of ${MAX_TURNS}`}>
          <div
            className="turn-progress__fill"
            style={{ width: `${Math.min(100, (currentTurn / MAX_TURNS) * 100)}%` }}
          />
          <span className="turn-progress__label">
            Turn {currentTurn} / {MAX_TURNS}
          </span>
        </div>

        {demoMode ? (
          <div className="demo-banner" role="status">
            {getDemoLabel()}
          </div>
        ) : null}

        <div className="chat-panel">
          <div className="message-list" ref={listRef}>
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="message message--user">
              <p>{m.content}</p>
            </div>
          ) : (
            <div key={i} className="message message--assistant">
              <div
                className={`message__avatar message__avatar--${scenario.accent}`}
                aria-hidden="true"
              >
                {scenario.characterShort.charAt(0)}
              </div>
              <div className="message__body">
                <TripleLine line={m.line} showListen />
                {m.correction ? (
                  <aside className="correction">
                    <p className="correction__label">Gentle tip</p>
                    <p>
                      You said &ldquo;{m.correction.said}&rdquo;. Next, try:{" "}
                      <strong>{m.correction.better_manglish?.replace(/\.+$/, "")}</strong>
                      {m.correction.en ? `. ${m.correction.en}` : null}
                    </p>
                  </aside>
                ) : null}
                {i === latestAssistantIndex && showHint ? (
                  <HintLadder
                    suggested={activeSuggested}
                    level={hintLevel}
                    onAdvance={advanceHint}
                    disabled={loading || done}
                  />
                ) : null}
              </div>
            </div>
          ),
        )}

        {done ? (
          <div className="conversation-results">
            <button type="button" className="btn btn-primary" onClick={handleSeeResults}>
              See results
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="message message--assistant message--typing" aria-live="polite">
            <div
              className={`message__avatar message__avatar--${scenario.accent}`}
              aria-hidden="true"
            >
              {scenario.characterShort.charAt(0)}
            </div>
            <p className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
              {scenario.characterShort} is typing…
            </p>
          </div>
        ) : null}
          </div>
        </div>

      {error ? (
        <div className="error-bar" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleRetry}>
            Retry
          </button>
        </div>
      ) : null}

      <footer className={`composer${done ? " composer--closed" : ""}`}>
        {hintPreview ? (
          <p className="composer__hint-preview" aria-live="polite">
            Hint: {hintPreview.text}
            {hintPreview.en
              ? `${/[.?!…]$/.test(hintPreview.text.trim()) ? " " : ". "}${hintPreview.en}`
              : ""}
          </p>
        ) : null}
        {speech.listening ? (
          <p className="composer__listening" role="status">
            Listening… speak now. {speech.interim ? `Heard: "${speech.interim}"` : "Waiting for speech."}
          </p>
        ) : null}
        {speech.error ? <p className="composer__speech-error">{speech.error}</p> : null}
        <div className="composer__row">
          <label className="sr-only" htmlFor="reply-input">
            Your reply in Manglish or Malayalam script
          </label>
          {speech.canListen ? (
            <div className="composer__voice">
              <button
                type="button"
                className={`mic-btn ${speech.listening ? "mic-btn--active" : ""}`}
                onClick={speech.toggle}
                disabled={done}
                aria-pressed={speech.listening}
                title={speech.sttNote}
              >
                {speech.listening ? "Listening…" : "Voice"}
              </button>
            </div>
          ) : null}
          <textarea
            id="reply-input"
            ref={inputRef}
            rows={2}
            placeholder={
              done
                ? "Conversation finished"
                : "Type your reply, or tap Voice for Malayalam speech recognition…"
            }
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              speech.clearError();
            }}
            onKeyDown={handleKeyDown}
            disabled={done || (loading && messages.length === 0)}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!input.trim() || loading || done}
          >
            Send
          </button>
        </div>
      </footer>
      </div>
    </div>
  );
}
