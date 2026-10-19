/**
 * Malayalam playback: cloud POST /api/tts when enabled, else browser ml-IN voice.
 * See file header in prior revision for Ryan's /api/tts contract.
 */

import {
  hasBrowserMalayalamVoice,
  speakMalayalamWithBrowser,
  stopBrowserSpeech,
} from "./speech.js";

const TTS_PATH = "/api/tts";

export function isCloudMalayalamTtsEnabled() {
  const v = import.meta.env.VITE_MALAYALAM_TTS;
  return v === "1" || v === "true";
}

/** True when we can attempt Malayalam script playback (cloud and/or browser ml voice). */
export async function isMalayalamPlaybackAvailable() {
  if (typeof window === "undefined") return false;
  if (isCloudMalayalamTtsEnabled()) return true;
  return hasBrowserMalayalamVoice();
}

/** @returns {boolean} */
export function canShowMalayalamSpeaker(line) {
  return Boolean(line?.ml?.trim());
}

let activeAudio = null;
let activeObjectUrl = null;
let browserCheckPromise = null;

export function primeMalayalamPlaybackCheck() {
  if (!browserCheckPromise) {
    browserCheckPromise = isMalayalamPlaybackAvailable();
  }
  return browserCheckPromise;
}

function revokeActiveUrl() {
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

export function stopMalayalamPlayback() {
  stopBrowserSpeech();
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  revokeActiveUrl();
}

async function playCloudMalayalamSpeech(trimmed) {
  const res = await fetch(TTS_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: trimmed }),
  });

  if (!res.ok) return { ok: false, reason: "request-failed" };

  const contentType = res.headers.get("Content-Type") ?? "";
  let blob;
  if (contentType.includes("application/json")) {
    const body = await res.json();
    if (!body?.audioBase64) return { ok: false, reason: "bad-response" };
    const binary = atob(body.audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    blob = new Blob([bytes], { type: body.contentType || "audio/mpeg" });
  } else {
    blob = await res.blob();
  }

  activeObjectUrl = URL.createObjectURL(blob);
  const audio = new Audio(activeObjectUrl);
  activeAudio = audio;

  await new Promise((resolve, reject) => {
    audio.onend = () => resolve(undefined);
    audio.onerror = () => reject(new Error("playback-error"));
    void audio.play().catch(reject);
  });

  stopMalayalamPlayback();
  return { ok: true };
}

/**
 * @param {string} text Malayalam script (line.ml)
 */
export async function playMalayalamSpeech(text) {
  const trimmed = text?.trim();
  if (!trimmed) return { ok: false, reason: "no-script" };

  stopMalayalamPlayback();

  if (isCloudMalayalamTtsEnabled()) {
    try {
      const cloud = await playCloudMalayalamSpeech(trimmed);
      if (cloud.ok) return cloud;
    } catch {
      /* fall through to browser */
    }
  }

  return speakMalayalamWithBrowser(trimmed);
}
