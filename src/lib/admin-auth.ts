import { supabaseAdmin } from "@/lib/supabase-server";
import { UnauthorizedError } from "@/lib/errors";

export async function verifyAdminToken(
  authHeader: string | null
): Promise<void> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function withAdminAuth<T extends unknown[]>(
  handler: (req: Request, ...args: T) => Promise<Response>
): (req: Request, ...args: T) => Promise<Response> {
  return async (req: Request, ...args: T) => {
    try {
      await verifyAdminToken(req.headers.get("authorization"));
      return handler(req, ...args);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return Response.json(
          { success: false, error: error.message },
          { status: 401 }
        );
      }
      throw error;
    }
  };
}
