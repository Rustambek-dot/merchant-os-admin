'use client'

import { useState } from 'react'
import { Store, CreditCard, Truck, Users } from 'lucide-react'

const tabs = [
  { key: 'store', label: 'Store', icon: Store },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'team', label: 'Team', icon: Users },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('store')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              tab === t.key
                ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'store' && (
        <div className="card p-6 max-w-xl space-y-4">
          <div><label className="label">Store name</label><input className="input-base" defaultValue="Demo Goods Co" /></div>
          <div><label className="label">Currency</label>
            <select className="input-base"><option>USD</option><option>EUR</option><option>GBP</option></select>
          </div>
          <button className="px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-80">Save</button>
        </div>
      )}

      {tab === 'payments' && (
        <div className="card p-6 max-w-xl space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <div className="font-semibold text-sm">Stripe</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Mock mode — add STRIPE_SECRET_KEY to process real payments and refunds</div>
            </div>
            <button className="btn-secondary shrink-0">Configure</button>
          </div>
          <p className="text-xs text-slate-500">Refund buttons on the Orders page call the payment service; in mock mode refunds are simulated.</p>
        </div>
      )}

      {tab === 'shipping' && (
        <div className="card p-6 max-w-xl space-y-4">
          {[
            { name: 'Standard', price: '$4.90', eta: '5–7 days' },
            { name: 'Express', price: '$12.90', eta: '1–2 days' },
            { name: 'Free over $50', price: '$0', eta: '5–7 days' },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm">
              <span className="font-medium">{r.name}</span>
              <span className="text-slate-500">{r.eta}</span>
              <span className="font-semibold tabular-nums">{r.price}</span>
            </div>
          ))}
          <button className="btn-secondary w-full">Add Shipping Rate</button>
        </div>
      )}

      {tab === 'team' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Demo Owner', email: 'demo@example.com', role: 'owner' },
                { name: 'Mia Torres', email: 'mia@store.com', role: 'manager' },
                { name: 'Leo Park', email: 'leo@store.com', role: 'support' },
              ].map((u) => (
                <tr key={u.email} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3"><span className="badge-primary capitalize">{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
