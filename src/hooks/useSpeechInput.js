import { useCallback, useEffect, useRef, useState } from "react";
import {
  ensureMicrophonePermission,
  getSpeechCapabilities,
  STT_LANG,
} from "../lib/speech.js";

export function useSpeechInput(onResult) {
  const caps = getSpeechCapabilities();
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [interim, setInterim] = useState("");
  const [micReady, setMicReady] = useState(null);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  const interimRef = useRef("");

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (!caps.stt) return undefined;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Recognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = STT_LANG;

    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const part = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) finalText += part;
        else interimText += part;
      }
      const display = (finalText || interimText).trim();
      interimRef.current = display;
      setInterim(display);
      if (finalText.trim()) {
        setError(null);
        onResultRef.current(finalText.trim());
        setInterim("");
        interimRef.current = "";
      }
    };

    rec.onerror = (e) => {
      if (e.error === "aborted") return;
      if (e.error === "not-allowed") {
        setError("Microphone blocked. Allow the mic for this site in browser settings.");
        setMicReady(false);
      } else if (e.error === "language-not-supported") {
        setError("Malayalam voice input is not supported in this browser. Type your reply instead.");
      } else if (e.error === "no-speech") {
        if (interimRef.current.trim()) {
          onResultRef.current(interimRef.current.trim());
          setInterim("");
          interimRef.current = "";
        } else {
          setError("No speech heard. Tap Voice and try again.");
        }
      } else if (e.error === "network") {
        setError("Voice input needs a network connection. Type your reply instead.");
      } else {
        setError("Voice input failed. Type your reply instead.");
      }
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {
        /* ignore */
      }
    };
  }, [caps.stt]);

  const startListening = useCallback(async () => {
    if (!caps.stt || !recognitionRef.current) return;

    setError(null);
    setInterim("");
    interimRef.current = "";

    const permitted = await ensureMicrophonePermission();
    setMicReady(permitted);
    if (!permitted) {
      setError("Microphone access denied. Allow the mic in your browser settings.");
      return;
    }

    const rec = recognitionRef.current;
    rec.lang = STT_LANG;

    try {
      rec.start();
      setListening(true);
    } catch (err) {
      if (err?.name === "InvalidStateError") {
        try {
          rec.stop();
        } catch {
          /* ignore */
        }
        setTimeout(() => {
          try {
            rec.start();
            setListening(true);
          } catch {
            setError("Could not start voice. Wait a moment and try again.");
          }
        }, 300);
      } else {
        setError("Could not start voice input.");
      }
    }
  }, [caps.stt]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      /* ignore */
    }
    if (interimRef.current.trim()) {
      onResultRef.current(interimRef.current.trim());
      setInterim("");
      interimRef.current = "";
    }
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stopListening();
    else void startListening();
  }, [listening, startListening, stopListening]);

  const clearError = useCallback(() => setError(null), []);

  return {
    ...caps,
    listening,
    error,
    interim,
    micReady,
    toggle,
    startListening,
    stopListening,
    canListen: caps.stt,
    sttLang: STT_LANG,
    clearError,
  };
}
