import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation-schemas";
import { createBooking } from "@/services/booking.service";
import { BookingConflictError } from "@/lib/errors";
import type { ApiResponse } from "@/types/api.types";
import type { BookingResult } from "@/types/booking.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = bookingSchema.parse(body);
    const result = await createBooking(validated);

    return NextResponse.json<ApiResponse<BookingResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof BookingConflictError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid booking data" },
        { status: 400 }
      );
    }

    console.error({
      context: "POST /api/booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
