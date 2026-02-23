import { NextResponse } from "next/server";
import { getBookings } from "@/services/booking.service";
import type { ApiResponse } from "@/types/api.types";
import type { Booking } from "@/types/database.types";

export async function GET() {
  try {
    const bookings = await getBookings();
    return NextResponse.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error({
      context: "GET /api/bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
