
-- Создаем таблицу профилей пользователей
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для хранения вещей гардероба
CREATE TABLE public.wardrobe_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- верх, низ, обувь, верхняя одежда, аксессуары
  color TEXT NOT NULL,
  season TEXT NOT NULL, -- весна, лето, осень, зима, всесезон
  brand TEXT,
  image_url TEXT,
  weather_conditions TEXT[], -- массив условий: дождь, снег, жара и т.д.
  temperature_min INTEGER, -- минимальная температура для этой вещи
  temperature_max INTEGER, -- максимальная температура для этой вещи
  times_worn INTEGER DEFAULT 0,
  last_worn DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для сохраненных образов
CREATE TABLE public.outfits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  weather_condition TEXT,
  temperature INTEGER,
  item_ids UUID[] NOT NULL, -- массив ID вещей из wardrobe_items
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  times_used INTEGER DEFAULT 0,
  last_used DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для рекомендаций маркетплейсов
CREATE TABLE public.marketplace_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  item_name TEXT NOT NULL,
  price DECIMAL(10,2),
  marketplace TEXT NOT NULL, -- wildberries, ozon и т.д.
  external_url TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  weather_reason TEXT, -- причина рекомендации
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS (Row Level Security) для всех таблиц
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_recommendations ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности для profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Создаем политики безопасности для wardrobe_items
CREATE POLICY "Users can view their own wardrobe items" 
  ON public.wardrobe_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wardrobe items" 
  ON public.wardrobe_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wardrobe items" 
  ON public.wardrobe_items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wardrobe items" 
  ON public.wardrobe_items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики безопасности для outfits
CREATE POLICY "Users can view their own outfits" 
  ON public.outfits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outfits" 
  ON public.outfits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits" 
  ON public.outfits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits" 
  ON public.outfits 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики безопасности для marketplace_recommendations
CREATE POLICY "Users can view their own recommendations" 
  ON public.marketplace_recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
  ON public.marketplace_recommendations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Создаем триггер для автоматического создания профиля пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Создаем триггер, который срабатывает при регистрации нового пользователя
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Добавляем триггеры для автоматического обновления updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER wardrobe_items_updated_at
  BEFORE UPDATE ON public.wardrobe_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER outfits_updated_at
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
