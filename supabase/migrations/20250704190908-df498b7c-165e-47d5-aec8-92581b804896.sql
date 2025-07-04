
-- Добавляем много разнообразных образов для разных погодных условий и стилей
INSERT INTO public.outfit_templates (
  name, description, image_url, weather_conditions, temperature_min, temperature_max,
  style_category, season, occasion, color_palette, clothing_items, style_tips, is_approved
) VALUES 
-- Зимние образы
(
  'Скандинавский минимализм зима',
  'Лаконичный зимний образ в скандинавском стиле',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
  ARRAY['snow', 'windy', 'cloudy'],
  -10, 2,
  'casual',
  'winter',
  'casual',
  ARRAY['white', 'grey', 'beige'],
  ARRAY['Белое пуховое пальто', 'Бежевый свитер', 'Серые брюки', 'Белые ботинки'],
  'Светлые тона зимой создают свежий контраст с серым небом',
  true
),
(
  'Городской шик зима',
  'Элегантный образ для зимних прогулок по городу',
  'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
  ARRAY['snow', 'cloudy'],
  -5, 5,
  'business',
  'winter',
  'work',
  ARRAY['black', 'burgundy', 'gold'],
  ARRAY['Черное шерстяное пальто', 'Бордовый свитер', 'Черные брюки', 'Кожаные сапоги'],
  'Качественная шерсть и кожа - инвестиция в стиль и комфорт',
  true
),
-- Весенние образы  
(
  'Парижский шик весна',
  'Французская элегантность для весенних дней',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
  ARRAY['partly-cloudy', 'light-rain'],
  10, 20,
  'romantic',
  'spring',
  'date',
  ARRAY['navy', 'white', 'red'],
  ARRAY['Тренч бежевый', 'Белая блузка', 'Темные джинсы', 'Балетки', 'Красный платок'],
  'Тренч - это классика, которая никогда не выходит из моды',
  true
),
(
  'Цветочная романтика',
  'Нежный весенний образ с цветочными мотивами',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  15, 25,
  'romantic',
  'spring',
  'casual',
  ARRAY['pink', 'white', 'green'],
  ARRAY['Цветочное платье', 'Джинсовая куртка', 'Белые кеды', 'Плетеная сумка'],
  'Цветочные принты поднимают настроение в любую погоду',
  true
),
-- Летние образы
(
  'Морской стиль',
  'Свежий образ в морской тематике',
  'https://images.unsplash.com/photo-1558882224-dda166733046?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  22, 30,
  'casual',
  'summer',
  'leisure',
  ARRAY['navy', 'white', 'red'],
  ARRAY['Белая майка', 'Синие шорты', 'Эспадрильи', 'Полосатый шарф'],
  'Морская тематика всегда актуальна летом',
  true
),
(
  'Богемный летний образ',
  'Свободный стиль для жарких дней',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
  ARRAY['clear'],
  25, 35,
  'boho',
  'summer',
  'festival',
  ARRAY['earth-tones', 'orange', 'gold'],
  ARRAY['Легкое макси-платье', 'Сандалии', 'Широкополая шляпа', 'Этнические украшения'],
  'Натуральные ткани и свободный крой - идеально для жары',
  true
),
-- Осенние образы
(
  'Английский твид',
  'Классический осенний образ в английском стиле',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  ARRAY['cloudy', 'light-rain'],
  8, 15,
  'business',
  'autumn',
  'work',
  ARRAY['brown', 'orange', 'cream'],
  ARRAY['Твидовый пиджак', 'Кремовая блузка', 'Коричневые брюки', 'Оксфорды'],
  'Твид - это не только тепло, но и невероятный стиль',
  true
),
(
  'Слоёный осенний лук',
  'Многослойный образ для переменчивой осенней погоды',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
  ARRAY['cloudy', 'light-rain', 'windy'],
  5, 18,
  'casual',
  'autumn',
  'casual',
  ARRAY['rust', 'cream', 'brown'],
  ARRAY['Рыжий свитер', 'Бежевая рубашка', 'Коричневая куртка', 'Джинсы', 'Ботинки'],
  'Многослойность позволяет адаптироваться к любой погоде',
  true
),
-- Универсальные образы
(
  'Монохромный шик',
  'Элегантный черно-белый образ',
  'https://images.unsplash.com/photo-1506629905607-d9f02e62059c?w=400&h=600&fit=crop',
  ARRAY['clear', 'cloudy'],
  10, 25,
  'business',
  'all-season',
  'work',
  ARRAY['black', 'white'],
  ARRAY['Черный блейзер', 'Белая рубашка', 'Черные брюки', 'Черные туфли'],
  'Монохром - это всегда стильно и универсально',
  true
),
(
  'Современный минимализм',
  'Лаконичный образ для активной жизни',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  15, 28,
  'casual',
  'all-season',
  'casual',
  ARRAY['grey', 'white', 'black'],
  ARRAY['Серая футболка', 'Белые джинсы', 'Черные кроссовки', 'Минималистичная сумка'],
  'Простота - высшая форма утонченности',
  true
),
(
  'Стритвеар делюкс',
  'Модный уличный стиль с дизайнерскими элементами',
  'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  12, 22,
  'street',
  'all-season',
  'casual',
  ARRAY['black', 'neon', 'white'],
  ARRAY['Оверсайз худи', 'Карго штаны', 'Дизайнерские кроссовки', 'Рюкзак'],
  'Стритвеар может быть люксовым - все дело в деталях',
  true
),
(
  'Винтажная романтика',
  'Образ в стиле 70-х для особых случаев',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
  ARRAY['clear', 'partly-cloudy'],
  18, 26,
  'romantic',
  'all-season',
  'date',
  ARRAY['mustard', 'brown', 'cream'],
  ARRAY['Горчичное платье', 'Коричневые сапоги', 'Винтажная сумка', 'Шляпа'],
  'Винтаж добавляет индивидуальности любому образу',
  true
);

-- Добавляем функцию для случайной выборки образов
CREATE OR REPLACE FUNCTION get_random_outfit_templates(
  weather_condition TEXT DEFAULT NULL,
  temperature INTEGER DEFAULT NULL,
  limit_count INTEGER DEFAULT 12
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  image_url TEXT,
  weather_conditions TEXT[],
  temperature_min INTEGER,
  temperature_max INTEGER,
  style_category VARCHAR,
  season VARCHAR,
  occasion VARCHAR,
  color_palette TEXT[],
  clothing_items TEXT[],
  style_tips TEXT,
  source_url TEXT,
  is_approved BOOLEAN,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id, t.name, t.description, t.image_url, t.weather_conditions,
    t.temperature_min, t.temperature_max, t.style_category, t.season,
    t.occasion, t.color_palette, t.clothing_items, t.style_tips,
    t.source_url, t.is_approved, t.created_by, t.created_at, t.updated_at
  FROM outfit_templates t
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
END;
$$;
