const KEY = "malayalam-app-scenario-plays";

function loadMap() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveMap(map) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

/** Times the user finished this scenario (summary reached). */
export function getScenarioPlayCount(scenarioId) {
  if (!scenarioId) return 0;
  return loadMap()[scenarioId] ?? 0;
}

export function markScenarioCompleted(scenarioId) {
  if (!scenarioId) return 0;
  const map = loadMap();
  const next = (map[scenarioId] ?? 0) + 1;
  map[scenarioId] = next;
  saveMap(map);
  return next;
}
