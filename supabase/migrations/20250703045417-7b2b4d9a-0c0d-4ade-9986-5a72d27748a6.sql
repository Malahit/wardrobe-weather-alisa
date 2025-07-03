
-- Создаем таблицу для образов с обучающими данными
CREATE TABLE public.outfit_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  weather_conditions TEXT[] NOT NULL DEFAULT '{}', -- массив погодных условий
  temperature_min INTEGER, -- минимальная температура
  temperature_max INTEGER, -- максимальная температура
  style_category VARCHAR(100) NOT NULL, -- casual, business, formal, street, etc.
  season VARCHAR(50) NOT NULL, -- spring, summer, autumn, winter, all-season
  occasion VARCHAR(100), -- work, date, party, casual, sport
  color_palette TEXT[] NOT NULL DEFAULT '{}', -- основные цвета образа
  clothing_items TEXT[] NOT NULL DEFAULT '{}', -- список предметов одежды
  style_tips TEXT, -- советы по стилю
  source_url TEXT, -- ссылка на источник
  is_approved BOOLEAN DEFAULT false, -- одобрен ли образ модератором
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для обучающих данных стилиста
CREATE TABLE public.stylist_training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  outfit_template_id UUID REFERENCES public.outfit_templates(id),
  user_feedback TEXT, -- отзыв пользователя об образе
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- оценка от 1 до 5
  weather_context JSONB, -- контекст погоды когда был выбран образ
  personal_preferences JSONB, -- личные предпочтения пользователя
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для обеих таблиц
ALTER TABLE public.outfit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_training_data ENABLE ROW LEVEL SECURITY;

-- Политики для outfit_templates (публичное чтение, авторизованное создание)
CREATE POLICY "Anyone can view approved outfit templates" 
  ON public.outfit_templates 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Authenticated users can create outfit templates" 
  ON public.outfit_templates 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own outfit templates" 
  ON public.outfit_templates 
  FOR UPDATE 
  USING (auth.uid() = created_by);

-- Политики для stylist_training_data (только для авторизованных пользователей)
CREATE POLICY "Users can view their own training data" 
  ON public.stylist_training_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own training data" 
  ON public.stylist_training_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training data" 
  ON public.stylist_training_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Создаем индексы для оптимизации запросов
CREATE INDEX idx_outfit_templates_weather ON public.outfit_templates USING GIN (weather_conditions);
CREATE INDEX idx_outfit_templates_temperature ON public.outfit_templates (temperature_min, temperature_max);
CREATE INDEX idx_outfit_templates_style ON public.outfit_templates (style_category, season);
CREATE INDEX idx_stylist_training_user ON public.stylist_training_data (user_id);
CREATE INDEX idx_stylist_training_outfit ON public.stylist_training_data (outfit_template_id);

-- Вставляем примеры качественных образов
INSERT INTO public.outfit_templates (
  name, description, image_url, weather_conditions, temperature_min, temperature_max,
  style_category, season, occasion, color_palette, clothing_items, style_tips, is_approved
) VALUES 
(
  'Классический деловой образ',
  'Элегантный деловой стиль для офиса и деловых встреч',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  15, 25,
  'business',
  'all-season',
  'work',
  ARRAY['navy', 'white', 'black'],
  ARRAY['Темный костюм', 'Белая рубашка', 'Классические туфли', 'Кожаный ремень', 'Часы'],
  'Классические пропорции, качественные ткани, минимум аксессуаров',
  true
),
(
  'Кэжуал для города',
  'Стильный городской образ для повседневной жизни',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy', 'light-rain'],
  10, 20,
  'casual',
  'spring',
  'casual',
  ARRAY['blue', 'white', 'grey'],
  ARRAY['Джинсы', 'Хлопковая футболка', 'Кроссовки', 'Джинсовая куртка'],
  'Комфорт и стиль в балансе, качественный деним',
  true
),
(
  'Элегантный вечерний образ',
  'Утонченный образ для особых случаев',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
  ARRAY['clear'],
  18, 30,
  'formal',
  'summer',
  'date',
  ARRAY['black', 'gold', 'nude'],
  ARRAY['Коктейльное платье', 'Туфли на каблуке', 'Клатч', 'Украшения'],
  'Акцент на силуэт, качественные материалы, изящные детали',
  true
),
(
  'Зимний уличный стиль',
  'Теплый и стильный образ для холодной погоды',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
  ARRAY['snow', 'cloudy', 'windy'],
  -10, 5,
  'street',
  'winter',
  'casual',
  ARRAY['black', 'grey', 'burgundy'],
  ARRAY['Пуховик', 'Свитер', 'Джинсы', 'Ботинки', 'Шапка', 'Шарф'],
  'Многослойность, качественная зимняя обувь, яркие акценты',
  true
);
