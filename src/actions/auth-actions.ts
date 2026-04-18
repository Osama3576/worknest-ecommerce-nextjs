"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_SESSION_COOKIE } from "@/lib/auth";

export async function demoSignInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "demo@worknest.store").toLowerCase();
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/account");
}

export async function demoSignOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  redirect("/");
}
