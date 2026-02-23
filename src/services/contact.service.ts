import { supabaseAdmin } from "@/lib/supabase-server";
import type { ContactRequest } from "@/types/database.types";

export async function createContactRequest(payload: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_quote_request: boolean;
}): Promise<ContactRequest> {
  const { data, error } = await supabaseAdmin
    .from("contact_requests")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error({ context: "createContactRequest", error: error.message });
    throw new Error("Failed to save contact request");
  }

  return data;
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  const { data, error } = await supabaseAdmin
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error({ context: "getContactRequests", error: error.message });
    throw new Error("Failed to fetch contact requests");
  }

  return data ?? [];
}

export async function updateContactResponse(
  id: string
): Promise<ContactRequest> {
  const { data, error } = await supabaseAdmin
    .from("contact_requests")
    .update({ responded_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error({ context: "updateContactResponse", error: error.message });
    throw new Error("Failed to update contact response");
  }

  return data;
}
