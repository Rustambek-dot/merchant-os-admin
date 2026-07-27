'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Discount {
  id: string
  code: string
  kind: 'percent' | 'fixed'
  value: number
  maxUses: number
  used: number
  active: boolean
}

const initial: Discount[] = [
  { id: 'd1', code: 'SUMMER20', kind: 'percent', value: 20, maxUses: 500, used: 342, active: true },
  { id: 'd2', code: 'WELCOME10', kind: 'fixed', value: 10, maxUses: 1000, used: 618, active: true },
  { id: 'd3', code: 'VIP30', kind: 'percent', value: 30, maxUses: 50, used: 50, active: false },
]

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', kind: 'percent' as Discount['kind'], value: 10, maxUses: 100 })

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    setDiscounts((prev) => [
      { id: crypto.randomUUID(), code: form.code.toUpperCase(), kind: form.kind, value: form.value, maxUses: form.maxUses, used: 0, active: true },
      ...prev,
    ])
    setShowForm(false)
    setForm({ code: '', kind: 'percent', value: 10, maxUses: 100 })
  }

  const toggle = (id: string) =>
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Discounts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-80"
        >
          <Plus className="w-4 h-4" /> New Code
        </button>
      </div>

      {showForm && (
        <form onSubmit={add} className="card p-5 grid grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div><label className="label">Code</label><input className="input-base font-mono uppercase" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
          <div><label className="label">Type</label>
            <select className="input-base" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as Discount['kind'] })}>
              <option value="percent">Percent %</option><option value="fixed">Fixed $</option>
            </select>
          </div>
          <div><label className="label">Value</label><input className="input-base" type="number" min={1} required value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} /></div>
          <div><label className="label">Max uses</label><input className="input-base" type="number" min={1} required value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: +e.target.value })} /></div>
          <button type="submit" className="btn-primary bg-zinc-900 hover:bg-zinc-700">Create</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {discounts.map((d) => {
          const pct = Math.round((d.used / d.maxUses) * 100)
          return (
            <div key={d.id} className={`card p-5 ${!d.active ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-lg tracking-wide">{d.code}</span>
                <span className="text-xl font-bold">
                  {d.kind === 'percent' ? `${d.value}%` : `$${d.value}`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                <div className="h-full bg-zinc-900 dark:bg-white rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <span>{d.used} / {d.maxUses} used</span>
                <span className={d.active ? 'badge-success' : 'badge bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}>
                  {d.active ? 'active' : 'disabled'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(d.id)} className="btn-secondary flex-1 text-sm py-1.5">
                  {d.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => setDiscounts((prev) => prev.filter((x) => x.id !== d.id))}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
