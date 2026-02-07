interface TwoMinuteCardProps {
    concept: string
    coreIdea: string
    example: string
    takeaway: string
}

export default function TwoMinuteCard({ concept, coreIdea, example, takeaway }: TwoMinuteCardProps) {
    return (
        <div className="genz-card w-full max-w-full sm:max-w-3xl mx-auto overflow-hidden animate-scale-in border border-[var(--accent-secondary)]/40 shadow-2xl bg-[#0a0a0a]/95 backdrop-blur-xl my-4 sm:my-6">
            {/* Header */}
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-subtle)] bg-gradient-to-r from-[var(--accent-secondary)]/20 via-amber-900/20 to-transparent flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-[var(--accent-secondary)]/20 rounded-lg">
                    <span className="text-lg sm:text-xl">⚡</span>
                </div>
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Explain in 2 Minutes</h3>
                    <p className="text-[9px] sm:text-[10px] text-[var(--accent-secondary)] uppercase tracking-widest font-semibold">Quick Concept Clarity</p>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Concept Title */}
                <div className="text-center pb-3 sm:pb-4 border-b border-[var(--border-subtle)]">
                    <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{concept}</h4>
                </div>

                {/* 1. Core Idea */}
                <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                        <span>1️⃣</span> Core Idea
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                        {coreIdea}
                    </p>
                </div>

                {/* 2. Simple Example */}
                <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-500/20">
                    <h4 className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                        <span>2️⃣</span> Simple Example
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                        {example}
                    </p>
                </div>

                {/* 3. Key Takeaway */}
                <div className="pt-3 sm:pt-4 border-t border-[var(--border-subtle)] text-center">
                    <h4 className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 sm:mb-3 flex items-center justify-center gap-1.5 sm:gap-2">
                        <span>3️⃣</span> Key Takeaway
                    </h4>
                    <p className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-[var(--accent-secondary)] to-amber-500 bg-clip-text text-transparent px-2">
                        {takeaway}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="px-3 sm:px-6 py-2 sm:py-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] text-center">
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                    ⏱️ Reading time: Under 2 minutes
                </p>
            </div>
        </div>
    )
}
