import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { env } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign up | WorkNest",
  description: "Create a WorkNest account to save addresses, wishlist items, and orders.",
  path: "/sign-up",
});

export default async function SignUpPage() {
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
    redirect(env.clerkSignUpFallbackRedirectUrl);
  }

  return (
    <div className="container-page flex min-h-screen items-center justify-center py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Create account</p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">Save your favorite setup upgrades.</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Wishlist persistence, account-level addresses, and order history all become available after sign up.
          </p>
          <div className="mt-8 rounded-[24px] border border-border/70 bg-panel/60 p-5 text-sm text-muted">
            <p className="font-medium text-foreground">Clerk-powered access</p>
            <p className="mt-3">
              Create your account using your enabled Clerk authentication methods and continue directly to your account area.
            </p>
          </div>
          <p className="mt-8 text-sm text-muted">
            Already have an account? <Link href="/sign-in" className="text-accent">Sign in</Link>
          </p>
        </div>

        <div className="surface-panel flex items-center justify-center p-8 sm:p-10">
          <SignUp
            routing="path"
            path={env.clerkSignUpUrl}
            signInUrl={env.clerkSignInUrl}
            fallbackRedirectUrl={env.clerkSignUpFallbackRedirectUrl}
          />
        </div>
      </div>
    </div>
  );
}
