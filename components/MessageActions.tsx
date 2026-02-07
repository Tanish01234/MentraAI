'use client'

import { useState } from 'react'
import TextToSpeech from './TextToSpeech'

interface MessageActionsProps {
    message: string
    onCopy?: () => void
    onRegenerate?: () => void
    onPin?: () => void
    isPinned?: boolean
    language?: 'en-IN' | 'hi-IN'
}

export default function MessageActions({
    message,
    onCopy,
    onRegenerate,
    onPin,
    isPinned,
    language = 'en-IN'
}: MessageActionsProps) {
    const [showActions, setShowActions] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(message)
        setCopied(true)
        onCopy?.()
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Actions bar - appears on hover */}
            <div className={`flex items-center gap-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Read Aloud */}
                <TextToSpeech text={message} language={language} />

                {/* Copy */}
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                    title={copied ? 'Copied!' : 'Copy'}
                >
                    {copied ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                    )}
                </button>

                {/* Pin */}
                {onPin && (
                    <button
                        onClick={onPin}
                        className={`p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] ${isPinned ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-muted)] hover:text-[var(--accent-primary)]'
                            }`}
                        title={isPinned ? 'Unpin' : 'Pin message'}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
                        </svg>
                    </button>
                )}

                {/* Regenerate */}
                {onRegenerate && (
                    <button
                        onClick={onRegenerate}
                        className="p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                        title="Regenerate response"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                    </button>
                )}

                {/* Thumbs up/down */}
                <div className="flex gap-0.5 ml-1">
                    <button
                        className="p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-green-500"
                        title="Helpful"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                        </svg>
                    </button>
                    <button
                        className="p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-500"
                        title="Not helpful"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
