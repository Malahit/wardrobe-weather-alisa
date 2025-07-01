
-- Create storage bucket for wardrobe photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wardrobe-photos', 'wardrobe-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own wardrobe photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own wardrobe photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own wardrobe photos" ON storage.objects;

CREATE POLICY "Users can upload their own wardrobe photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'wardrobe-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own wardrobe photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'wardrobe-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own wardrobe photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'wardrobe-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
