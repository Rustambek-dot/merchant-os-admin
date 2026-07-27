import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAIProvider } from '@/services/ai.service'

const bodySchema = z.object({
  title: z.string().min(2).max(300),
  features: z.string().min(2).max(4000),
})

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const description = await getAIProvider().generateDescription(parsed.data.title, parsed.data.features)
    return NextResponse.json({ data: { description } })
  } catch (error) {
    console.error('Description generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
