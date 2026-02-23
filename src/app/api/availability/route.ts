import { NextRequest, NextResponse } from "next/server";
import { checkSlotAvailability } from "@/utils/availability-checker";
import type { ApiResponse } from "@/types/api.types";
import type { SlotAvailability } from "@/types/booking.types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!date || !time) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "date and time query params are required" },
        { status: 400 }
      );
    }

    const available = await checkSlotAvailability(date, time);

    return NextResponse.json<ApiResponse<SlotAvailability>>({
      success: true,
      data: { date, time, available },
    });
  } catch (error) {
    console.error({
      context: "GET /api/availability",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
