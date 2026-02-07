'use client'

interface SmartSuggestionsProps {
    suggestions: string[]
    onSelect: (suggestion: string) => void
    loading?: boolean
}

export default function SmartSuggestions({ suggestions, onSelect, loading }: SmartSuggestionsProps) {
    if (loading) {
        return (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="px-4 py-2 rounded-full bg-[var(--bg-elevated)] animate-pulse h-9 w-32" />
                ))}
            </div>
        )
    }

    if (!suggestions || suggestions.length === 0) return null

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar animate-slide-up">
            {suggestions.map((suggestion, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(suggestion)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap
                     bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary)]/20 
                     text-[var(--text-secondary)] hover:text-[var(--accent-primary)]
                     border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50
                     transition-all duration-200 hover:scale-105"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    )
}
