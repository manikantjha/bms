import { supabaseAdmin } from "@/lib/supabase-server";
import type { Category } from "@/types/database.types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error({ context: "getCategories", error: error.message });
    throw new Error("Failed to fetch categories");
  }

  return data ?? [];
}

export async function createCategory(name: string): Promise<Category> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ name })
    .select()
    .single();

  if (error) {
    console.error({ context: "createCategory", error: error.message });
    throw new Error("Failed to create category");
  }

  return data;
}

export async function updateCategory(
  id: string,
  name: string
): Promise<Category> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error({ context: "updateCategory", error: error.message });
    throw new Error("Failed to update category");
  }

  return data;
}
