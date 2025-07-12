-- Добавляем образцы образов для демонстрации
INSERT INTO outfit_templates (
  name, description, image_url, weather_conditions, temperature_min, temperature_max,
  style_category, season, occasion, color_palette, clothing_items, style_tips, is_approved
) VALUES 
(
  'Осенний городской образ',
  'Стильный и комфортный образ для прогулок по городу в прохладную погоду',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
  ARRAY['Ясно', 'Облачно', 'Небольшой дождь'],
  10, 18,
  'Casual',
  'autumn',
  'Повседневный',
  ARRAY['#8B4513', '#2F4F4F', '#F5DEB3'],
  ARRAY['Куртка-бомбер', 'Джинсы', 'Кроссовки', 'Рюкзак'],
  'Сочетайте базовые цвета с яркими аксессуарами для создания интересного образа',
  true
),
(
  'Деловой стиль',
  'Элегантный образ для офиса и деловых встреч',
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
  ARRAY['Ясно', 'Облачно'],
  15, 25,
  'Business',
  'all-season',
  'Деловой',
  ARRAY['#000000', '#FFFFFF', '#708090'],
  ARRAY['Блузка', 'Брюки', 'Туфли', 'Сумка'],
  'Выбирайте классические цвета и качественные ткани для создания профессионального образа',
  true
),
(
  'Зимний теплый образ',
  'Стильный и теплый образ для морозной погоды',
  'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=600&fit=crop',
  ARRAY['Снег', 'Мороз', 'Облачно'],
  -10, 5,
  'Casual',
  'winter',
  'Повседневный',
  ARRAY['#2F4F4F', '#8B0000', '#F5F5DC'],
  ARRAY['Пуховик', 'Свитер', 'Джинсы', 'Сапоги', 'Шапка', 'Шарф'],
  'Многослойность - ключ к комфорту в зимнюю погоду',
  true
),
(
  'Летний легкий образ',
  'Свежий и легкий образ для жаркой погоды',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
  ARRAY['Ясно', 'Жарко'],
  25, 35,
  'Casual',
  'summer',
  'Повседневный',
  ARRAY['#FFE4E1', '#87CEEB', '#F0E68C'],
  ARRAY['Футболка', 'Шорты', 'Сандалии', 'Шляпа'],
  'Выбирайте натуральные ткани и светлые цвета для жаркой погоды',
  true
);

-- Добавляем товары для покупки
INSERT INTO outfit_items (
  outfit_template_id, item_name, item_type, brand, price, currency,
  shop_url, image_url, size_range, color, material, description, is_available
) VALUES 
(
  (SELECT id FROM outfit_templates WHERE name = 'Осенний городской образ' LIMIT 1),
  'Куртка-бомбер унисекс',
  'outerwear',
  'ТВОЕ',
  3499,
  'RUB',
  'https://www.wildberries.ru/catalog/example1',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
  'S-XL',
  'Хаки',
  'Полиэстер',
  'Стильная куртка-бомбер с водоотталкивающим покрытием',
  true
),
(
  (SELECT id FROM outfit_templates WHERE name = 'Осенний городской образ' LIMIT 1),
  'Джинсы прямого кроя',
  'bottom',
  'Gloria Jeans',
  2299,
  'RUB',
  'https://www.wildberries.ru/catalog/example2',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop',
  '26-32',
  'Синий',
  'Хлопок',
  'Классические джинсы прямого кроя',
  true
),
(
  (SELECT id FROM outfit_templates WHERE name = 'Деловой стиль' LIMIT 1),
  'Блузка из шелка',
  'top',
  'Zarina',
  2899,
  'RUB',
  'https://www.wildberries.ru/catalog/example3',
  'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=400&fit=crop',
  'XS-L',
  'Белый',
  'Шелк',
  'Элегантная блузка из натурального шелка',
  true
),
(
  (SELECT id FROM outfit_templates WHERE name = 'Зимний теплый образ' LIMIT 1),
  'Пуховик длинный',
  'outerwear',
  'Baon',
  8999,
  'RUB',
  'https://www.wildberries.ru/catalog/example4',
  'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop',
  'S-XL',
  'Черный',
  'Нейлон с пуховым наполнителем',
  'Теплый пуховик для суровой зимы',
  true
),
(
  (SELECT id FROM outfit_templates WHERE name = 'Летний легкий образ' LIMIT 1),
  'Футболка базовая',
  'top',
  'Uniqlo',
  899,
  'RUB',
  'https://www.wildberries.ru/catalog/example5',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
  'XS-XL',
  'Розовый',
  'Хлопок',
  'Базовая футболка из органического хлопка',
  true
);