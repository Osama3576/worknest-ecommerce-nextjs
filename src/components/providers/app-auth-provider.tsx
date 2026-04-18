"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AppAuthProvider({
  children,
  clerkEnabled,
  signInUrl,
  signUpUrl,
}: {
  children: React.ReactNode;
  clerkEnabled: boolean;
  signInUrl: string;
  signUpUrl: string;
}) {
  if (!clerkEnabled) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider signInUrl={signInUrl} signUpUrl={signUpUrl} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
}
