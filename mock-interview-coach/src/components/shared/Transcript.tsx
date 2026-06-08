import { useEffect, useRef } from 'react'

interface TranscriptBoxProps {
  transcript: string        // ← was "value"
  onChange: (value: string) => void
  isListening?: boolean
}

export default function TranscriptBox({ transcript, onChange, isListening = false }: TranscriptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [transcript])

  const wordCount = transcript.trim() === '' ? 0 : transcript.trim().split(/\s+/).length
  const charCount = transcript.length

  return (
    <div className="space-y-2">
      <div className={`relative rounded-xl border transition-colors duration-200 ${
        isListening ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'
      }`}>
        {isListening && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs text-red-400 font-medium">Listening</span>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={transcript}           // ← was "value"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer will appear here as you speak..."
          rows={6}
          className="w-full bg-transparent text-white/85 text-sm leading-relaxed px-4 py-3 resize-none outline-none placeholder:text-white/25 pr-28"
        />
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-white/30">
          {isListening ? 'Speak now — or type your answer above' : 'You can edit your answer before submitting'}
        </p>
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span className="text-white/15">·</span>
          <span>{charCount} chars</span>
        </div>
      </div>
    </div>
  )
}