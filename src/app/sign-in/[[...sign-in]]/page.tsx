import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { env } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign in | WorkNest",
  description: "Access your WorkNest account, wishlist, checkout, and order history.",
  path: "/sign-in",
});

export default async function SignInPage() {
  if (!env.clerkEnabled) {
    return (
      <div className="container-page flex min-h-screen items-center justify-center py-16">
        <div className="surface-panel w-full max-w-2xl p-8 text-center sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Clerk configuration required</p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">Authentication is not configured.</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Add your Clerk publishable key and secret key to <code>.env</code>, then restart the app.
          </p>
        </div>
      </div>
    );
  }

  const { userId } = await auth();

  if (userId) {
    redirect(env.clerkSignInFallbackRedirectUrl);
  }

  return (
    <div className="container-page flex min-h-screen items-center justify-center py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">WorkNest account</p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">Sign in to continue shopping smarter.</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Access your account, saved addresses, wishlist, orders, and checkout state with your Clerk account.
          </p>
          <div className="mt-8 rounded-[24px] border border-border/70 bg-panel/60 p-5 text-sm text-muted">
            <p className="font-medium text-foreground">Secure sign-in</p>
            <p className="mt-3">
              Use your configured Clerk authentication methods to access your customer or admin account.
            </p>
          </div>
          <p className="mt-8 text-sm text-muted">
            Need a new account? <Link href="/sign-up" className="text-accent">Create one</Link>
          </p>
        </div>

        <div className="surface-panel flex items-center justify-center p-8 sm:p-10">
          <SignIn
            routing="path"
            path={env.clerkSignInUrl}
            signUpUrl={env.clerkSignUpUrl}
            fallbackRedirectUrl={env.clerkSignInFallbackRedirectUrl}
          />
        </div>
      </div>
    </div>
  );
}
