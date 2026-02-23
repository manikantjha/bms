import type { BookingClientInput } from "@/types/booking.types";

export function calculateTotalPrice(clients: BookingClientInput[]): number {
  return clients.reduce((total, client) => {
    const clientTotal = client.services.reduce(
      (sum, service) => sum + service.price,
      0
    );
    return total + clientTotal;
  }, 0);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}
