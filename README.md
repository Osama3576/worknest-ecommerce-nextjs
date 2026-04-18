# WorkNest

WorkNest is a premium full-stack Next.js store for desk setup and productivity accessories. It includes a premium storefront, account area, admin dashboard, Prisma + PostgreSQL data layer, Clerk authentication, Stripe-ready checkout, real remote product photos, and light/dark theme support.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Clerk authentication with route protection
- Stripe checkout session + webhook-ready order updates
- Zod validation
- React Hook Form on checkout and newsletter capture

## Local setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Add your Clerk keys and optional Stripe keys to `.env`.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Generate the Prisma client and push the PostgreSQL schema:

   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. Seed demo data:

   ```bash
   npm run prisma:seed
   ```

6. Start the dev server:

   ```bash
   npm run dev
   ```

7. Open the app:

   ```text
   http://localhost:3000
   ```

## Clerk setup

Clerk keys are required for sign in, sign up, account access, wishlist protection, checkout protection, and admin protection.

Required environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/account
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/account
```

This project uses Clerk `proxy.ts` route protection for authenticated areas and server-side guards for account/admin access. Clerk recommends using route protection with Clerk middleware, and for Next.js 16 the file should be named `proxy.ts`.

## Stripe setup

If `STRIPE_SECRET_KEY` is present, checkout creates a real Stripe Checkout Session.

If Stripe keys are missing, checkout completes as a demo order and redirects directly to the success page.

For reliable order confirmation, also add `STRIPE_WEBHOOK_SECRET` and point your webhook endpoint to `/api/webhooks/stripe`.

## Main routes

### Storefront

- `/`
- `/collections`
- `/products/[slug]`
- `/cart`
- `/checkout`
- `/order-success`
- `/wishlist`
- `/account`
- `/account/addresses`
- `/account/orders`

### Auth

- `/sign-in`
- `/sign-up`

### Admin

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/categories`
- `/admin/orders`
- `/admin/customers`
- `/admin/inventory`

## Notes

- Admin access is granted to any email listed in `ADMIN_EMAILS`.
- Recently viewed products are stored in local storage.
- Product, order, address, coupon, review, wishlist, and newsletter data are persisted in PostgreSQL.
- Product images are seeded from remote product-photo URLs to make the storefront feel more realistic.
