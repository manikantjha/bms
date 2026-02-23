-- Foundation Leads table
CREATE TABLE foundation_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  image_url TEXT NOT NULL,
  undertone TEXT NOT NULL,
  depth TEXT NOT NULL,
  avg_rgb JSONB NOT NULL,
  recommended_shades JSONB NOT NULL,
  interested_in_makeup BOOLEAN DEFAULT FALSE,
  selected_service TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE foundation_leads ENABLE ROW LEVEL SECURITY;

-- Public can insert leads
CREATE POLICY "Public can insert foundation_leads" ON foundation_leads FOR INSERT WITH CHECK (true);

-- Admin (service_role) has full access via supabaseAdmin client

-- Foundation Uploads Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('foundation-uploads', 'foundation-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for foundation-uploads
CREATE POLICY "Public can view foundation-uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'foundation-uploads');

CREATE POLICY "Public can upload to foundation-uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'foundation-uploads');
