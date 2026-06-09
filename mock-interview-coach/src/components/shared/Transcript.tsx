interface TranscriptBoxProps {
  transcript: string
  isListening: boolean
  readOnly?: boolean
  onChange?: (val: string) => void  // kept for compatibility but ignored when readOnly
}

export default function TranscriptBox({ transcript, isListening, readOnly = false }: TranscriptBoxProps) {
  return (
    <div className="relative w-full">
      <textarea
        value={transcript}
        readOnly={readOnly}
        onChange={() => {}} // no-op — speech only
        placeholder={isListening ? 'Listening…' : 'Your answer will appear here as you speak…'}
        rows={5}
        className={`w-full resize-none bg-transparent text-sm text-white/80 placeholder-white/20 px-4 py-3 outline-none leading-relaxed ${readOnly ? 'cursor-default select-text' : ''}`}
        style={{ caretColor: readOnly ? 'transparent' : undefined }}
      />
      <div className="flex items-center justify-between px-4 pb-3 text-xs text-white/25 select-none">
        <span>{readOnly ? '🎤 Speak your answer using the mic above' : 'You can edit your answer before submitting'}</span>
        <span className="tabular-nums">
          {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words` : '0 words'}
          {' · '}
          {transcript.length} chars
        </span>
      </div>
    </div>
  )
}