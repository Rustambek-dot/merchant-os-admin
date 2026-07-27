# Case Study: Merchant OS — E-commerce Admin

## Краткое описание
Админ-платформа магазина: пайплайн заказов с возвратами, товары с вариантами и по-SKU остатками, клиенты с LTV, промокоды со статистикой, AI-генерация описаний и анализ отзывов.

## Проблема клиента
D2C-бренд управлял магазином через связку таблиц и переписок: статусы заказов терялись, описания товаров писались часами, отзывы никто не читал системно.

## Решение
Единая быстрая админка: заказ проходит статусы одной кнопкой, refund в два клика; AI пишет описание из буллетов за 5 секунд; AI кластеризует отзывы в темы с action items.

## Моя роль
Full-stack: модель данных (товары-варианты-заказы-позиции), UI, AI-слой, деплой.

## Технологии
Next.js 15, React 19, TypeScript, Tailwind, Supabase, OpenAI + Stripe (оба mock-first), Recharts.

## Архитектурные решения
- **Вариантная модель**: products → variants с UNIQUE(product_id, sku); цена и остаток на уровне варианта.
- **Пайплайн статусов** как конечный автомат (new → paid → fulfilled → delivered) — недопустимые переходы невозможны в UI.
- **Ролевой RLS**: support читает заказы, но не редактирует товары.
- **Монохромная дизайн-система** — визуально выделяется среди типовых цветастых админок.

## Результаты (ожидаемые)
- Описание товара: часы → секунды + правка
- Возврат: 2 клика вместо ручного процесса
- Отзывы превращаются в план действий (size chart → −returns)

## Тексты

**GitHub About:** E-commerce admin — order pipeline with refunds, product variants with per-SKU stock, discount codes, AI product copy & review intelligence. Next.js 15 + Supabase.
**Topics:** `nextjs` `typescript` `supabase` `ecommerce` `admin-dashboard` `openai` `stripe` `saas`

**LinkedIn:** 🛍 Построил админ-платформу для e-commerce: пайплайн заказов как конечный автомат, вариантная модель товаров (цена/остаток на уровне SKU), AI-генерация описаний и кластеризация отзывов в темы с action items. Монохромная дизайн-система в духе Vercel. Next.js 15 + Supabase.

**Upwork:** I built a complete e-commerce back office (Next.js 15, Supabase): order management with status pipeline and refunds, products with variants and per-SKU inventory, customers with LTV, discount codes, plus AI tools for product descriptions and review analysis. Clean, fast, monochrome UI.

**Резюме:** Merchant OS (Next.js 15, Supabase, OpenAI) — e-commerce админка с вариантной моделью товаров, пайплайном заказов и AI-инструментами.
