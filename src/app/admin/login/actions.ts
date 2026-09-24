"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminAuthConfigured,
  verifyAdminPassword,
} from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isAdminAuthConfigured()) {
    return {
      error:
        "Admin access isn't configured yet. Set ADMIN_PASSWORD (and optionally ADMIN_SESSION_SECRET) in the environment, then restart the server.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  // Only allow relative paths to prevent open redirects.
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  if (!(await verifyAdminPassword(password))) {
    return { error: "Incorrect password. Please try again." };
  }

  const token = await createSessionToken();
  if (!token) return { error: "Could not create a session. Try again." };

  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(safeNext);
}
