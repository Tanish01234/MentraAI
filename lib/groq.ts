/**
 * Groq API Integration
 * Fast LLM inference - Fallback when Gemini fails
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim()
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export interface GroqMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface GroqChatOptions {
    temperature?: number
    max_tokens?: number
    stream?: boolean
}

/**
 * Get chat completion from Groq
 */
export async function getGroqChatCompletion(
    messages: GroqMessage[],
    options: GroqChatOptions = {}
): Promise<string> {
    if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured')
    }

    const {
        temperature = 0.3,
        max_tokens = 800,
    } = options

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages,
                temperature,
                max_tokens,
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('Groq API Error:', error)
            throw new Error(`Groq API failed: ${response.status}`)
        }

        const data = await response.json()
        return data.choices[0]?.message?.content || ''
    } catch (error: any) {
        console.error('Groq API Error:', error)
        throw new Error(error.message || 'Failed to get Groq response')
    }
}

/**
 * Get streaming chat completion from Groq
 */
export async function getGroqChatStream(
    messages: GroqMessage[],
    options: GroqChatOptions = {}
): Promise<ReadableStream> {
    if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured')
    }

    const {
        temperature = 0.3,
        max_tokens = 800,
    } = options

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages,
                temperature,
                max_tokens,
                stream: true,
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('Groq Stream Error:', error)
            throw new Error(`Groq API failed: ${response.status}`)
        }

        if (!response.body) {
            throw new Error('No response body from Groq')
        }

        // Transform SSE stream to text stream
        return new ReadableStream({
            async start(controller) {
                const reader = response.body!.getReader()
                const decoder = new TextDecoder()

                try {
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break

                        const chunk = decoder.decode(value)
                        const lines = chunk.split('\n').filter(line => line.trim())

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6)
                                if (data === '[DONE]') continue

                                try {
                                    const parsed = JSON.parse(data)
                                    const content = parsed.choices[0]?.delta?.content
                                    if (content) {
                                        controller.enqueue(new TextEncoder().encode(content))
                                    }
                                } catch (e) {
                                    // Skip invalid JSON
                                }
                            }
                        }
                    }
                } catch (error) {
                    controller.error(error)
                } finally {
                    controller.close()
                }
            }
        })
    } catch (error: any) {
        console.error('Groq Stream Error:', error)
        throw new Error(error.message || 'Failed to get Groq stream')
    }
}

/**
 * Get structured JSON response from Groq
 */
export async function getGroqStructuredCompletion(
    messages: GroqMessage[],
    options: GroqChatOptions = {}
): Promise<any> {
    const response = await getGroqChatCompletion(messages, {
        ...options,
        max_tokens: options.max_tokens || 2000,
    })

    try {
        return JSON.parse(response)
    } catch (error) {
        console.error('Groq JSON Parse Error:', error)
        console.log('Raw response:', response)
        throw new Error('Failed to parse Groq response as JSON')
    }
}

/**
 * Check if Groq API is available
 */
export function isGroqAvailable(): boolean {
    return !!GROQ_API_KEY
}
