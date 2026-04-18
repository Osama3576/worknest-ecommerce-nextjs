import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-screen items-center justify-center py-16">
      <div className="surface-panel max-w-2xl p-10 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">The page you requested could not be found.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
          The route may have moved, the product might be unavailable, or the URL could be incorrect.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">
            Back to home
          </Link>
          <Link href="/collections" className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground/80 transition hover:bg-panel/80">
            Browse store
          </Link>
        </div>
      </div>
    </div>
  );
}
