import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { getContactRequests } from "@/services/contact.service";
import type { ApiResponse } from "@/types/api.types";
import type { ContactRequest } from "@/types/database.types";

export const GET = withAdminAuth(async () => {
  try {
    const contacts = await getContactRequests();
    return NextResponse.json<ApiResponse<ContactRequest[]>>({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error({
      context: "GET /api/contacts",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch contact requests" },
      { status: 500 },
    );
  }
});
