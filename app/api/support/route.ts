import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, subject, category, message, priority, user_id } = body

        // Validation
        if (!name || !email || !subject || !category || !message) {
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

        // Insert support ticket
        const { data, error } = await supabase
            .from('support_tickets')
            .insert({
                user_id: user_id || null,
                name,
                email,
                subject,
                category,
                message,
                priority: priority || 'medium',
                status: 'open'
            })
            .select()
            .single()

        if (error) {
            console.error('Support ticket creation error:', error)
            return NextResponse.json(
                { error: 'Failed to create support ticket' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            ticket: data
        })
    } catch (error) {
        console.error('Support API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Get user's support tickets
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
            .from('support_tickets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Support tickets fetch error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch tickets' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            tickets: data || []
        })
    } catch (error) {
        console.error('Support GET API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
