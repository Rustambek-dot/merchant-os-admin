'use client'

import { DollarSign, ShoppingCart, TrendingUp, Percent } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const sales = [
  { day: '21', revenue: 1840 }, { day: '22', revenue: 2210 }, { day: '23', revenue: 1650 },
  { day: '24', revenue: 2890 }, { day: '25', revenue: 3120 }, { day: '26', revenue: 2740 }, { day: '27', revenue: 1980 },
]

const recentOrders = [
  { number: '#1042', customer: 'Nina Park', total: 128, status: 'paid' },
  { number: '#1041', customer: 'Ben Ortiz', total: 64, status: 'fulfilled' },
  { number: '#1040', customer: 'Amy Chen', total: 212, status: 'delivered' },
  { number: '#1039', customer: 'Tom Hale', total: 89, status: 'refunded' },
]

const statusBadge: Record<string, string> = {
  paid: 'badge-primary',
  fulfilled: 'badge-warning',
  delivered: 'badge-success',
  refunded: 'badge-danger',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (7d)', value: formatCurrency(16430), icon: DollarSign },
          { label: 'Orders (7d)', value: '142', icon: ShoppingCart },
          { label: 'Avg order value', value: formatCurrency(115.7), icon: TrendingUp },
          { label: 'Conversion', value: '2.8%', icon: Percent },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">{s.label}</span>
              <s.icon className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold mb-4">Revenue — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={sales}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415530" />
              <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#18181b" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o.number} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-mono font-medium">{o.number}</span>
                  <span className="text-slate-500 ml-2">{o.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={statusBadge[o.status]}>{o.status}</span>
                  <span className="font-semibold tabular-nums w-16 text-right">{formatCurrency(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
