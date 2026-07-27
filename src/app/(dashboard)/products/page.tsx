'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Sparkles, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Variant {
  sku: string
  option: string
  price: number
  stock: number
}

interface ProductRow {
  id: string
  title: string
  category: string
  status: 'active' | 'draft'
  description: string
  variants: Variant[]
}

const initial: ProductRow[] = [
  {
    id: 'p1', title: 'Everyday Tee', category: 'Apparel', status: 'active',
    description: 'Soft organic cotton tee for daily wear.',
    variants: [
      { sku: 'TEE-BLK-S', option: 'Black / S', price: 24, stock: 42 },
      { sku: 'TEE-BLK-M', option: 'Black / M', price: 24, stock: 4 },
      { sku: 'TEE-WHT-M', option: 'White / M', price: 24, stock: 31 },
    ],
  },
  {
    id: 'p2', title: 'Canvas Tote', category: 'Accessories', status: 'active',
    description: 'Heavy-duty tote with inner pocket.',
    variants: [
      { sku: 'TOTE-NAT', option: 'Natural', price: 32, stock: 58 },
      { sku: 'TOTE-BLK', option: 'Black', price: 32, stock: 12 },
    ],
  },
  {
    id: 'p3', title: 'Trail Hoodie', category: 'Apparel', status: 'draft',
    description: '',
    variants: [
      { sku: 'HOOD-GRY-L', option: 'Grey / L', price: 68, stock: 0 },
    ],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>('p1')
  const [aiLoading, setAiLoading] = useState<string | null>(null)

  const generateDescription = async (p: ProductRow) => {
    setAiLoading(p.id)
    try {
      const res = await fetch('/api/ai/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: p.title,
          features: p.variants.map((v) => v.option).join(', ') + `, category ${p.category}`,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setProducts((prev) =>
          prev.map((x) => (x.id === p.id ? { ...x, description: json.data.description } : x))
        )
      }
    } finally {
      setAiLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-80 transition-opacity">
          Add Product
        </button>
      </div>

      <div className="space-y-3">
        {products.map((p) => {
          const isOpen = expanded === p.id
          const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
          return (
            <div key={p.id} className="card overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : p.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold">{p.title}</span>
                  <span className="text-sm text-slate-500 ml-3">{p.category}</span>
                </div>
                <span className="text-sm text-slate-500">{p.variants.length} variants · {totalStock} in stock</span>
                <span className={p.status === 'active' ? 'badge-success' : 'badge bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}>
                  {p.status}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 space-y-4">
                  {/* Description + AI */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Description</span>
                      <button
                        onClick={() => generateDescription(p)}
                        disabled={aiLoading !== null}
                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-80 disabled:opacity-50"
                      >
                        {aiLoading === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        Generate with AI
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 rounded-lg p-3 min-h-12">
                      {p.description || 'No description yet — generate one with AI.'}
                    </p>
                  </div>

                  {/* Variants */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                        <th className="py-2 font-medium">SKU</th>
                        <th className="py-2 font-medium">Variant</th>
                        <th className="py-2 font-medium text-right">Price</th>
                        <th className="py-2 font-medium text-right">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.variants.map((v) => (
                        <tr key={v.sku} className="border-b border-slate-50 dark:border-slate-800/50">
                          <td className="py-2 font-mono text-xs">{v.sku}</td>
                          <td className="py-2">{v.option}</td>
                          <td className="py-2 text-right tabular-nums">{formatCurrency(v.price)}</td>
                          <td className={`py-2 text-right tabular-nums ${v.stock === 0 ? 'text-danger font-semibold' : v.stock < 10 ? 'text-warning font-semibold' : ''}`}>
                            {v.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
