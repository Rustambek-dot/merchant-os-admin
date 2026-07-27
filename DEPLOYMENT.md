# Deployment — Merchant OS

1. **Supabase**: проект → SQL Editor → `sql/schema.sql` → Auth → `demo@example.com` / `Demo123!`
2. **Seed**: `.env.local` → `npm run db:seed`
3. **Vercel**: import → env vars (Supabase + опц. `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`) → Deploy
4. **Проверка**: `/orders` (кнопки смены статуса и Refund работают), `/products` (Generate with AI выдаёт описание), `/customers` (Analyze Reviews кластеризует темы)
