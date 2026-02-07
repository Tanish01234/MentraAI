'use client'

import { useState } from 'react'

interface TextToSpeechProps {
    text: string
    language?: 'en-IN' | 'hi-IN' | 'en-US'
    className?: string
}

export default function TextToSpeech({ text, language = 'en-IN', className = '' }: TextToSpeechProps) {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window)

    const speak = () => {
        if (!isSupported || !text) return

        // Stop if already speaking
        if (isSpeaking) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
            return
        }

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }

    if (!isSupported) return null

    return (
        <button
            onClick={speak}
            className={`p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] ${className}`}
            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
        >
            {isSpeaking ? (
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            )}
        </button>
    )
}
