import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Get user preferences
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            )
        }

        const supabase = createServerSupabaseClient()

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database not configured' },
                { status: 503 }
            )
        }

        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Preferences fetch error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch preferences' },
                { status: 500 }
            )
        }

        // Return default preferences if none exist
        if (!data) {
            return NextResponse.json({
                preferences: {
                    study_mode: 'mixed',
                    difficulty_level: 'intermediate',
                    response_length: 'balanced',
                    explanation_style: 'with_examples',
                    ai_tone: 'friendly',
                    language_mix: 'balanced',
                    quiz_frequency: 'weekly',
                    reminder_notifications: true,
                    daily_study_time: 30,
                    weekly_quiz_target: 5,
                    theme: 'auto',
                    font_size: 'medium',
                    animations_enabled: true,
                    compact_mode: false,
                    analytics_enabled: true,
                    personalization_enabled: true,
                    email_notifications: true
                }
            })
        }

        return NextResponse.json({
            preferences: data
        })
    } catch (error) {
        console.error('Preferences GET API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Update user preferences
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { user_id, preferences } = body

        if (!user_id || !preferences) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = createServerSupabaseClient()

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database not configured' },
                { status: 503 }
            )
        }

        // Try to update first
        const { data: existing } = await supabase
            .from('user_preferences')
            .select('user_id')
            .eq('user_id', user_id)
            .single()

        if (existing) {
            // Update existing preferences
            const { data, error } = await supabase
                .from('user_preferences')
                .update(preferences)
                .eq('user_id', user_id)
                .select()
                .single()

            if (error) {
                console.error('Preferences update error:', error)
                return NextResponse.json(
                    { error: 'Failed to update preferences' },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                success: true,
                preferences: data
            })
        } else {
            // Insert new preferences
            const { data, error } = await supabase
                .from('user_preferences')
                .insert({
                    user_id,
                    ...preferences
                })
                .select()
                .single()

            if (error) {
                console.error('Preferences insert error:', error)
                return NextResponse.json(
                    { error: 'Failed to create preferences' },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                success: true,
                preferences: data
            })
        }
    } catch (error) {
        console.error('Preferences POST API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
