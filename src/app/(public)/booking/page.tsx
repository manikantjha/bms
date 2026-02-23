import type { Metadata } from "next";
import { getActiveServices } from "@/services/service.service";
import BookingForm from "@/components/booking/booking-form";
import { NAME } from "@/config";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book your makeup appointment. Choose services for multiple clients, select your date, and submit your booking request.",
  openGraph: {
    title: `Book Appointment | ${NAME}`,
    description: `Book your makeup appointment with ${NAME}. Multi-client bookings supported.`,
  },
};

export default async function BookingPage() {
  let services: Awaited<ReturnType<typeof getActiveServices>> = [];

  try {
    services = await getActiveServices();
  } catch {
    // Gracefully handle when Supabase is not configured
  }

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">
            Appointments
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text">
            Book Your Session
          </h1>
          <p className="text-text-muted mt-3 max-w-xl mx-auto">
            Select services for each client, choose your preferred date and
            time, and we&apos;ll confirm your appointment.
          </p>
        </div>

        <BookingForm services={services} />
      </div>
    </section>
  );
}
