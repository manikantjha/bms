import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { getCategories, createCategory } from "@/services/category.service";
import { categorySchema } from "@/lib/validation-schemas";
import type { ApiResponse } from "@/types/api.types";
import type { Category } from "@/types/database.types";

export const GET = withAdminAuth(async () => {
  try {
    const categories = await getCategories();
    return NextResponse.json<ApiResponse<Category[]>>({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error({
      context: "GET /api/categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
});

export const POST = withAdminAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const validated = categorySchema.parse(body);

    const category = await createCategory(validated.name);

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
      context: "POST /api/categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create category" },
      { status: 500 },
    );
  }
});
