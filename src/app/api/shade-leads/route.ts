import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { z } from "zod";

const leadSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  image_url: z.string().url(),
  undertone: z.enum(["warm", "cool", "neutral"]),
  depth: z.enum(["fair", "light", "medium", "tan", "deep"]),
  avg_rgb: z.object({
    r: z.number(),
    g: z.number(),
    b: z.number(),
  }),
  recommended_shades: z.array(z.string()),
  interested_in_makeup: z.boolean(),
  selected_service: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input payload via Zod
    const validatedData = leadSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validatedData.error.format(),
        },
        { status: 400 },
      );
    }

    const lead = validatedData.data;

    // Use service_role super admin to bypass RLS if strictly needed,
    // though the RLS policy allows public insert. Let's use it for extra consistency.
    const { data, error } = await supabaseAdmin
      .from("foundation_leads")
      .insert({
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone || null,
        image_url: lead.image_url,
        undertone: lead.undertone,
        depth: lead.depth,
        avg_rgb: lead.avg_rgb,
        recommended_shades: lead.recommended_shades,
        interested_in_makeup: lead.interested_in_makeup,
        selected_service: lead.selected_service || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to insert foundation lead:", error);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Foundation Lead API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
