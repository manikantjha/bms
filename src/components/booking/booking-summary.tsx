"use client";

import { formatPrice } from "@/utils/price-calculator";
import type { BookingClientInput } from "@/types/booking.types";

interface BookingSummaryProps {
  clients: BookingClientInput[];
  eventDate: string;
  eventTime: string;
  location: string;
}

export default function BookingSummary({
  clients,
  eventDate,
  eventTime,
  location,
}: BookingSummaryProps) {
  const totalPrice = clients.reduce(
    (total, client) =>
      total + client.services.reduce((sum, s) => sum + s.price, 0),
    0
  );

  const totalServices = clients.reduce(
    (count, client) => count + client.services.length,
    0
  );

  return (
    <div className="bg-surface rounded-2xl border border-border p-6">
      <h3 className="font-heading text-lg font-semibold text-text mb-4">
        Booking Summary
      </h3>

      {eventDate && (
        <div className="text-sm text-text-muted mb-3">
          <span className="font-medium text-text">Date:</span> {eventDate}
          {eventTime && ` at ${eventTime}`}
        </div>
      )}
      {location && (
        <div className="text-sm text-text-muted mb-3">
          <span className="font-medium text-text">Location:</span> {location}
        </div>
      )}

      <div className="space-y-4 mb-4">
        {clients.map((client, i) => (
          <div key={i} className="border-t border-border pt-3 first:border-0 first:pt-0">
            <p className="font-medium text-text text-sm">
              {client.clientName || `Client ${i + 1}`}
            </p>
            {client.services.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {client.services.map((svc) => (
                  <li
                    key={svc.serviceId}
                    className="flex justify-between text-sm text-text-muted"
                  >
                    <span>{svc.serviceName}</span>
                    <span>{formatPrice(svc.price)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted/50 italic mt-1">
                No services selected
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="border-t-2 border-primary/20 pt-3 space-y-1">
        <div className="flex justify-between text-sm text-text-muted">
          <span>Total clients</span>
          <span>{clients.length}</span>
        </div>
        <div className="flex justify-between text-sm text-text-muted">
          <span>Total services</span>
          <span>{totalServices}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-primary pt-1">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
