import { NextResponse } from "next/server";
import {
  getPortfolioItems,
  createPortfolioItem,
} from "@/services/portfolio.service";
import { withAdminAuth } from "@/lib/admin-auth";
import { portfolioSchema } from "@/lib/validation-schemas";
import type { ApiResponse } from "@/types/api.types";
import type { PortfolioItem } from "@/types/database.types";

export async function GET() {
  try {
    const items = await getPortfolioItems();
    return NextResponse.json<ApiResponse<PortfolioItem[]>>({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error({
      context: "GET /api/portfolio",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch portfolio" },
      { status: 500 },
    );
  }
}

export const POST = withAdminAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const validated = portfolioSchema.parse(body);

    const item = await createPortfolioItem({
      title: validated.title,
      description: validated.description,
      image_url: validated.imageUrl,
      category: validated.category,
      is_featured: validated.isFeatured,
    });

    return NextResponse.json<ApiResponse<PortfolioItem>>({
      success: true,
      data: item,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid portfolio data" },
        { status: 400 },
      );
    }

    console.error({
      context: "POST /api/portfolio",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create portfolio item" },
      { status: 500 },
    );
  }
});
