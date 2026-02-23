import { supabaseAdmin } from "@/lib/supabase-server";
import { BookingConflictError } from "@/lib/errors";

const MAX_BOOKINGS_PER_SLOT = 1;

export async function checkSlotAvailability(
  eventDate: string,
  eventTime: string
): Promise<boolean> {
  const { count, error } = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("event_date", eventDate)
    .eq("event_time", eventTime)
    .neq("status", "cancelled");

  if (error) {
    console.error({
      context: "checkSlotAvailability",
      error: error.message,
    });
    throw new Error("Failed to check availability");
  }

  return (count ?? 0) < MAX_BOOKINGS_PER_SLOT;
}

export async function validateSlotOrThrow(
  eventDate: string,
  eventTime: string
): Promise<void> {
  const available = await checkSlotAvailability(eventDate, eventTime);
  if (!available) {
    throw new BookingConflictError(
      `The slot on ${eventDate} at ${eventTime} is already booked`
    );
  }
}
