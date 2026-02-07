import { NextRequest, NextResponse } from 'next/server'
import { getCustomChatCompletion } from '@/lib/openai'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { get2MinConceptPrompt, type Language, type ExplainMode } from '@/lib/prompts/system'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { topic, language, firstName, mode } = await request.json()

    // Validate topic with helpful error message
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({
        error: 'Topic is required',
        message: 'Please provide a topic name to explain. Example: "Photosynthesis", "Newton\'s Laws", "Quadratic Equations"'
      }, { status: 400 })
    }

    // Check if topic is too short (likely not a real topic)
    if (topic.trim().length < 3) {
      return NextResponse.json({
        error: 'Topic too short',
        message: 'Please provide a complete topic name. Example: "Photosynthesis", "Newton\'s Laws", "Quadratic Equations"'
      }, { status: 400 })
    }

    // Map language to Language type
    const languageMap: { [key: string]: Language } = {
      'English': 'English',
      'Hinglish': 'Hinglish',
      'Gujarati': 'Gujarati'
    }
    const selectedLanguage: Language = languageMap[language] || 'Hinglish'

    // Get the intelligent mode prompt
    const explainMode: ExplainMode = mode || 'core'
    const systemPrompt = get2MinConceptPrompt(selectedLanguage, explainMode)

    // Add personalization if firstName is provided
    const personalizedPrompt = firstName
      ? `${systemPrompt}\n\nUser's name: ${firstName}. Use it naturally if greeting.`
      : systemPrompt

    // Get AI response
    const response = await getCustomChatCompletion(
      personalizedPrompt,
      [{ role: 'user', content: `Topic: ${topic}` }],
      selectedLanguage.toLowerCase() as 'english' | 'hinglish' | 'gujarati'
    )

    return NextResponse.json({
      response,
      mode: explainMode
    })
  } catch (error: any) {
    console.error('2-Min Concept API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate explanation' },
      { status: 500 }
    )
  }
}
