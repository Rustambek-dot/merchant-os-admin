'use client'

import Link from 'next/link'
import { ShoppingCart, Package, TicketPercent, Sparkles, BarChart3, RotateCcw } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="container-app flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              M
            </div>
            <span className="font-bold text-lg">Merchant OS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-zinc-600 hover:text-zinc-900 font-medium">Sign In</Link>
            <Link href="/auth/register" className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 container-app text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          The back office your store deserves
        </h1>
        <p className="text-xl text-zinc-500 mb-8 max-w-2xl mx-auto">
          Orders, products with variants, customers, and discounts — in a fast, minimal admin.
          With AI that writes product copy and reads your reviews.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register" className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors">
            Start Free Trial
          </Link>
          <Link href="/auth/login" className="px-8 py-3 border border-zinc-300 rounded-lg font-semibold hover:border-zinc-500 transition-colors">
            Live Demo
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-xl overflow-hidden mt-20 text-left">
          {[
            { icon: ShoppingCart, title: 'Order pipeline', text: 'From paid to delivered, with refunds handled in two clicks.' },
            { icon: Package, title: 'Variants done right', text: 'Sizes, colors, per-variant stock and pricing.' },
            { icon: Sparkles, title: 'AI product copy', text: 'Conversion-focused descriptions generated from bullet points.' },
            { icon: BarChart3, title: 'Revenue analytics', text: 'AOV, conversion, and sales trends without spreadsheets.' },
            { icon: TicketPercent, title: 'Smart discounts', text: 'Percent or fixed codes with usage limits and stats.' },
            { icon: RotateCcw, title: 'Review intelligence', text: 'AI clusters feedback into themes and action items.' },
          ].map((f) => (
            <div key={f.title} className="bg-white p-6">
              <f.icon className="w-6 h-6 mb-3" />
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-10 text-center text-zinc-400 text-sm">
        © 2026 Merchant OS
      </footer>
    </div>
  )
}
