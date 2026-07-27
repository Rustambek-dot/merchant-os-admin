# Merchant OS — E-commerce Admin Platform — Product Specification

## Обзор
**Merchant OS** — админ-платформа интернет-магазина: товары с вариантами, заказы со статусами и возвратами, клиенты, скидки/промокоды, аналитика продаж, AI-генерация описаний и анализ отзывов.

## Целевая аудитория
D2C-бренды и магазины на headless-стеке (100–10 000 заказов/мес), команды 2–20 человек.

## Роли
- **Owner** — всё
- **Manager** — товары, заказы, скидки
- **Support** — заказы и клиенты (только чтение товаров)

## Ключевые user flows
1. **Заказ**: новый → paid → fulfilled → delivered; возврат → refunded (Stripe refund в mock mode)
2. **Товар**: создать → варианты (размер/цвет) с ценой и остатком → AI-описание одной кнопкой
3. **Промокод**: код + тип (процент/фикс) + лимиты → применение отслеживается
4. **Отзывы**: AI-анализ пачки отзывов → темы, тональность, продуктовые инсайты

## Страницы
- `/`, `/auth/*`
- `/dashboard` — выручка, заказы, AOV, конверсия; график продаж; последние заказы
- `/orders` — таблица с фильтрами по статусу/оплате, детали, смена статуса, возвраты
- `/products` — каталог с вариантами, остатками, AI-описания
- `/customers` — база с LTV и историей заказов
- `/discounts` — промокоды CRUD с лимитами и статистикой применений
- `/settings` — магазин, платежи (Stripe), доставка, команда

## База данных
products (id, store_id, title, description, category, status)
variants (id, product_id, sku, option_name, price, stock)
orders (id, store_id, number, customer_id, status, payment_status, total, created_at)
order_items (order_id, variant_id, qty, price)
customers (id, store_id, name, email, orders_count, total_spent)
discounts (id, store_id, code, kind: percent|fixed, value, max_uses, used_count, active)
+ RLS, индексы orders(store_id, created_at)

## Дизайн-система (отлична от 1–6)
- **Монохром**: чёрный primary (#171717), zinc-серые, минимализм в духе Vercel
- Тонкие бордеры, без цветных заливок; цвет только в статусах
- Табличная плотность, tabular-nums для сумм
