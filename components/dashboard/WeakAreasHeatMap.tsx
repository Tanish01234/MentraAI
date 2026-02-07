'use client'

interface WeakArea {
    topic: string
    score: number  // 0-100
}

interface WeakAreasHeatMapProps {
    areas: WeakArea[]
}

export default function WeakAreasHeatMap({ areas }: WeakAreasHeatMapProps) {
    const getColorClass = (score: number) => {
        if (score >= 80) return 'bg-green-500/20 border-green-500/40 text-green-400'
        if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
        if (score >= 40) return 'bg-orange-500/20 border-orange-500/40 text-orange-400'
        return 'bg-red-500/20 border-red-500/40 text-red-400'
    }

    const getEmoji = (score: number) => {
        if (score >= 80) return '✅'
        if (score >= 60) return '⚠️'
        return '🔴'
    }

    return (
        <div className="genz-card p-4 sm:p-6">
            <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1">
                    Weak Areas Analysis
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    Topics that need more focus
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {areas.map((area, idx) => (
                    <div
                        key={idx}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${getColorClass(area.score)}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{getEmoji(area.score)}</span>
                            <span className="text-xs sm:text-sm font-bold">{area.score}%</span>
                        </div>
                        <div className="text-xs sm:text-sm font-medium truncate">
                            {area.topic}
                        </div>

                        {/* Progress bar */}
                        <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-current transition-all duration-500"
                                style={{ width: `${area.score}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-500/40"></div>
                    <span className="text-[var(--text-muted)]">Strong (80%+)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-yellow-500/40"></div>
                    <span className="text-[var(--text-muted)]">Okay (60-80%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-500/40"></div>
                    <span className="text-[var(--text-muted)]">Needs Focus (&lt;60%)</span>
                </div>
            </div>
        </div>
    )
}
