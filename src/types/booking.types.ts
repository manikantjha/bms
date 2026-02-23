export interface CartItem {
  serviceId: string;
  serviceName: string;
  price: number;
}

export interface BookingClientInput {
  clientName: string;
  services: CartItem[];
}

export interface CreateBookingPayload {
  customerName: string;
  email: string;
  phone?: string;
  eventDate: string;
  eventTime: string;
  location?: string;
  specialInstructions?: string;
  clients: BookingClientInput[];
}

export interface BookingResult {
  bookingId: string;
  totalPrice: number;
  status: string;
}

export interface SlotAvailability {
  date: string;
  time: string;
  available: boolean;
}
