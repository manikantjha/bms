import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { updateContactResponse } from "@/services/contact.service";
import type { ApiResponse } from "@/types/api.types";
import type { ContactRequest } from "@/types/database.types";

export const PUT = withAdminAuth(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const contact = await updateContactResponse(id);

      return NextResponse.json<ApiResponse<ContactRequest>>({
        success: true,
        data: contact,
      });
    } catch (error) {
      console.error({
        context: "PUT /api/contacts/:id",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to update contact response" },
        { status: 500 },
      );
    }
  },
);
