export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  clerkEnabled:
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.CLERK_SECRET_KEY),
  clerkSignInUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in',
  clerkSignUpUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up',
  clerkSignInFallbackRedirectUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ??
    '/account',
  clerkSignUpFallbackRedirectUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ??
    '/account',
  stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  adminEmails: (process.env.ADMIN_EMAILS ?? 'admin@gmail.com')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean),
};
