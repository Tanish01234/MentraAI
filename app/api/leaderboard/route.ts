import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '10')
        const userId = searchParams.get('userId')

        const supabase = createServerSupabaseClient()

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database not configured' },
                { status: 503 }
            )
        }

        // Fetch top users from ranked view
        const { data: leaderboard, error } = await supabase
            .from('leaderboard_ranked')
            .select('*')
            .limit(limit)

        if (error) {
            console.error('Leaderboard fetch error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch leaderboard' },
                { status: 500 }
            )
        }

        // Get user's rank if userId provided
        let userRank = null
        if (userId) {
            const { data: userRankData } = await supabase
                .from('leaderboard_ranked')
                .select('rank')
                .eq('user_id', userId)
                .single()

            userRank = userRankData?.rank || null
        }

        return NextResponse.json({
            leaderboard: leaderboard || [],
            userRank,
            total: leaderboard?.length || 0
        })
    } catch (error) {
        console.error('Leaderboard API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
