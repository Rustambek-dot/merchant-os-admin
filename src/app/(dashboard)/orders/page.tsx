'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

type OrderStatus = 'new' | 'paid' | 'fulfilled' | 'delivered' | 'refunded' | 'cancelled'

interface OrderRow {
  id: string
  number: string
  customer: string
  items: number
  total: number
  status: OrderStatus
  date: string
}

const initial: OrderRow[] = [
  { id: 'o1', number: '#1042', customer: 'Nina Park', items: 2, total: 128, status: 'paid', date: '2026-07-27' },
  { id: 'o2', number: '#1041', customer: 'Ben Ortiz', items: 1, total: 64, status: 'fulfilled', date: '2026-07-26' },
  { id: 'o3', number: '#1040', customer: 'Amy Chen', items: 3, total: 212, status: 'delivered', date: '2026-07-25' },
  { id: 'o4', number: '#1039', customer: 'Tom Hale', items: 1, total: 89, status: 'refunded', date: '2026-07-24' },
  { id: 'o5', number: '#1038', customer: 'Kate Miller', items: 4, total: 316, status: 'delivered', date: '2026-07-23' },
  { id: 'o6', number: '#1037', customer: 'Omar Aziz', items: 1, total: 45, status: 'cancelled', date: '2026-07-22' },
]

const badge: Record<OrderStatus, string> = {
  new: 'badge bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300',
  paid: 'badge-primary',
  fulfilled: 'badge-warning',
  delivered: 'badge-success',
  refunded: 'badge-danger',
  cancelled: 'badge bg-zinc-100 dark:bg-zinc-800 text-zinc-500 line-through',
}

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  new: 'paid',
  paid: 'fulfilled',
  fulfilled: 'delivered',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(initial)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (status === 'all' || o.status === status) &&
          (!q || `${o.number} ${o.customer}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [orders, q, status]
  )

  const advance = (id: string) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const next = nextStatus[o.status]
        return next ? { ...o, status: next } : o
      })
    )

  const refund = (id: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'refunded' } : o)))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders..." className="input-base pl-9 w-56" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-base w-40">
            <option value="all">All statuses</option>
            {(['new', 'paid', 'fulfilled', 'delivered', 'refunded', 'cancelled'] as const).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium text-right">Items</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-3 font-mono font-medium">{o.number}</td>
                <td className="px-5 py-3">{o.customer}</td>
                <td className="px-5 py-3 text-slate-500">{formatDate(o.date)}</td>
                <td className="px-5 py-3 text-right">{o.items}</td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatCurrency(o.total)}</td>
                <td className="px-5 py-3"><span className={badge[o.status]}>{o.status}</span></td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  {nextStatus[o.status] && (
                    <button onClick={() => advance(o.id)} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-80 mr-1.5">
                      → {nextStatus[o.status]}
                    </button>
                  )}
                  {(o.status === 'paid' || o.status === 'fulfilled' || o.status === 'delivered') && (
                    <button onClick={() => refund(o.id)} className="text-xs font-medium px-2.5 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
