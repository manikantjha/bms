import type { Booking } from "./database.types";

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalServices: number;
  totalPortfolioItems: number;
  totalContactRequests: number;
  recentBookings: Booking[];
}
