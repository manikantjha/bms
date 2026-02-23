import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation-schemas";
import { createContactRequest } from "@/services/contact.service";
import type { ApiResponse } from "@/types/api.types";
import type { ContactRequest } from "@/types/database.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    const result = await createContactRequest({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      message: validated.message,
      is_quote_request: validated.isQuoteRequest,
    });

    return NextResponse.json<ApiResponse<ContactRequest>>({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid form data" },
        { status: 400 }
      );
    }

    console.error({
      context: "POST /api/contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to submit contact request" },
      { status: 500 }
    );
  }
}
