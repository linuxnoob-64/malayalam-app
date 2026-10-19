const KEY = "malayalam-app-practice-stats";

export function loadPracticeStats() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { sessions: 0, lastScenario: null };
    return JSON.parse(raw);
  } catch {
    return { sessions: 0, lastScenario: null };
  }
}

export function recordSessionComplete(scenarioId) {
  const prev = loadPracticeStats();
  const next = {
    sessions: (prev.sessions ?? 0) + 1,
    lastScenario: scenarioId,
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
