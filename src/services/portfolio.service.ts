import { supabaseAdmin } from "@/lib/supabase-server";
import type { PortfolioItem } from "@/types/database.types";

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error({ context: "getPortfolioItems", error: error.message });
    throw new Error("Failed to fetch portfolio items");
  }

  return data ?? [];
}

export async function getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error({
      context: "getFeaturedPortfolioItems",
      error: error.message,
    });
    throw new Error("Failed to fetch featured portfolio");
  }

  return data ?? [];
}

export async function createPortfolioItem(payload: {
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  is_featured?: boolean;
}): Promise<PortfolioItem> {
  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error({ context: "createPortfolioItem", error: error.message });
    throw new Error("Failed to create portfolio item");
  }

  return data;
}

export async function updatePortfolioItem(
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    image_url: string;
    category: string;
    is_featured: boolean;
  }>
): Promise<PortfolioItem> {
  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error({ context: "updatePortfolioItem", error: error.message });
    throw new Error("Failed to update portfolio item");
  }

  return data;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error({ context: "deletePortfolioItem", error: error.message });
    throw new Error("Failed to delete portfolio item");
  }
}
