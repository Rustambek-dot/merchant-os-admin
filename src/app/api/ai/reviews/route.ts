import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAIProvider } from '@/services/ai.service'

const bodySchema = z.object({ reviews: z.array(z.string().max(4000)).min(1).max(500) })

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const analysis = await getAIProvider().analyzeReviews(parsed.data.reviews)
    return NextResponse.json({ data: analysis })
  } catch (error) {
    console.error('Review analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
