-- Create outfit_templates table
CREATE TABLE public.outfit_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  weather_conditions TEXT[] NOT NULL DEFAULT '{}',
  temperature_min INTEGER,
  temperature_max INTEGER,
  style_category TEXT NOT NULL,
  season TEXT NOT NULL,
  occasion TEXT,
  color_palette TEXT[] NOT NULL DEFAULT '{}',
  clothing_items TEXT[] NOT NULL DEFAULT '{}',
  style_tips TEXT,
  source_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create outfit_items table
CREATE TABLE public.outfit_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_template_id UUID REFERENCES public.outfit_templates(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  brand TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'RUB',
  shop_url TEXT,
  image_url TEXT,
  size_range TEXT,
  color TEXT,
  material TEXT,
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wardrobe_items table
CREATE TABLE public.wardrobe_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  season TEXT NOT NULL,
  brand TEXT,
  image_url TEXT,
  user_id UUID NOT NULL,
  weather_conditions TEXT[] NOT NULL DEFAULT '{}',
  temperature_min INTEGER,
  temperature_max INTEGER,
  times_worn INTEGER NOT NULL DEFAULT 0,
  last_worn TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_outfits table
CREATE TABLE public.saved_outfits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  item_ids TEXT[] NOT NULL DEFAULT '{}',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  times_used INTEGER NOT NULL DEFAULT 0,
  user_id UUID NOT NULL,
  weather_context JSONB,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stylist_training_data table
CREATE TABLE public.stylist_training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_template_id UUID NOT NULL REFERENCES public.outfit_templates(id) ON DELETE CASCADE,
  user_feedback TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  weather_context JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist_items table
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  marketplace TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  external_url TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  weather_reason TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.outfit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for outfit_templates (public read, admin write)
CREATE POLICY "Anyone can view approved outfit templates" 
ON public.outfit_templates FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can create outfit templates" 
ON public.outfit_templates FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- RLS Policies for outfit_items (public read)
CREATE POLICY "Anyone can view available outfit items" 
ON public.outfit_items FOR SELECT 
USING (is_available = true);

-- RLS Policies for wardrobe_items (user-specific)
CREATE POLICY "Users can view their own wardrobe items" 
ON public.wardrobe_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wardrobe items" 
ON public.wardrobe_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wardrobe items" 
ON public.wardrobe_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wardrobe items" 
ON public.wardrobe_items FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for saved_outfits (user-specific)
CREATE POLICY "Users can view their own saved outfits" 
ON public.saved_outfits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved outfits" 
ON public.saved_outfits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved outfits" 
ON public.saved_outfits FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved outfits" 
ON public.saved_outfits FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for stylist_training_data (user-specific)
CREATE POLICY "Users can create training data" 
ON public.stylist_training_data FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own training data" 
ON public.stylist_training_data FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for wishlist_items (user-specific)
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlist_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wishlist items" 
ON public.wishlist_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" 
ON public.wishlist_items FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_outfit_templates_updated_at
  BEFORE UPDATE ON public.outfit_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outfit_items_updated_at
  BEFORE UPDATE ON public.outfit_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wardrobe_items_updated_at
  BEFORE UPDATE ON public.wardrobe_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_outfits_updated_at
  BEFORE UPDATE ON public.saved_outfits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create RPC function for getting random outfit templates
CREATE OR REPLACE FUNCTION public.get_random_outfit_templates(
  weather_condition TEXT DEFAULT NULL,
  temperature INTEGER DEFAULT NULL,
  limit_count INTEGER DEFAULT 12
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  image_url TEXT,
  weather_conditions TEXT[],
  temperature_min INTEGER,
  temperature_max INTEGER,
  style_category TEXT,
  season TEXT,
  occasion TEXT,
  color_palette TEXT[],
  clothing_items TEXT[],
  style_tips TEXT,
  source_url TEXT,
  is_approved BOOLEAN,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
AS $$
  SELECT 
    t.id, t.name, t.description, t.image_url, t.weather_conditions,
    t.temperature_min, t.temperature_max, t.style_category, t.season,
    t.occasion, t.color_palette, t.clothing_items, t.style_tips,
    t.source_url, t.is_approved, t.created_by, t.created_at, t.updated_at
  FROM public.outfit_templates t
  WHERE 
    t.is_approved = true
    AND (
      weather_condition IS NULL 
      OR weather_condition = ANY(t.weather_conditions)
    )
    AND (
      temperature IS NULL 
      OR (t.temperature_min IS NULL OR temperature >= t.temperature_min)
      AND (t.temperature_max IS NULL OR temperature <= t.temperature_max)
    )
  ORDER BY RANDOM()
  LIMIT limit_count;
$$;