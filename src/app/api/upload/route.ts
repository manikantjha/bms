import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { ApiResponse } from "@/types/api.types";

export const POST = withAdminAuth(async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}-${sanitizedName}`;

    const { data, error } = await supabaseAdmin.storage
      .from("portfolio")
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      console.error({
        context: "POST /api/upload",
        error: error.message,
      });

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to upload file" },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("portfolio").getPublicUrl(data.path);

    return NextResponse.json<ApiResponse<{ url: string }>>({
      success: true,
      data: { url: publicUrl },
    });
  } catch (error) {
    console.error({
      context: "POST /api/upload",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to upload file" },
      { status: 500 },
    );
  }
});
