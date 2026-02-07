'use client'

import { useState, useEffect } from 'react'
import DashboardStats from '@/components/dashboard/DashboardStats'
import ProgressChart from '@/components/dashboard/ProgressChart'
import WeakAreasHeatMap from '@/components/dashboard/WeakAreasHeatMap'
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel'

export default function AnalyticsPage() {
    // Demo data - in production, fetch from API/database
    const [dashboardData, setDashboardData] = useState({
        totalTime: 24,
        conceptsLearned: 47,
        currentStreak: 7,
        weekActivity: 15,
        weeklyData: [
            { date: '2024-01-16', hours: 2 },
            { date: '2024-01-17', hours: 3.5 },
            { date: '2024-01-18', hours: 2.5 },
            { date: '2024-01-19', hours: 4 },
            { date: '2024-01-20', hours: 3 },
            { date: '2024-01-21', hours: 5 },
            { date: '2024-01-22', hours: 4 }
        ],
        weakAreas: [
            { topic: 'Quadratic Equations', score: 45 },
            { topic: 'Chemical Bonding', score: 62 },
            { topic: 'Newton\'s Laws', score: 55 },
            { topic: 'Cell Biology', score: 78 },
            { topic: 'Thermodynamics', score: 40 },
            { topic: 'Organic Chemistry', score: 85 }
        ]
    })

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-24 pb-12">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
                        📊 Learning Analytics
                    </h1>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                        Track your progress, identify weak areas, and get AI-powered insights
                    </p>
                </div>

                {/* Stats Cards */}
                <DashboardStats
                    totalTime={dashboardData.totalTime}
                    conceptsLearned={dashboardData.conceptsLearned}
                    currentStreak={dashboardData.currentStreak}
                    weekActivity={dashboardData.weekActivity}
                />

                {/* Charts & Heatmap Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Progress Chart */}
                    <ProgressChart data={dashboardData.weeklyData} />

                    {/* Weak Areas Heatmap */}
                    <WeakAreasHeatMap areas={dashboardData.weakAreas} />
                </div>

                {/* AI Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <AIInsightsPanel />
                    </div>

                    {/* Quick Actions */}
                    <div className="genz-card p-4 sm:p-6">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 px-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary)]/20 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-left transition-all duration-300 flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                <div>
                                    <div className="font-semibold text-sm">Take Quiz</div>
                                    <div className="text-xs text-[var(--text-muted)]">Test your knowledge</div>
                                </div>
                            </button>

                            <button className="w-full py-3 px-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--accent-secondary)]/20 border border-[var(--border-subtle)] hover:border-[var(--accent-secondary)] text-left transition-all duration-300 flex items-center gap-3">
                                <span className="text-2xl">📚</span>
                                <div>
                                    <div className="font-semibold text-sm">Study Plan</div>
                                    <div className="text-xs text-[var(--text-muted)]">Get AI recommendations</div>
                                </div>
                            </button>

                            <button className="w-full py-3 px-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--accent-tertiary)]/20 border border-[var(--border-subtle)] hover:border-[var(--accent-tertiary)] text-left transition-all duration-300 flex items-center gap-3">
                                <span className="text-2xl">🏆</span>
                                <div>
                                    <div className="font-semibold text-sm">Achievements</div>
                                    <div className="text-xs text-[var(--text-muted)]">View your badges</div>
                                </div>
                            </button>

                            <button className="w-full py-3 px-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-blue-500/20 border border-[var(--border-subtle)] hover:border-blue-500 text-left transition-all duration-300 flex items-center gap-3">
                                <span className="text-2xl">📊</span>
                                <div>
                                    <div className="font-semibold text-sm">Export Report</div>
                                    <div className="text-xs text-[var(--text-muted)]">Download PDF</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 p-4 rounded-xl bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span>🤖</span>
                        <span>Last updated: Just now • Data refreshes every 5 minutes</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
