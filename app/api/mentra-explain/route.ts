import { NextRequest, NextResponse } from 'next/server'
import { getCustomChatCompletion, getStructuredChatCompletion } from '@/lib/openai'
import { get2MinConceptPrompt, getDeepDivePrompt, type Language } from '@/lib/prompts/system'
import { createServerSupabaseClient } from '@/lib/supabase/server'

type ExplainMode = '2min' | 'deep-dive'

/**
 * MentraAI Dual-Mode Explanation API
 * Supports both "Explain in 2 Minutes" and "Deep Dive" modes
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerSupabaseClient()

        // Auth check (optional - only if Supabase is configured)
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        const { concept, mode, language } = await request.json()

        // Validation
        if (!concept || typeof concept !== 'string') {
            return NextResponse.json({ error: 'Concept is required' }, { status: 400 })
        }

        if (!mode || !['2min', 'deep-dive'].includes(mode)) {
            return NextResponse.json({ error: 'Invalid mode. Must be "2min" or "deep-dive"' }, { status: 400 })
        }

        const normalizedLanguage: Language = normalizeLanguage(language)

        // Handle based on mode
        if (mode === '2min') {
            return await handle2MinMode(concept, normalizedLanguage)
        } else {
            return await handleDeepDiveMode(concept, normalizedLanguage)
        }

    } catch (error: any) {
        console.error('MentraExplain API Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate explanation' },
            { status: 500 }
        )
    }
}

/**
 * Handle "Explain in 2 Minutes" mode
 */
async function handle2MinMode(concept: string, language: Language) {
    const systemPrompt = get2MinConceptPrompt(language, 'core')

    const messages = [
        {
            role: 'user' as const,
            content: `Concept: ${concept}`
        }
    ]

    try {
        const response = await getCustomChatCompletion(systemPrompt, messages, language.toLowerCase() as any)

        // Parse the response to extract the three sections
        const parsed = parse2MinResponse(response)

        if (!parsed.coreIdea || !parsed.example || !parsed.takeaway) {
            throw new Error('AI response did not follow the required structure')
        }

        return NextResponse.json({
            mode: '2min',
            concept,
            coreIdea: parsed.coreIdea,
            example: parsed.example,
            takeaway: parsed.takeaway,
            rawResponse: response
        })

    } catch (error: any) {
        console.error('2Min Mode Error:', error)
        return NextResponse.json(
            { error: 'Failed to generate 2-minute explanation. Please try again.' },
            { status: 500 }
        )
    }
}

/**
 * Handle "Deep Dive" mode
 */
async function handleDeepDiveMode(concept: string, language: Language) {
    const systemPrompt = getDeepDivePrompt(language)

    const messages = [
        {
            role: 'user' as const,
            content: `Concept: ${concept}`
        }
    ]

    try {
        const response = await getStructuredChatCompletion(systemPrompt, messages, language.toLowerCase() as any)

        // Validate that all required keys are present
        const requiredKeys = ['overview', 'whyItMatters', 'stepByStep', 'example', 'commonMistakes', 'memoryTrick', 'takeaway']
        const missingKeys = requiredKeys.filter(key => !response[key])

        if (missingKeys.length > 0) {
            throw new Error(`Missing required fields: ${missingKeys.join(', ')}`)
        }

        // Validate stepByStep and commonMistakes are arrays
        if (!Array.isArray(response.stepByStep) || response.stepByStep.length === 0) {
            throw new Error('stepByStep must be a non-empty array')
        }

        if (!Array.isArray(response.commonMistakes) || response.commonMistakes.length === 0) {
            throw new Error('commonMistakes must be a non-empty array')
        }

        return NextResponse.json({
            mode: 'deep-dive',
            concept,
            ...response
        })

    } catch (error: any) {
        console.error('Deep Dive Mode Error:', error)
        return NextResponse.json(
            { error: 'Failed to generate deep dive explanation. The AI did not return valid JSON. Please try again.' },
            { status: 500 }
        )
    }
}

/**
 * Parse 2-minute response to extract sections
 */
function parse2MinResponse(response: string): { coreIdea: string; example: string; takeaway: string } {
    const lines = response.split('\n').filter(line => line.trim())

    let coreIdea = ''
    let example = ''
    let takeaway = ''

    let currentSection = ''

    for (const line of lines) {
        const trimmed = line.trim()

        // Detect section headers
        if (trimmed.match(/^1️⃣|core idea/i)) {
            currentSection = 'core'
            continue
        } else if (trimmed.match(/^2️⃣|simple example|example/i)) {
            currentSection = 'example'
            continue
        } else if (trimmed.match(/^3️⃣|key takeaway|takeaway/i)) {
            currentSection = 'takeaway'
            continue
        }

        // Skip empty lines and section markers
        if (!trimmed || trimmed.startsWith('-') && trimmed.length < 5) {
            continue
        }

        // Add content to appropriate section
        if (currentSection === 'core') {
            coreIdea += (coreIdea ? '\n' : '') + trimmed.replace(/^-\s*/, '')
        } else if (currentSection === 'example') {
            example += (example ? '\n' : '') + trimmed.replace(/^-\s*/, '')
        } else if (currentSection === 'takeaway') {
            takeaway += (takeaway ? '\n' : '') + trimmed.replace(/^-\s*/, '')
        }
    }

    return { coreIdea, example, takeaway }
}

/**
 * Normalize language string to Language type
 */
function normalizeLanguage(lang: string): Language {
    if (!lang) return 'Hinglish'

    const lower = lang.toLowerCase()
    if (lower === 'english') return 'English'
    if (lower === 'gujarati') return 'Gujarati'
    return 'Hinglish'
}
