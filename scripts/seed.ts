/**
 * Seed script — store, users, products with variants, customers, orders, discounts.
 * Usage: npm run db:seed  (requires SUPABASE_SERVICE_ROLE_KEY)
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const db = createClient(url, key)

async function seed() {
  console.log('Seeding Merchant OS...')

  const { data: store, error: sErr } = await db
    .from('stores').insert({ name: 'Demo Goods Co', currency: 'USD' }).select().single()
  if (sErr) throw sErr

  const { error: uErr } = await db.from('users')
    .insert({ email: 'demo@example.com', full_name: 'Demo Owner', role: 'owner', store_id: store.id })
  if (uErr) throw uErr

  const { data: products, error: pErr } = await db.from('products').insert([
    { store_id: store.id, title: 'Everyday Tee', description: 'Soft organic cotton tee.', category: 'Apparel', status: 'active' },
    { store_id: store.id, title: 'Canvas Tote', description: 'Heavy-duty tote with inner pocket.', category: 'Accessories', status: 'active' },
    { store_id: store.id, title: 'Trail Hoodie', description: '', category: 'Apparel', status: 'draft' },
  ]).select()
  if (pErr) throw pErr

  const { data: variants, error: vErr } = await db.from('variants').insert([
    { product_id: products[0].id, sku: 'TEE-BLK-S', option_name: 'Black / S', price: 24, stock: 42 },
    { product_id: products[0].id, sku: 'TEE-BLK-M', option_name: 'Black / M', price: 24, stock: 4 },
    { product_id: products[0].id, sku: 'TEE-WHT-M', option_name: 'White / M', price: 24, stock: 31 },
    { product_id: products[1].id, sku: 'TOTE-NAT', option_name: 'Natural', price: 32, stock: 58 },
    { product_id: products[1].id, sku: 'TOTE-BLK', option_name: 'Black', price: 32, stock: 12 },
    { product_id: products[2].id, sku: 'HOOD-GRY-L', option_name: 'Grey / L', price: 68, stock: 0 },
  ]).select()
  if (vErr) throw vErr

  const { data: customers, error: cErr } = await db.from('customers').insert([
    { store_id: store.id, name: 'Nina Park', email: 'nina@example.com', orders_count: 8, total_spent: 940 },
    { store_id: store.id, name: 'Kate Miller', email: 'kate@example.com', orders_count: 12, total_spent: 2140 },
    { store_id: store.id, name: 'Ben Ortiz', email: 'ben@example.com', orders_count: 2, total_spent: 128 },
  ]).select()
  if (cErr) throw cErr

  const { data: orders, error: oErr } = await db.from('orders').insert([
    { store_id: store.id, customer_id: customers[0].id, status: 'paid', payment_status: 'paid', total: 128 },
    { store_id: store.id, customer_id: customers[2].id, status: 'fulfilled', payment_status: 'paid', total: 64 },
    { store_id: store.id, customer_id: customers[1].id, status: 'delivered', payment_status: 'paid', total: 212 },
  ]).select()
  if (oErr) throw oErr

  const { error: oiErr } = await db.from('order_items').insert([
    { order_id: orders[0].id, variant_id: variants[0].id, qty: 2, price: 24 },
    { order_id: orders[0].id, variant_id: variants[3].id, qty: 1, price: 32 },
    { order_id: orders[1].id, variant_id: variants[4].id, qty: 2, price: 32 },
    { order_id: orders[2].id, variant_id: variants[2].id, qty: 3, price: 24 },
  ])
  if (oiErr) throw oiErr

  const { error: dErr } = await db.from('discounts').insert([
    { store_id: store.id, code: 'SUMMER20', kind: 'percent', value: 20, max_uses: 500, used_count: 342 },
    { store_id: store.id, code: 'WELCOME10', kind: 'fixed', value: 10, max_uses: 1000, used_count: 618 },
  ])
  if (dErr) throw dErr

  console.log('Seed complete: 1 store, 3 products, 6 variants, 3 customers, 3 orders, 2 discounts')
  console.log('Demo login: demo@example.com / Demo123! (create in Supabase Auth dashboard)')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
