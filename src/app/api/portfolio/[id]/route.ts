import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import {
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/services/portfolio.service";
import type { ApiResponse } from "@/types/api.types";
import type { PortfolioItem } from "@/types/database.types";

export const PUT = withAdminAuth(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const body = await req.json();

      const item = await updatePortfolioItem(id, {
        title: body.title,
        description: body.description,
        image_url: body.imageUrl,
        category: body.category,
        is_featured: body.isFeatured,
      });

      return NextResponse.json<ApiResponse<PortfolioItem>>({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error({
        context: "PUT /api/portfolio/:id",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to update portfolio item" },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withAdminAuth(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      await deletePortfolioItem(id);

      return NextResponse.json<ApiResponse>({
        success: true,
      });
    } catch (error) {
      console.error({
        context: "DELETE /api/portfolio/:id",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to delete portfolio item" },
        { status: 500 },
      );
    }
  },
);
