interface TranscriptBoxProps {
  transcript: string;
  onChange: (value: string) => void;
}

export default function TranscriptBox({ transcript, onChange }: TranscriptBoxProps) {
  const wordCount = transcript.trim() === "" ? 0 : transcript.trim().split(/\s+/).length;
  const charCount = transcript.length;

  return (
    <div className="flex flex-col gap-2 w-full">

      {/* Textarea */}
      <textarea
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer will appear here..."
        rows={5}
        className="
          w-full resize-none rounded-xl px-4 py-3
          bg-[var(--bg-secondary)] text-[var(--text-primary)]
          border border-[var(--border)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none focus:border-[var(--accent)]
          transition-colors duration-200
          text-sm leading-relaxed font-mono
        "
      />

      {/* Word / char count */}
      <div className="flex justify-end gap-4 text-xs text-[var(--text-muted)]">
        <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        <span>{charCount} {charCount === 1 ? "char" : "chars"}</span>
      </div>

    </div>
  );
}