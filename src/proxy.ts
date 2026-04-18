import { NextResponse } from 'next/server';
import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';

const clerkEnabled =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

const isProtectedRoute = createRouteMatcher([
  '/account(.*)',
  '/wishlist(.*)',
  '/checkout(.*)',
  '/admin(.*)',
]);

const proxy = clerkEnabled
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export default proxy;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
