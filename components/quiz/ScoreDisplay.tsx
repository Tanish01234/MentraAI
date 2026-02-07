'use client'

interface ScoreResult {
    score: number
    totalQuestions: number
    correctAnswers: number
    xpEarned: number
    timeBonus: number
    newLevel?: number
}

interface ScoreDisplayProps {
    result: ScoreResult
    onRetry?: () => void
    onNewQuiz?: () => void
}

export default function ScoreDisplay({ result, onRetry, onNewQuiz }: ScoreDisplayProps) {
    const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100)

    const getGrade = () => {
        if (percentage >= 90) return { grade: 'A+', emoji: '🏆', color: 'from-green-500 to-emerald-500' }
        if (percentage >= 80) return { grade: 'A', emoji: '🎯', color: 'from-green-500 to-cyan-500' }
        if (percentage >= 70) return { grade: 'B', emoji: '👍', color: 'from-blue-500 to-indigo-500' }
        if (percentage >= 60) return { grade: 'C', emoji: '📚', color: 'from-yellow-500 to-orange-500' }
        return { grade: 'D', emoji: '💪', color: 'from-orange-500 to-red-500' }
    }

    const { grade, emoji, color } = getGrade()

    return (
        <div className="genz-card p-8 max-w-2xl mx-auto text-center animate-scale-in">
            {/* Grade Display */}
            <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce">{emoji}</div>
                <h2 className={`text-5xl sm:text-6xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
                    {grade}
                </h2>
                <p className="text-2xl text-[var(--text-primary)] font-semibold">
                    {percentage}%
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <div className="text-3xl font-bold text-[var(--accent-primary)]">
                        {result.correctAnswers}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">Correct Answers</div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <div className="text-3xl font-bold text-[var(--accent-secondary)]">
                        +{result.xpEarned}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">XP Earned</div>
                </div>

                {result.timeBonus > 0 && (
                    <div className="col-span-2 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                        <div className="text-2xl font-bold text-yellow-400">
                            ⚡ +{result.timeBonus} Speed Bonus!
                        </div>
                    </div>
                )}

                {result.newLevel && (
                    <div className="col-span-2 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 animate-pulse">
                        <div className="text-2xl font-bold text-purple-400">
                            🎊 Level Up! Now Level {result.newLevel}
                        </div>
                    </div>
                )}
            </div>

            {/* Feedback Message */}
            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-elevated)]">
                <p className="text-sm text-[var(--text-secondary)]">
                    {percentage >= 90 && "Outstanding! Keep up the excellent work! 🌟"}
                    {percentage >= 80 && percentage < 90 && "Great job! You're doing really well! 👏"}
                    {percentage >= 70 && percentage < 80 && "Good effort! A bit more practice will help! 📖"}
                    {percentage >= 60 && percentage < 70 && "Not bad! Focus on weak areas for improvement! 💡"}
                    {percentage < 60 && "Keep practicing! You'll get better with time! 💪"}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex-1 py-3 px-6 rounded-xl bg-[var(--bg-elevated)] border-2 border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold transition-all duration-300 hover:scale-105"
                    >
                        🔄 Retry Quiz
                    </button>
                )}
                {onNewQuiz && (
                    <button
                        onClick={onNewQuiz}
                        className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        ➡️ New Quiz
                    </button>
                )}
            </div>

            {/* Share */}
            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-muted)] mb-3">Share your achievement:</p>
                <button className="px-6 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary)]/20 border border-[var(--border-subtle)] text-sm font-medium transition-all duration-300">
                    📤 Share Score
                </button>
            </div>
        </div>
    )
}
