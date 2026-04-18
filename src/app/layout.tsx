import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import { AppAuthProvider } from '@/components/providers/app-auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { env } from '@/lib/env';
import { siteConfig } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { Toaster } from 'sonner';

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} | Premium desk setup store`,
  description: siteConfig.description,
  path: '/',
});

const themeBootstrap = `
(function() {
  try {
    var storageKey = 'worknest-theme';
    var savedTheme = window.localStorage.getItem(storageKey);
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script
          id="worknest-theme-bootstrap"
          strategy="beforeInteractive"
        >
          {themeBootstrap}
        </Script>
        <ThemeProvider>
          <AppAuthProvider
            clerkEnabled={env.clerkEnabled}
            signInUrl={env.clerkSignInUrl}
            signUpUrl={env.clerkSignUpUrl}
          >
            {children}
          </AppAuthProvider>
        </ThemeProvider>
        <Toaster position="top-right" richColors theme="system" />
      </body>
    </html>
  );
}
