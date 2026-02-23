import { supabaseAdmin } from "@/lib/supabase-server";
import { validateSlotOrThrow } from "@/utils/availability-checker";
import { calculateTotalPrice } from "@/utils/price-calculator";
import type { CreateBookingPayload, BookingResult } from "@/types/booking.types";
import type { Booking } from "@/types/database.types";

export async function createBooking(
  payload: CreateBookingPayload
): Promise<BookingResult> {
  await validateSlotOrThrow(payload.eventDate, payload.eventTime);

  const totalPrice = calculateTotalPrice(payload.clients);

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("bookings")
    .insert({
      customer_name: payload.customerName,
      email: payload.email,
      phone: payload.phone || null,
      event_date: payload.eventDate,
      event_time: payload.eventTime,
      location: payload.location || null,
      special_instructions: payload.specialInstructions || null,
      total_price: totalPrice,
      status: "pending",
    })
    .select()
    .single();

  if (bookingError) {
    console.error({
      context: "createBooking:insertBooking",
      error: bookingError.message,
    });
    throw new Error("Failed to create booking");
  }

  for (const client of payload.clients) {
    const { data: bookingClient, error: clientError } = await supabaseAdmin
      .from("booking_clients")
      .insert({
        booking_id: booking.id,
        client_name: client.clientName,
      })
      .select()
      .single();

    if (clientError) {
      console.error({
        context: "createBooking:insertClient",
        error: clientError.message,
      });
      await rollbackBooking(booking.id);
      throw new Error("Failed to create booking client");
    }

    const serviceInserts = client.services.map((svc) => ({
      booking_id: booking.id,
      booking_client_id: bookingClient.id,
      service_id: svc.serviceId,
      service_price: svc.price,
    }));

    const { error: svcError } = await supabaseAdmin
      .from("booking_services")
      .insert(serviceInserts);

    if (svcError) {
      console.error({
        context: "createBooking:insertServices",
        error: svcError.message,
      });
      await rollbackBooking(booking.id);
      throw new Error("Failed to create booking services");
    }
  }

  return {
    bookingId: booking.id,
    totalPrice,
    status: "pending",
  };
}

async function rollbackBooking(bookingId: string): Promise<void> {
  await supabaseAdmin
    .from("booking_services")
    .delete()
    .eq("booking_id", bookingId);
  await supabaseAdmin
    .from("booking_clients")
    .delete()
    .eq("booking_id", bookingId);
  await supabaseAdmin.from("bookings").delete().eq("id", bookingId);
}

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error({ context: "getBookings", error: error.message });
    throw new Error("Failed to fetch bookings");
  }

  return data ?? [];
}

export async function getBookingById(id: string): Promise<Booking & {
  clients: Array<{
    id: string;
    client_name: string;
    services: Array<{
      id: string;
      service_price: number;
      service: { id: string; name: string };
    }>;
  }>;
} | null> {
  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error("Failed to fetch booking");
  }

  const { data: clients } = await supabaseAdmin
    .from("booking_clients")
    .select("*")
    .eq("booking_id", id);

  const { data: bookingServices } = await supabaseAdmin
    .from("booking_services")
    .select("*, service:services(id, name)")
    .eq("booking_id", id);

  const clientsWithServices = (clients ?? []).map((client) => ({
    ...client,
    services: (bookingServices ?? []).filter(
      (bs) => bs.booking_client_id === client.id
    ),
  }));

  return { ...booking, clients: clientsWithServices };
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<Booking> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error({ context: "updateBookingStatus", error: error.message });
    throw new Error("Failed to update booking status");
  }

  return data;
}
