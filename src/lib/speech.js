/** Microphone helpers + browser Malayalam playback (ml-IN voice only). */

export const STT_LANG = "ml-IN";

export function getSpeechCapabilities() {
  if (typeof window === "undefined") {
    return { stt: false, sttNote: "" };
  }
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const stt = Boolean(Recognition);
  return {
    stt,
    sttNote: stt
      ? "Voice input uses Malayalam (ml-IN). Review the text before you send."
      : "Voice input works best in Chrome or Edge on desktop.",
  };
}

/** @returns {Promise<boolean>} */
export async function ensureMicrophonePermission() {
  if (!navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

let voicesPromise = null;

function ensureVoicesLoaded() {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }
  const synth = window.speechSynthesis;
  const cached = synth.getVoices();
  if (cached.length > 0) return Promise.resolve(cached);
  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        synth.onvoiceschanged = null;
        resolve(synth.getVoices());
      };
      synth.onvoiceschanged = finish;
      synth.getVoices();
      setTimeout(finish, 3000);
    });
  }
  return voicesPromise;
}

/** @param {SpeechSynthesisVoice[]} voices */
export function pickMalayalamVoice(voices) {
  if (!voices?.length) return null;
  return (
    voices.find((v) => v.lang === "ml-IN") ||
    voices.find((v) => v.lang === "ml") ||
    voices.find((v) => v.lang.toLowerCase().startsWith("ml")) ||
    null
  );
}

export async function hasBrowserMalayalamVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const voices = await ensureVoicesLoaded();
  return Boolean(pickMalayalamVoice(voices));
}

/** Speak Malayalam script with device ml-IN voice only (no Manglish / English). */
export async function speakMalayalamWithBrowser(text) {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined" || !window.speechSynthesis) {
    return { ok: false, reason: "no-tts" };
  }

  const voices = await ensureVoicesLoaded();
  const voice = pickMalayalamVoice(voices);
  if (!voice) return { ok: false, reason: "no-voice" };

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(trimmed);
  utter.lang = voice.lang || STT_LANG;
  utter.voice = voice;
  utter.rate = 0.95;

  return new Promise((resolve) => {
    utter.onend = () => resolve({ ok: true });
    utter.onerror = () => resolve({ ok: false, reason: "speak-error" });
    window.speechSynthesis.speak(utter);
  });
}

export function stopBrowserSpeech() {
  window.speechSynthesis?.cancel();
}
