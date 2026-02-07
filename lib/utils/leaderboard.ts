import { supabase } from '@/lib/supabase/client'

export interface LeaderboardEntry {
    rank: number
    user_id: string
    username: string
    total_score: number
    total_xp: number
    level: number
    quizzes_completed: number
    weekly_score: number
    last_quiz_at?: string
}

/**
 * Calculate level from total XP
 */
export function calculateLevel(totalXP: number): number {
    return Math.floor(totalXP / 250) + 1
}

/**
 * Calculate XP earned from quiz
 */
export function calculateQuizXP(correctAnswers: number, totalQuestions: number): {
    baseXP: number
    streakBonus: number
    timeBonus: number
    totalXP: number
} {
    const baseXP = correctAnswers * 10
    const streakBonus = correctAnswers === totalQuestions ? 25 : 0
    const timeBonus = Math.floor(Math.random() * 10) // Can be enhanced with actual time tracking

    return {
        baseXP,
        streakBonus,
        timeBonus,
        totalXP: baseXP + streakBonus + timeBonus
    }
}

/**
 * Update user score after completing a quiz
 */
export async function updateUserScore(
    userId: string,
    username: string,
    quizScore: number,
    xpEarned: number
) {
    if (!supabase) {
        console.error('Supabase client not initialized')
        return null
    }

    try {
        // Check if user exists in leaderboard
        const { data: existing } = await supabase
            .from('leaderboard_scores')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (existing) {
            // Update existing record
            const newTotalXP = existing.total_xp + xpEarned
            const newLevel = calculateLevel(newTotalXP)

            const { data, error } = await supabase
                .from('leaderboard_scores')
                .update({
                    total_score: existing.total_score + quizScore,
                    total_xp: newTotalXP,
                    level: newLevel,
                    quizzes_completed: existing.quizzes_completed + 1,
                    weekly_score: existing.weekly_score + quizScore,
                    last_quiz_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .select()
                .single()

            if (error) throw error
            return data
        } else {
            // Create new record
            const level = calculateLevel(xpEarned)

            const { data, error } = await supabase
                .from('leaderboard_scores')
                .insert({
                    user_id: userId,
                    username,
                    total_score: quizScore,
                    total_xp: xpEarned,
                    level,
                    quizzes_completed: 1,
                    weekly_score: quizScore,
                    last_quiz_at: new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return data
        }
    } catch (error) {
        console.error('Error updating user score:', error)
        return null
    }
}

/**
 * Fetch top N users from leaderboard
 */
export async function getTopUsers(limit: number = 10): Promise<LeaderboardEntry[]> {
    if (!supabase) {
        console.error('Supabase client not initialized')
        return []
    }

    try {
        const { data, error } = await supabase
            .from('leaderboard_ranked')
            .select('*')
            .limit(limit)

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return []
    }
}

/**
 * Get user's current rank
 */
export async function getUserRank(userId: string): Promise<number | null> {
    if (!supabase) {
        console.error('Supabase client not initialized')
        return null
    }

    try {
        const { data, error } = await supabase
            .from('leaderboard_ranked')
            .select('rank')
            .eq('user_id', userId)
            .single()

        if (error) throw error
        return data?.rank || null
    } catch (error) {
        console.error('Error fetching user rank:', error)
        return null
    }
}

/**
 * Subscribe to real-time leaderboard updates
 */
export function subscribeToLeaderboard(callback: () => void) {
    if (!supabase) {
        console.error('Supabase client not initialized')
        return null
    }

    const subscription = supabase
        .channel('leaderboard-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'leaderboard_scores'
            },
            () => {
                callback()
            }
        )
        .subscribe()

    return subscription
}

/**
 * Unsubscribe from leaderboard updates
 */
export async function unsubscribeFromLeaderboard(subscription: any) {
    if (subscription) {
        await supabase?.removeChannel(subscription)
    }
}
