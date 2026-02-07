'use client'

interface DashboardStatsProps {
    totalTime: number      // in hours
    conceptsLearned: number
    currentStreak: number  // in days
    weekActivity: number   // percentage change vs last week
}

export default function DashboardStats({
    totalTime,
    conceptsLearned,
    currentStreak,
    weekActivity
}: DashboardStatsProps) {
    const stats = [
        {
            label: 'Total Study Time',
            value: `${totalTime}h`,
            icon: '⏱️',
            color: 'from-blue-500 to-cyan-500',
            change: weekActivity > 0 ? `+${weekActivity}%` : `${weekActivity}%`
        },
        {
            label: 'Concepts Mastered',
            value: conceptsLearned,
            icon: '🧠',
            color: 'from-purple-500 to-pink-500',
            change: '+12 this week'
        },
        {
            label: 'Current Streak',
            value: `${currentStreak} days`,
            icon: '🔥',
            color: 'from-orange-500 to-red-500',
            change: currentStreak >= 7 ? 'Keep it up!' : 'Build momentum'
        },
        {
            label: 'Exam Readiness',
            value: '87%',
            icon: '🎯',
            color: 'from-green-500 to-emerald-500',
            change: '+5% this week'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="genz-card p-4 sm:p-6 hover:scale-105 transition-transform duration-300"
                >
                    {/* Icon & Label */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl sm:text-4xl">{stat.icon}</div>
                        <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider">
                            {stat.label}
                        </span>
                    </div>

                    {/* Value */}
                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                        {stat.value}
                    </div>

                    {/* Change indicator */}
                    <div className="text-xs text-[var(--text-secondary)]">
                        {stat.change}
                    </div>
                </div>
            ))}
        </div>
    )
}
