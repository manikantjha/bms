import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { bookingStatusSchema } from "@/lib/validation-schemas";
import { updateBookingStatus } from "@/services/booking.service";
import type { ApiResponse } from "@/types/api.types";
import type { Booking } from "@/types/database.types";

export const PUT = withAdminAuth(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const validated = bookingStatusSchema.parse(body);

      const booking = await updateBookingStatus(id, validated.status);

      return NextResponse.json<ApiResponse<Booking>>({
        success: true,
        data: booking,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Invalid status value" },
          { status: 400 },
        );
      }

      console.error({
        context: "PUT /api/bookings/:id/status",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to update booking status" },
        { status: 500 },
      );
    }
  },
);
