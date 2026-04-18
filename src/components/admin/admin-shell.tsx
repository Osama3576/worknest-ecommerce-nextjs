import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-[1700px] gap-8 px-4 py-8 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="space-y-2 rounded-[32px] border border-border/70 bg-sidebar p-5">
          <Link
            href="/"
            className="block rounded-2xl bg-panel/65 px-4 py-4 text-foreground"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-muted">
              WorkNest
            </p>
            <p className="mt-2 text-xl font-semibold">Admin panel</p>
          </Link>
          <nav className="space-y-2 pt-4">
            {siteConfig.adminNav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm text-foreground/78 transition hover:bg-panel/70 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          <header className="rounded-[32px] border border-border/70 bg-card/90 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-muted">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              {description}
            </p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
