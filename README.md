# Merchant OS — E-commerce Admin Platform

Minimal, fast admin for online stores: orders pipeline with refunds, products with per-variant stock and pricing, customers with LTV, discount codes with usage stats, and AI tools (product copy generation, review intelligence).

## Tech Stack
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + RLS), OpenAI API (mock-first), Stripe (mock-first), Recharts, Zod.

## Features
- 🛒 Orders: status pipeline (new → paid → fulfilled → delivered), one-click refunds, filters
- 📦 Products with **variants**: per-SKU price and stock, low/out-of-stock highlighting
- ✨ **AI product copy**: generate descriptions from title + features, inline in the product card
- 🧠 **Review intelligence**: AI clusters reviews into themes with sentiment and action items
- 👥 Customers with lifetime value and order history
- 🎟 Discount codes: percent/fixed, usage limits, live usage bars
- 📊 Dashboard: revenue, AOV, conversion, recent orders
- 🔐 Roles owner/manager/support with RLS

## Quick Start
```bash
npm install
cp .env.example .env.local
# Run sql/schema.sql in Supabase SQL editor
npm run db:seed
npm run dev
```
AI and payment features run in mock mode without keys.

## Demo Credentials
`demo@example.com` / `Demo123!` (create in Supabase Auth dashboard, then seed).

## Design
Monochrome zinc/black identity inspired by modern developer tools — color is reserved for order statuses only.

## Deployment
Supabase (schema + seed) → Vercel (env vars) → deploy. See [DEPLOYMENT.md](DEPLOYMENT.md).

## License
MIT

## Screenshots

### Landing
![Landing](screenshots/landing.png)

### Orders
![Orders](screenshots/orders.png)

### Products
![Products](screenshots/products.png)

### Discounts
![Discounts](screenshots/discounts.png)

