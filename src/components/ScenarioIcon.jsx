/**
 * Scenario icons — Twemoji PNGs (consistent, readable at card size).
 * @see https://github.com/twitter/twemoji
 */

const TWEMOJI_BASE =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72";

/** icon key → Twemoji filename (without .png) */
const EMOJI_ASSET = {
  question: "2753",
  telephone: "260e-fe0f",
  grandma: "1f475",
  "video-call": "1f4f9",
  wedding: "1f492",
  "phone-call": "1f4de",
  auto: "1f6fa",
  shop: "1f6d2",
  homestay: "1f3e0",
  airplane: "2708-fe0f",
  "tea-mug": "2615-fe0f",
  "rice-bowl": "1f35b",
  "school-building": "1f3eb",
  person: "1f9d1",
  bus: "1f68c",
  vegetables: "1f966",
  clinic: "1f3e5",
  "beach-scene": "1f3d6-fe0f",
  "cloud-rain": "1f327-fe0f",
  camera: "1f3a5",
  balls: "26bd-fe0f",
  train: "1f686",
  mountain: "26f0",
  flower: "1f33c",
  map: "1f5fa",
  bed: "1f6cf",
  "map-pin": "1f4cd",
  "older-adult": "1f9d3",
  "grad-cap": "1f393",
  books: "1f4da",
  calendar: "1f4c5",
  mobile: "1f4f1",
  "older-man": "1f474",
  wave: "1f44b",
  gift: "1f381",
  plate: "1f37d",
  notebook: "1f4d3",
};

/** Fallback if CDN asset missing */
const EMOJI_CHAR = {
  question: "❓",
  telephone: "☎️",
  grandma: "👵",
  "video-call": "📹",
  wedding: "💒",
  "phone-call": "📞",
  auto: "🛺",
  shop: "🛒",
  homestay: "🏠",
  airplane: "✈️",
  "tea-mug": "☕",
  "rice-bowl": "🍛",
  "school-building": "🏫",
  person: "🧑",
  bus: "🚌",
  vegetables: "🥦",
  clinic: "🏥",
  "beach-scene": "🏖️",
  "cloud-rain": "🌧️",
  camera: "🎥",
  balls: "⚽",
  train: "🚆",
  mountain: "⛰️",
  flower: "🌼",
  map: "🗺️",
  bed: "🛏️",
  "map-pin": "📍",
  "older-adult": "🧓",
  "grad-cap": "🎓",
  books: "📚",
  calendar: "📅",
  mobile: "📱",
  "older-man": "👴",
  wave: "👋",
  gift: "🎁",
  plate: "🍽️",
  notebook: "📓",
};

function assetUrl(icon) {
  const file = EMOJI_ASSET[icon] ?? EMOJI_ASSET.auto;
  return `${TWEMOJI_BASE}/${file}.png`;
}

export default function ScenarioIcon({
  icon = "auto",
  accent = "forest",
  className = "",
  size = "card",
  label = "",
}) {
  const decorative = !label;
  const char = EMOJI_CHAR[icon] ?? EMOJI_CHAR.auto;

  return (
    <span
      className={`scenario-icon scenario-icon--${accent} scenario-icon--${size} ${className}`.trim()}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      <img
        className="scenario-icon__img"
        src={assetUrl(icon)}
        alt={decorative ? "" : label}
        width={36}
        height={36}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) fallback.hidden = false;
        }}
      />
      <span className="scenario-icon__fallback" hidden aria-hidden="true">
        {char}
      </span>
    </span>
  );
}
