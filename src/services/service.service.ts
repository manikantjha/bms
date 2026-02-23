import { supabaseAdmin } from "@/lib/supabase-server";
import type { Service, Category } from "@/types/database.types";

export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error({ context: "getActiveServices", error: error.message });
    throw new Error("Failed to fetch services");
  }

  return data ?? [];
}

export async function getServicesByCategory(): Promise<
  { category: Category; services: Service[] }[]
> {
  const { data: categories, error: catError } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("name");

  if (catError) {
    console.error({
      context: "getServicesByCategory",
      error: catError.message,
    });
    throw new Error("Failed to fetch categories");
  }

  const { data: services, error: svcError } = await supabaseAdmin
    .from("services")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("name");

  if (svcError) {
    console.error({
      context: "getServicesByCategory",
      error: svcError.message,
    });
    throw new Error("Failed to fetch services");
  }

  return (categories ?? []).map((cat) => ({
    category: cat,
    services: (services ?? []).filter((s) => s.category_id === cat.id),
  }));
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error({ context: "getServiceById", error: error.message });
    throw new Error("Failed to fetch service");
  }

  return data;
}

export async function createService(payload: {
  name: string;
  description: string;
  price: number;
  duration_minutes?: number;
  category_id?: string;
  is_active?: boolean;
}): Promise<Service> {
  const { data, error } = await supabaseAdmin
    .from("services")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error({ context: "createService", error: error.message });
    throw new Error("Failed to create service");
  }

  return data;
}

export async function updateService(
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    category_id: string;
    is_active: boolean;
  }>
): Promise<Service> {
  const { data, error } = await supabaseAdmin
    .from("services")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error({ context: "updateService", error: error.message });
    throw new Error("Failed to update service");
  }

  return data;
}
