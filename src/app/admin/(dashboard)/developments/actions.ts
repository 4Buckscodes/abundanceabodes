"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Development } from "@/lib/types";
import {
  dbDeleteDevelopment,
  dbUpsertDevelopment,
  describeWriteError,
  isAdminDatabaseConfigured,
} from "@/lib/supabase";
import { getAllDevelopments } from "@/lib/data";
import { parseDevelopmentForm } from "@/lib/development-form";

export type SaveState = { error?: string; ok?: boolean };

export async function saveDevelopmentAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  if (!isAdminDatabaseConfigured()) {
    return {
      error:
        "Saving needs the server database key. Set SUPABASE_SECRET_KEY (Supabase dashboard → Settings → API keys) alongside NEXT_PUBLIC_SUPABASE_URL, then restart the server.",
    };
  }

  const development = parseDevelopmentForm(formData);

  if (!development.title || !development.location) {
    return { error: "Title and location are required." };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(development.slug)) {
    return {
      error: "Slug may only contain lowercase letters, numbers and hyphens.",
    };
  }

  const slugTaken = (await getAllDevelopments()).some(
    (d) => d.slug === development.slug && d.id !== development.id
  );
  if (slugTaken) {
    return { error: "That slug is already in use by another development." };
  }

  const saved = await dbUpsertDevelopment(development);
  if (!saved.ok) {
    console.error("[admin] development save failed:", saved);
    return { error: describeWriteError(saved) };
  }

  revalidatePath("/admin/developments");
  revalidatePath("/developments");
  redirect("/admin/developments?saved=1");
}

export async function deleteDevelopmentAction(formData: FormData) {
  if (!isAdminDatabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await dbDeleteDevelopment(id);
  revalidatePath("/admin/developments");
  revalidatePath("/developments");
}

export async function duplicateDevelopmentAction(formData: FormData) {
  if (!isAdminDatabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const all = await getAllDevelopments();
  const source = all.find((d) => d.id === id);
  if (!source) return;
  const copy: Development = {
    ...source,
    id: `dev-${Date.now().toString(36)}`,
    slug: `${source.slug}-copy-${Date.now().toString(36).slice(-4)}`,
    title: `${source.title} (Copy)`,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbUpsertDevelopment(copy);
  revalidatePath("/admin/developments");
}
