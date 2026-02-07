'use client'

interface AIInsight {
    type: 'prediction' | 'recommendation' | 'achievement'
    title: string
    description: string
    icon: string
    color: string
}

export default function AIInsightsPanel() {
    const insights: AIInsight[] = [
        {
            type: 'prediction',
            title: 'Exam Readiness: 87%',
            description: 'Based on your progress, you\'re well-prepared! Focus on weak areas for 95%+',
            icon: '🎯',
            color: 'from-green-500 to-emerald-500'
        },
        {
            type: 'recommendation',
            title: 'Study Math Today',
            description: 'Your math concepts need revision. Spend 30 mins on quadratic equations.',
            icon: '📐',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            type: 'achievement',
            title: '7-Day Streak! 🔥',
            description: 'Amazing consistency! You\'re in the top 10% of learners.',
            icon: '🏆',
            color: 'from-orange-500 to-red-500'
        }
    ]

    return (
        <div className="genz-card p-4 sm:p-6">
            <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                    <span>🤖</span> AI Insights
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    Personalized recommendations for you
                </p>
            </div>

            <div className="space-y-3">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-all duration-300"
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0`}>
                                <span className="text-xl">{insight.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-1">
                                    {insight.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <button className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold text-sm hover:shadow-lg transition-all duration-300">
                Get More Insights
            </button>
        </div>
    )
}
