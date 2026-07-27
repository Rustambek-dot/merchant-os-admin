'use client'

import { useMemo, useState } from 'react'
import { Search, Sparkles, Loader2 } from 'lucide-react'
import { getInitials, formatCurrency, formatDate } from '@/lib/utils'
import type { ReviewAnalysis } from '@/services/ai.service'

const customers = [
  { id: 'c1', name: 'Nina Park', email: 'nina@example.com', orders: 8, spent: 940, last: '2026-07-27' },
  { id: 'c2', name: 'Kate Miller', email: 'kate@example.com', orders: 12, spent: 2140, last: '2026-07-23' },
  { id: 'c3', name: 'Ben Ortiz', email: 'ben@example.com', orders: 2, spent: 128, last: '2026-07-26' },
  { id: 'c4', name: 'Amy Chen', email: 'amy@example.com', orders: 6, spent: 812, last: '2026-07-25' },
  { id: 'c5', name: 'Omar Aziz', email: 'omar@example.com', orders: 1, spent: 45, last: '2026-07-22' },
]

const demoReviews = [
  'Love the quality of the tee, fabric feels premium!',
  'Shipping took almost two weeks, way too slow.',
  'Size runs small, had to return for a larger one.',
  'Support resolved my issue in minutes, impressed.',
  'Great tote, use it every day. Quality is excellent.',
  'Ordered M but it fits like S. Please fix your size chart.',
]

export default function CustomersPage() {
  const [q, setQ] = useState('')
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(
    () => customers.filter((c) => !q || `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase())),
    [q]
  )

  const analyzeReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: demoReviews }),
      })
      const json = await res.json()
      if (res.ok) setAnalysis(json.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers..." className="input-base pl-9 w-56" />
          </div>
          <button
            onClick={analyzeReviews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-80 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Analyze Reviews
          </button>
        </div>
      </div>

      {analysis && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold">Review Intelligence</h2>
            <span className={analysis.overallSentiment === 'positive' ? 'badge-success' : analysis.overallSentiment === 'negative' ? 'badge-danger' : 'badge-warning'}>
              {analysis.overallSentiment}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.themes.map((t) => (
              <span key={t.theme} className={t.sentiment === 'positive' ? 'badge-success' : 'badge-danger'}>
                {t.theme} ({t.mentions})
              </span>
            ))}
          </div>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            {analysis.actionItems.map((a) => (
              <li key={a} className="flex gap-2"><span className="text-zinc-400">→</span>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium text-right">Orders</th>
              <th className="px-5 py-3 font-medium text-right">Lifetime value</th>
              <th className="px-5 py-3 font-medium">Last order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const [first, last] = c.name.split(' ')
              return (
                <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-semibold">
                        {getInitials(first, last ?? '')}
                      </div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">{c.orders}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatCurrency(c.spent)}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(c.last)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
