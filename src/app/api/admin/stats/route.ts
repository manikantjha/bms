import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { getAdminStats } from "@/services/stats.service";
import type { ApiResponse } from "@/types/api.types";
import type { AdminStats } from "@/types/admin.types";

export const GET = withAdminAuth(async () => {
  try {
    const stats = await getAdminStats();
    return NextResponse.json<ApiResponse<AdminStats>>({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error({
      context: "GET /api/admin/stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
});
