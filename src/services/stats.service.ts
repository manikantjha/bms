import { supabaseAdmin } from "@/lib/supabase-server";
import type { Booking } from "@/types/database.types";

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalServices: number;
  totalPortfolioItems: number;
  totalContactRequests: number;
  recentBookings: Booking[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalBookingsResult,
    pendingBookingsResult,
    confirmedBookingsResult,
    totalServicesResult,
    totalPortfolioItemsResult,
    totalContactRequestsResult,
    recentBookingsResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed"),
    supabaseAdmin
      .from("services")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("portfolio_items")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("contact_requests")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const error =
    totalBookingsResult.error ||
    pendingBookingsResult.error ||
    confirmedBookingsResult.error ||
    totalServicesResult.error ||
    totalPortfolioItemsResult.error ||
    totalContactRequestsResult.error ||
    recentBookingsResult.error;

  if (error) {
    console.error({ context: "getAdminStats", error: error.message });
    throw new Error("Failed to fetch admin stats");
  }

  return {
    totalBookings: totalBookingsResult.count ?? 0,
    pendingBookings: pendingBookingsResult.count ?? 0,
    confirmedBookings: confirmedBookingsResult.count ?? 0,
    totalServices: totalServicesResult.count ?? 0,
    totalPortfolioItems: totalPortfolioItemsResult.count ?? 0,
    totalContactRequests: totalContactRequestsResult.count ?? 0,
    recentBookings: recentBookingsResult.data ?? [],
  };
}
