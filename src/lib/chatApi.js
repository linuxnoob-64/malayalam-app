/**
 * Same-origin chat API adapter. Never calls LLM providers from the browser.
 * Set VITE_DEMO_CHAT=1 to preview UI with labeled multi-turn demo scripts (not live AI).
 */

import { getDemoTurn } from "./demoScripts.js";
import { getScenarioPlayCount } from "./scenarioProgress.js";

const DEMO_LABEL = "Scripted preview on this device";

/** @typedef {{ ml: string, manglish: string, en: string }} Triple */
/** @typedef {{ role: 'user'|'assistant', content: string }} HistoryEntry */

export function isDemoChatEnabled() {
  return import.meta.env.VITE_DEMO_CHAT === "1" || import.meta.env.VITE_DEMO_CHAT === "true";
}

export function getDemoLabel() {
  return DEMO_LABEL;
}

/**
 * @param {string} scenarioId
 * @param {HistoryEntry[]} history
 */
export async function fetchChatTurn(scenarioId, history) {
  if (isDemoChatEnabled()) {
    await delay(500);
    const replayIndex = getScenarioPlayCount(scenarioId);
    return getDemoTurn(scenarioId, history.length, replayIndex);
  }

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId, history }),
  });

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Build API history from UI messages. Assistant content = Manglish line. */
export function buildChatHistory(messages) {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role,
      content:
        m.role === "assistant"
          ? (m.line?.manglish ?? m.content ?? "")
          : (m.content ?? ""),
    }));
}
