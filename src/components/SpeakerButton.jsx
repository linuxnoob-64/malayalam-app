import { useEffect, useState } from "react";
import {
  canShowMalayalamSpeaker,
  playMalayalamSpeech,
  primeMalayalamPlaybackCheck,
} from "../lib/ttsApi.js";

function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
      />
    </svg>
  );
}

/** Small speaker for line.ml — hidden if no Malayalam script or no playback path. */
export default function SpeakerButton({ line, className = "" }) {
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  const hasScript = canShowMalayalamSpeaker(line);

  useEffect(() => {
    if (!hasScript) return undefined;
    let cancelled = false;
    void primeMalayalamPlaybackCheck().then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [hasScript, line?.ml]);

  if (!hasScript || !available) return null;

  const handleSpeak = async (e) => {
    e?.stopPropagation?.();
    if (playing) return;
    setPlaying(true);
    await playMalayalamSpeech(line.ml);
    setPlaying(false);
  };

  return (
    <button
      type="button"
      className={`speaker-btn ${playing ? "speaker-btn--active" : ""} ${className}`.trim()}
      onClick={() => void handleSpeak()}
      disabled={playing}
      aria-label="Play Malayalam audio"
    >
      <SpeakerIcon />
    </button>
  );
}
