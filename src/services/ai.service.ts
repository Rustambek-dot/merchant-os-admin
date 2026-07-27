/**
 * AI commerce tools — provider interface with OpenAI + mock implementations.
 */

export interface ReviewAnalysis {
  overallSentiment: 'positive' | 'mixed' | 'negative'
  themes: { theme: string; sentiment: 'positive' | 'negative'; mentions: number }[]
  actionItems: string[]
}

export interface AIProvider {
  generateDescription(title: string, features: string): Promise<string>
  analyzeReviews(reviews: string[]): Promise<ReviewAnalysis>
}

class MockAIProvider implements AIProvider {
  async generateDescription(title: string, features: string): Promise<string> {
    const featureList = features.split(/[,;\n]/).filter(Boolean).map((f) => f.trim())
    return (
      `${title} is built for people who care about the details. ` +
      `Crafted with attention to quality and designed for everyday use.\n\n` +
      `Key features:\n${featureList.map((f) => `• ${f}`).join('\n')}\n\n` +
      `Free shipping on orders over $50. 30-day hassle-free returns.\n\n` +
      `— generated in mock mode; add OPENAI_API_KEY for tailored copy`
    )
  }

  async analyzeReviews(reviews: string[]): Promise<ReviewAnalysis> {
    return {
      overallSentiment: 'mixed',
      themes: [
        { theme: 'Product quality', sentiment: 'positive', mentions: Math.max(3, Math.round(reviews.length * 0.6)) },
        { theme: 'Shipping speed', sentiment: 'negative', mentions: Math.max(2, Math.round(reviews.length * 0.3)) },
        { theme: 'Sizing accuracy', sentiment: 'negative', mentions: Math.max(1, Math.round(reviews.length * 0.2)) },
        { theme: 'Customer support', sentiment: 'positive', mentions: Math.max(1, Math.round(reviews.length * 0.15)) },
      ],
      actionItems: [
        'Add a detailed size chart to product pages — sizing complaints drive most returns',
        'Review carrier SLAs: shipping-speed complaints cluster in the last 30 days',
        'Feature quality praise in marketing — it is the strongest recurring theme',
      ],
    }
  }
}

class OpenAIProvider implements AIProvider {
  private async chat(system: string, user: string): Promise<string> {
    const OpenAI = (await import('openai')).default
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.5,
    })
    return res.choices[0]?.message?.content ?? ''
  }

  async generateDescription(title: string, features: string): Promise<string> {
    return this.chat(
      'You write concise, conversion-focused product descriptions for e-commerce. No hype words, concrete benefits.',
      `Product: ${title}\nFeatures: ${features}`
    )
  }

  async analyzeReviews(reviews: string[]): Promise<ReviewAnalysis> {
    const raw = await this.chat(
      'Analyze customer reviews. Return strict JSON: {"overallSentiment": "positive"|"mixed"|"negative", "themes": [{"theme": string, "sentiment": "positive"|"negative", "mentions": number}], "actionItems": string[]}',
      reviews.join('\n---\n')
    )
    return JSON.parse(raw) as ReviewAnalysis
  }
}

export function getAIProvider(): AIProvider {
  return process.env.OPENAI_API_KEY ? new OpenAIProvider() : new MockAIProvider()
}
