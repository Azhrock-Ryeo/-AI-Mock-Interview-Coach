import { useState, useEffect, useRef } from "react";

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  // ✅ Check AFTER all hooks are declared
  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;
  const isSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    // ✅ Guard is inside useEffect, not before hooks
    if (!isSupported || !SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + " ";
      }
      setTranscript(fullTranscript.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;
      setError(event.error);
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Already started, ignore
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      recognition.stop();
    };
  }, [isSupported]);

  const startListening = () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    setError(null);
    setTranscript("");
    isListeningRef.current = true;
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  return { transcript, isListening, error, startListening, stopListening, isSupported };
}