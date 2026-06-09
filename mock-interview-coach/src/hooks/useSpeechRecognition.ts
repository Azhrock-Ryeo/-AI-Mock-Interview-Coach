import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  setTranscript: (val: string) => void;
}

interface SpeechRecognitionResultItem {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultItem[];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [transcript, setTranscriptState] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  // Tracks which result indices have already been committed as final — prevents duplicates
  const lastFinalIndexRef = useRef(0);
  const finalTranscriptRef = useRef("");

  type SpeechRecognitionConstructor = new () => SpeechRecognition;
  const SpeechRecognitionAPI: SpeechRecognitionConstructor | null =
    typeof window !== "undefined"
      ? ((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition) ?? null
      : null;

  const isSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSupported || !SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          // Only commit results we haven't seen yet
          if (i >= lastFinalIndexRef.current) {
            finalTranscriptRef.current += text + " ";
            lastFinalIndexRef.current = i + 1;
          }
        } else {
          interimTranscript += text;
        }
      }

      // Set directly — NOT appended from outside (that was the duplication bug)
      setTranscriptState((finalTranscriptRef.current + interimTranscript).trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;
      if (event.error === "aborted") return;
      setError(event.error);
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        // Auto-restart to keep continuous listening
        try { recognition.start(); } catch (_) {}
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      recognition.abort();
    };
  }, [isSupported]); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    setError(null);
    // Reset everything before starting a new session
    setTranscriptState("");
    finalTranscriptRef.current = "";
    lastFinalIndexRef.current = 0;
    isListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current?.start();
    } catch (_) {}
  }, [isSupported]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    recognitionRef.current?.stop();
  }, []);

  // Exposed so InterviewPage can clear transcript between questions
  const setTranscript = useCallback((val: string) => {
    setTranscriptState(val);
    finalTranscriptRef.current = val;
    lastFinalIndexRef.current = 0;
  }, []);

  return {
    transcript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    setTranscript,
  };
}