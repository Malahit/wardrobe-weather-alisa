
-- Создаем таблицу для товаров, связанных с образами
CREATE TABLE public.outfit_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_template_id UUID REFERENCES public.outfit_templates(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  item_type VARCHAR(100) NOT NULL, -- top, bottom, shoes, accessories, etc.
  brand VARCHAR(100),
  price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'RUB',
  shop_url TEXT,
  image_url TEXT,
  size_range VARCHAR(50),
  color VARCHAR(100),
  material VARCHAR(100),
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем индексы для оптимизации
CREATE INDEX idx_outfit_items_template ON public.outfit_items (outfit_template_id);
CREATE INDEX idx_outfit_items_type ON public.outfit_items (item_type);
CREATE INDEX idx_outfit_items_available ON public.outfit_items (is_available);

-- Включаем RLS
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;

-- Политики доступа (публичное чтение для всех)
CREATE POLICY "Anyone can view outfit items" 
  ON public.outfit_items 
  FOR SELECT 
  USING (true);

-- Добавляем больше образцов образов с подробной информацией о товарах
INSERT INTO public.outfit_templates (
  name, description, image_url, weather_conditions, temperature_min, temperature_max,
  style_category, season, occasion, color_palette, clothing_items, style_tips, is_approved
) VALUES 
(
  'Осенний кэжуал с джинсами',
  'Стильный повседневный образ для прохладной осенней погоды',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
  ARRAY['cloudy', 'light-rain'],
  8, 18,
  'casual',
  'autumn',
  'casual',
  ARRAY['blue', 'grey', 'white'],
  ARRAY['Джинсы скинни', 'Белая футболка', 'Серый кардиган', 'Белые кроссовки', 'Черная сумка'],
  'Многослойность - ключ к осеннему стилю. Кардиган легко снять, если станет жарко',
  true
),
(
  'Зимний образ с пальто',
  'Элегантный зимний лук для города',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
  ARRAY['snow', 'cloudy', 'windy'],
  -5, 5,
  'casual',
  'winter',
  'casual',
  ARRAY['black', 'grey', 'beige'],
  ARRAY['Черное пальто', 'Серый свитер', 'Черные джинсы', 'Зимние ботинки', 'Шарф', 'Шапка'],
  'Темные цвета визуально стройнят, а качественные материалы согревают',
  true
),
(
  'Летний образ с платьем',
  'Легкий летний образ для жаркой погоды',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  20, 35,
  'romantic',
  'summer',
  'date',
  ARRAY['white', 'pink', 'gold'],
  ARRAY['Белое летнее платье', 'Босоножки на каблуке', 'Соломенная шляпа', 'Легкий кардиган'],
  'Натуральные ткани и светлые цвета - лучший выбор для жаркой погоды',
  true
),
(
  'Спортивный образ для тренировок',
  'Функциональный образ для активного отдыха',
  'https://images.unsplash.com/photo-1506629905607-d9f02e62059c?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  15, 25,
  'sporty',
  'all-season',
  'sport',
  ARRAY['black', 'white', 'neon'],
  ARRAY['Спортивные леггинсы', 'Спортивный топ', 'Кроссовки для бега', 'Ветровка'],
  'Правильная экипировка повышает эффективность тренировок',
  true
),
(
  'Деловой образ для встреч',
  'Профессиональный стиль для важных переговоров',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  18, 26,
  'business',
  'all-season',
  'work',
  ARRAY['navy', 'white', 'grey'],
  ARRAY['Темно-синий костюм', 'Белая рубашка', 'Галстук', 'Классические туфли', 'Портфель'],
  'Качественная посадка костюма - основа делового образа',
  true
),
(
  'Романтический вечерний образ',
  'Изысканный образ для особого случая',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
  ARRAY['clear'],
  16, 24,
  'romantic',
  'all-season',
  'evening',
  ARRAY['burgundy', 'gold', 'black'],
  ARRAY['Бордовое коктейльное платье', 'Туфли на шпильке', 'Золотые украшения', 'Клатч'],
  'Аксессуары должны дополнять, а не перебивать основной образ',
  true
),
(
  'Стритстайл с джинсовкой',
  'Модный уличный образ для молодежи',
  'https://images.unsplash.com/photo-1558882224-dda166733046?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  12, 22,
  'street',
  'spring',
  'casual',
  ARRAY['blue', 'white', 'black'],
  ARRAY['Рваные джинсы', 'Белая футболка', 'Джинсовая куртка', 'Высокие кеды'],
  'Контраст текстур создает интересный визуальный эффект',
  true
),
(
  'Бохо-стиль для фестивалей',
  'Свободный богемный образ',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  18, 28,
  'boho',
  'summer',
  'leisure',
  ARRAY['earth-tones', 'brown', 'orange'],
  ARRAY['Макси-платье', 'Кожаные сандалии', 'Этнические украшения', 'Сумка-хобо'],
  'Натуральные материалы и этнические мотивы - основа бохо-стиля',
  true
);

-- Добавляем информацию о товарах для некоторых образов
INSERT INTO public.outfit_items (
  outfit_template_id, item_name, item_type, brand, price, shop_url, image_url, description
) 
SELECT 
  t.id,
  'Джинсы скинни высокой посадки',
  'bottom',
  'Zara',
  2999.00,
  'https://www.zara.com/ru/ru/джинсы-скинни',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
  'Классические джинсы скинни из качественного денима'
FROM outfit_templates t 
WHERE t.name = 'Осенний кэжуал с джинсами'
LIMIT 1;

INSERT INTO public.outfit_items (
  outfit_template_id, item_name, item_type, brand, price, shop_url, image_url, description
) 
SELECT 
  t.id,
  'Кашемировый кардиган',
  'top',
  'H&M',
  4999.00,
  'https://www2.hm.com/ru_ru/productpage.html',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop',
  'Мягкий кардиган из смеси кашемира'
FROM outfit_templates t 
WHERE t.name = 'Осенний кэжуал с джинсами'
LIMIT 1;
