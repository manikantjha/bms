import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { updateCategory } from "@/services/category.service";
import { categorySchema } from "@/lib/validation-schemas";
import type { ApiResponse } from "@/types/api.types";
import type { Category } from "@/types/database.types";

export const PUT = withAdminAuth(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const validated = categorySchema.parse(body);

      const category = await updateCategory(id, validated.name);

      return NextResponse.json<ApiResponse<Category>>({
        success: true,
        data: category,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Invalid category data" },
          { status: 400 },
        );
      }

      console.error({
        context: "PUT /api/categories/:id",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to update category" },
        { status: 500 },
      );
    }
  },
);
