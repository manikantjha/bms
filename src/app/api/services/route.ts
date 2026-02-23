import { NextResponse } from "next/server";
import { getActiveServices, createService } from "@/services/service.service";
import { serviceSchema } from "@/lib/validation-schemas";
import type { ApiResponse } from "@/types/api.types";
import type { Service } from "@/types/database.types";

export async function GET() {
  try {
    const services = await getActiveServices();
    return NextResponse.json<ApiResponse<Service[]>>({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error({
      context: "GET /api/services",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = serviceSchema.parse(body);

    const service = await createService({
      name: validated.name,
      description: validated.description,
      price: validated.price,
      duration_minutes: validated.durationMinutes,
      category_id: validated.categoryId,
      is_active: validated.isActive,
    });

    return NextResponse.json<ApiResponse<Service>>({
      success: true,
      data: service,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid service data" },
        { status: 400 }
      );
    }

    console.error({
      context: "POST /api/services",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}
