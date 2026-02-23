import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { getBookingById } from "@/services/booking.service";
import type { ApiResponse } from "@/types/api.types";

export const GET = withAdminAuth(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const booking = await getBookingById(id);

      if (!booking) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Booking not found" },
          { status: 404 },
        );
      }

      return NextResponse.json<ApiResponse<typeof booking>>({
        success: true,
        data: booking,
      });
    } catch (error) {
      console.error({
        context: "GET /api/bookings/:id",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to fetch booking" },
        { status: 500 },
      );
    }
  },
);
