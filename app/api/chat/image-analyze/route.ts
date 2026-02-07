import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
    try {
        const { images, prompt, language } = await request.json()

        if (!images || images.length === 0) {
            return NextResponse.json({ error: 'No images provided' }, { status: 400 })
        }

        const apiKey = process.env.GOOGLE_AI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        // Prepare system prompt based on language
        const systemPrompt = `You are MentraAI, analyzing an image for a student learning.

Language: ${language || 'Hinglish'}
You MUST respond in ${language || 'Hinglish'} language only.

${prompt ? `Student's question: ${prompt}` : ''}

Analyze this image and:
1. If it contains handwritten text - transcribe it clearly
2. If it contains math equations - recognize and solve them step-by-step
3. If it contains diagrams/flowcharts - explain the process/concept
4. If it's a screenshot - help understand the content
5. Provide a clear, educational explanation

Be helpful, clear, and educational. Assume the student wants to learn.`

        // Convert base64 images to parts
        const imageParts = images.map((base64Image: string) => ({
            inlineData: {
                data: base64Image.split(',')[1], // Remove data:image/...;base64, prefix
                mimeType: base64Image.split(',')[0].split(':')[1].split(';')[0] // Extract mime type
            }
        }))

        // Generate content with images
        const result = await model.generateContent([systemPrompt, ...imageParts])
        const response = result.response
        const analysis = response.text()

        return NextResponse.json({
            analysis,
            imageCount: images.length
        })

    } catch (error: any) {
        console.error('Image analysis error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to analyze image' },
            { status: 500 }
        )
    }
}
