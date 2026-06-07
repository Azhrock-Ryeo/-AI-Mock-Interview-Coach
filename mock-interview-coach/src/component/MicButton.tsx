import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import TranscriptBox from "./Transcript.tsx";

export default function MicButton() {
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    setTranscript,
    error,
  } = useSpeechRecognition();

  const handleClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg">

      {/* Mic button */}
      <div className="relative flex items-center justify-center">
        {isListening && (
          <>
            <span className="mic-ring" />
            <span className="mic-ring mic-ring-2" />
            <span className="mic-ring mic-ring-3" />
          </>
        )}
        <button
          onClick={handleClick}
          disabled={!isSupported}
          className={`mic-btn ${isListening ? "listening" : ""}`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          <span className="mic-shine" />
          <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
            <rect x="15" y="4" width="14" height="22" rx="7" fill="white" fillOpacity="0.95" />
            <path d="M8 21C8 28.732 14.268 35 22 35C29.732 35 36 28.732 36 21"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="22" y1="35" x2="22" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="41" x2="28" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Status */}
      <p className={`text-sm font-medium tracking-wide transition-colors duration-300 ${isListening ? "text-red-400" : "text-[var(--text-muted)]"}`}>
        {!isSupported ? "Not supported" : isListening ? "Listening..." : "Click to speak"}
      </p>

      {/* Transcript box */}
      <TranscriptBox transcript={transcript} onChange={setTranscript} />

      {/* Error */}
      {error && <p className="text-xs text-red-400">{error}</p>}

    </div>
  );
}