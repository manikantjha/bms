import { NextResponse } from "next/server";
import { updateService } from "@/services/service.service";
import type { ApiResponse } from "@/types/api.types";
import type { Service } from "@/types/database.types";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const service = await updateService(id, {
      name: body.name,
      description: body.description,
      price: body.price,
      duration_minutes: body.durationMinutes,
      category_id: body.categoryId,
      is_active: body.isActive,
    });

    return NextResponse.json<ApiResponse<Service>>({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error({
      context: "PUT /api/services/:id",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await updateService(id, { is_active: false });

    return NextResponse.json<ApiResponse>({
      success: true,
    });
  } catch (error) {
    console.error({
      context: "DELETE /api/services/:id",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to disable service" },
      { status: 500 }
    );
  }
}
