-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  duration_minutes INTEGER,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);

-- Portfolio items table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_featured ON portfolio_items(is_featured);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT,
  special_instructions TEXT,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_date_time ON bookings(event_date, event_time);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Booking clients table
CREATE TABLE booking_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_clients_booking ON booking_clients(booking_id);

-- Booking services table
CREATE TABLE booking_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  booking_client_id UUID NOT NULL REFERENCES booking_clients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  service_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_services_booking ON booking_services(booking_id);
CREATE INDEX idx_booking_services_client ON booking_services(booking_client_id);

-- Contact requests table
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_quote_request BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table (optional, for future use)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_provider TEXT,
  transaction_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);

-- ===========================================
-- Row Level Security (RLS) Policies
-- ===========================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, services, portfolio
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read portfolio" ON portfolio_items FOR SELECT USING (true);

-- Public can insert bookings and contact requests
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert booking_clients" ON booking_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert booking_services" ON booking_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert contact_requests" ON contact_requests FOR INSERT WITH CHECK (true);

-- Admin (service_role) has full access via supabaseAdmin client (bypasses RLS)

-- ===========================================
-- Seed Data
-- ===========================================

INSERT INTO categories (name) VALUES
  ('Bridal'),
  ('Party'),
  ('Editorial'),
  ('Special Occasion');

INSERT INTO services (name, description, price, duration_minutes, category_id, is_active)
SELECT 'Bridal Makeup', 'Complete bridal makeup package with trial session', 15000, 120, id, true
FROM categories WHERE name = 'Bridal';

INSERT INTO services (name, description, price, duration_minutes, category_id, is_active)
SELECT 'Bridal Hair Styling', 'Elegant bridal hairstyling with accessories', 8000, 90, id, true
FROM categories WHERE name = 'Bridal';

INSERT INTO services (name, description, price, duration_minutes, category_id, is_active)
SELECT 'Party Makeup', 'Glamorous party makeup look', 5000, 60, id, true
FROM categories WHERE name = 'Party';

INSERT INTO services (name, description, price, duration_minutes, category_id, is_active)
SELECT 'Natural Glam', 'Subtle and elegant natural look', 4000, 45, id, true
FROM categories WHERE name = 'Party';

INSERT INTO services (name, description, price, duration_minutes, category_id, is_active)
SELECT 'Editorial Makeup', 'High-fashion editorial and photoshoot makeup', 12000, 90, id, true
FROM categories WHERE name = 'Editorial';

INSERT INTO services (name, description, price, duration_minutes, category_id, is_active)
SELECT 'Engagement Makeup', 'Beautiful engagement ceremony look', 10000, 90, id, true
FROM categories WHERE name = 'Special Occasion';

INSERT INTO services (name, description, price, duration_minutes, category_id, is_active)
SELECT 'Reception Look', 'Stunning reception makeup and styling', 12000, 100, id, true
FROM categories WHERE name = 'Special Occasion';

INSERT INTO portfolio_items (title, description, image_url, category, is_featured) VALUES
  ('Elegant Bridal Look', 'A stunning traditional bridal makeup', '/images/portfolio/bridal-1.jpg', 'Bridal', true),
  ('Modern Bride', 'Contemporary bridal makeup with soft glam', '/images/portfolio/bridal-2.jpg', 'Bridal', true),
  ('Party Glam', 'Bold and glamorous party makeup', '/images/portfolio/party-1.jpg', 'Party', true),
  ('Editorial Shoot', 'High fashion editorial look', '/images/portfolio/editorial-1.jpg', 'Editorial', true),
  ('Natural Beauty', 'Soft and natural everyday glam', '/images/portfolio/natural-1.jpg', 'Party', true),
  ('Reception Queen', 'Gorgeous reception makeup look', '/images/portfolio/reception-1.jpg', 'Special Occasion', true);