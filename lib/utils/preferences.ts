/**
 * User Preferences Utility
 * Handles fetching and building AI prompts based on user preferences
 */

export interface UserPreferences {
    // Learning Preferences
    study_mode: string
    difficulty_level: string
    response_length: string
    explanation_style: string

    // AI Behavior
    ai_tone: string
    language_mix: string
    quiz_frequency: string
    reminder_notifications: boolean

    // Study Goals
    daily_study_time: number
    weekly_quiz_target: number
    focus_subjects?: string[]
    exam_date?: string

    // Interface
    font_size: string
    animations_enabled: boolean
    compact_mode: boolean
}

/**
 * Default preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
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
    focus_subjects: [],
    font_size: 'medium',
    animations_enabled: true,
    compact_mode: false
}

/**
 * Fetch user preferences from API
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
        const response = await fetch(`/api/preferences?userId=${userId}`)
        const data = await response.json()

        if (data.preferences) {
            return { ...DEFAULT_PREFERENCES, ...data.preferences }
        }

        return DEFAULT_PREFERENCES
    } catch (error) {
        console.error('Failed to fetch user preferences:', error)
        return DEFAULT_PREFERENCES
    }
}

/**
 * Build AI prompt section based on user preferences
 */
export function buildPreferencesPrompt(prefs: UserPreferences): string {
    let prompt = '\n🎯 USER PREFERENCES (PERSONALIZATION)\n\n'

    // Difficulty Level
    prompt += '**Difficulty Level:**\n'
    if (prefs.difficulty_level === 'beginner') {
        prompt += '- Use SIMPLE language, avoid jargon\n'
        prompt += '- Explain concepts step-by-step like teaching a beginner\n'
        prompt += '- Use everyday analogies and examples\n'
        prompt += '- Break down complex topics into smaller parts\n'
    } else if (prefs.difficulty_level === 'intermediate') {
        prompt += '- Balance theory and practice\n'
        prompt += '- Use standard terminology with brief explanations\n'
        prompt += '- Assume basic prior knowledge\n'
    } else { // advanced
        prompt += '- Use TECHNICAL terms and formal language\n'
        prompt += '- Assume strong prior knowledge\n'
        prompt += '- Go deep into concepts, include formulas and proofs\n'
        prompt += '- Use precise academic terminology\n'
    }
    prompt += '\n'

    // Response Length
    prompt += '**Response Length:**\n'
    if (prefs.response_length === 'concise') {
        prompt += '- Keep answers BRIEF and to the point (2-3 paragraphs max)\n'
        prompt += '- Focus on key points only\n'
        prompt += '- BUT ALWAYS cover ALL parts of the question completely\n'
    } else if (prefs.response_length === 'balanced') {
        prompt += '- Provide comprehensive answers with examples\n'
        prompt += '- Balance detail with readability\n'
    } else { // detailed
        prompt += '- Give IN-DEPTH explanations\n'
        prompt += '- Include multiple examples and use cases\n'
        prompt += '- Cover all aspects thoroughly\n'
    }
    prompt += '\n'

    // Explanation Style
    prompt += '**Explanation Style:**\n'
    if (prefs.explanation_style === 'simple') {
        prompt += '- Use everyday language and simple analogies\n'
        prompt += '- Avoid technical jargon\n'
        prompt += '- Explain like talking to a friend\n'
    } else if (prefs.explanation_style === 'with_examples') {
        prompt += '- ALWAYS include practical examples and use cases\n'
        prompt += '- Use real-world scenarios\n'
        prompt += '- Show how concepts apply in practice\n'
    } else { // technical
        prompt += '- Use precise technical terminology\n'
        prompt += '- Include formal definitions\n'
        prompt += '- Use academic/scientific language\n'
    }
    prompt += '\n'

    // AI Tone
    prompt += '**AI Tone:**\n'
    if (prefs.ai_tone === 'friendly') {
        prompt += '- Be warm, encouraging, and supportive\n'
        prompt += '- Use a conversational, friendly tone\n'
        prompt += '- Make learning feel comfortable and approachable\n'
    } else if (prefs.ai_tone === 'professional') {
        prompt += '- Be formal, direct, and business-like\n'
        prompt += '- Maintain professional distance\n'
        prompt += '- Focus on facts and clarity\n'
    } else { // motivational
        prompt += '- Be INSPIRING, energetic, and confidence-building\n'
        prompt += '- Encourage and motivate the student\n'
        prompt += '- Celebrate progress and effort\n'
    }
    prompt += '\n'

    // Focus Subjects (if any)
    if (prefs.focus_subjects && prefs.focus_subjects.length > 0) {
        prompt += '**Focus Subjects:**\n'
        prompt += `The user is focusing on: ${prefs.focus_subjects.join(', ')}\n`
        prompt += 'When relevant, prioritize examples and explanations from these subjects.\n\n'
    }

    // CRITICAL: Completeness instruction
    prompt += '⚠️ **ANSWER COMPLETENESS (CRITICAL - NON-NEGOTIABLE):**\n'
    prompt += '✅ When user asks about a topic with MULTIPLE parts, you MUST cover ALL parts completely\n'
    prompt += '✅ Examples:\n'
    prompt += '  - "Newton\'s laws" → Explain ALL 3 laws (1st, 2nd, 3rd) completely\n'
    prompt += '  - "Types of clouds" → Cover ALL major types (Cumulus, Stratus, Cirrus, Nimbus)\n'
    prompt += '  - "Fundamental forces" → ALL 4 forces (Gravity, Electromagnetic, Strong, Weak)\n'
    prompt += '  - "States of matter" → ALL states (Solid, Liquid, Gas, Plasma, BEC)\n'
    prompt += '✅ NEVER give partial answers or stop mid-explanation\n'
    prompt += '✅ NEVER say "I\'ll explain 2 of the 3 laws" - explain ALL\n'
    prompt += '✅ If topic is too broad, ask for clarification BEFORE answering\n'
    prompt += '✅ Be CONFIDENT and COMPLETE in every response\n\n'

    return prompt
}
