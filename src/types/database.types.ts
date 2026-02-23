export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number | null;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  category?: Category;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  event_date: string;
  event_time: string;
  location: string | null;
  special_instructions: string | null;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface BookingClient {
  id: string;
  booking_id: string;
  client_name: string;
  created_at: string;
}

export interface BookingService {
  id: string;
  booking_id: string;
  booking_client_id: string;
  service_id: string;
  service_price: number;
  created_at: string;
  service?: Service;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_quote_request: boolean;
  responded_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_status: string;
  payment_provider: string | null;
  transaction_reference: string | null;
  created_at: string;
}

export interface FoundationLead {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  image_url: string;
  undertone: string;
  depth: string;
  avg_rgb: { r: number; g: number; b: number };
  recommended_shades: string[];
  interested_in_makeup: boolean;
  selected_service: string | null;
  created_at: string;
}
