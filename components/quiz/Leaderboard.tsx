'use client'

import { useEffect, useState } from 'react'

interface LeaderboardEntry {
    rank: number
    name?: string
    username?: string
    score?: number
    xp?: number
    total_xp?: number
    level: number
    avatar?: string
    weekly_score?: number
}

interface LeaderboardProps {
    entries: LeaderboardEntry[]
    currentUser?: string
    loading?: boolean
    onRefresh?: () => void
}

export default function Leaderboard({ entries, currentUser, loading = false, onRefresh }: LeaderboardProps) {
    return (
        <div className="genz-card p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                        <span>🏆</span> Leaderboard
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                        Top performers this week
                    </p>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                        title="Refresh leaderboard"
                    >
                        <svg className={`w-5 h-5 text-[var(--text-secondary)] ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                )}
            </div>

            {loading && entries.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-[var(--accent-primary)] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-[var(--text-secondary)]">Loading leaderboard...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {entries.map((entry) => {
                        const displayName = entry.name || entry.username || 'Unknown'
                        const displayXP = entry.xp || entry.total_xp || 0
                        const displayScore = entry.score || entry.weekly_score || 0
                        const isCurrentUser = displayName === currentUser
                        const topThree = entry.rank <= 3

                        return (
                            <div
                                key={entry.rank}
                                className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${isCurrentUser
                                    ? 'bg-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)] scale-105'
                                    : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Rank */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${entry.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                                        entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                                            entry.rank === 3 ? 'bg-gradient-to-r from-orange-700 to-orange-800 text-white' :
                                                'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                                        }`}>
                                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {entry.avatar || displayName.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm sm:text-base text-[var(--text-primary)] truncate">
                                            {displayName}
                                            {isCurrentUser && <span className="ml-2 text-xs text-[var(--accent-primary)]">(You)</span>}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)]">
                                            Level {entry.level} • {displayXP} XP
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right">
                                        <div className="text-lg sm:text-xl font-bold text-[var(--accent-primary)]">
                                            {displayScore}
                                        </div>
                                        <div className="text-[10px] text-[var(--text-muted)]">
                                            points
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] text-center">
                <p className="text-xs text-[var(--text-muted)]">
                    {loading ? 'Updating...' : 'Live updates • Keep playing to climb up! 🚀'}
                </p>
            </div>
        </div>
    )
}
