
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category, weather, userId } = await req.json();

    console.log('Searching Wildberries for:', { query, category, weather, userId });

    // В реальной интеграции здесь был бы запрос к API Wildberries
    // Пока возвращаем моковые данные с учетом запроса
    const mockProducts = generateMockProducts(query, category, weather);

    return new Response(JSON.stringify({ products: mockProducts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-wildberries function:', error);
    return new Response(
      JSON.stringify({ error: error.message, products: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateMockProducts(query: string, category: string, weather: any) {
  const baseProducts = [
    {
      id: 'wb_1',
      name: 'Куртка демисезонная водоотталкивающая ТВОЕ',
      price: 3499,
      rating: 4.6,
      reviewsCount: 1247,
      brand: 'ТВОЕ',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'],
      colors: ['Черный', 'Серый', 'Бежевый'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'outerwear',
      url: 'https://www.wildberries.ru/catalog/women/clothes/outerwear',
      inStock: true
    },
    {
      id: 'wb_2',
      name: 'Свитер оверсайз из хлопка Zarina',
      price: 1899,
      rating: 4.4,
      reviewsCount: 892,
      brand: 'Zarina',
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'],
      colors: ['Молочный', 'Коричневый', 'Серый'],
      sizes: ['S', 'M', 'L'],
      category: 'top',
      url: 'https://www.wildberries.ru/catalog/women/clothes/knitwear',
      inStock: true
    },
    {
      id: 'wb_3',
      name: 'Джинсы прямого кроя Gloria Jeans',
      price: 2299,
      rating: 4.5,
      reviewsCount: 634,
      brand: 'Gloria Jeans',
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'],
      colors: ['Синий', 'Черный'],
      sizes: ['26', '27', '28', '29', '30'],
      category: 'bottom',
      url: 'https://www.wildberries.ru/catalog/women/clothes/jeans',
      inStock: true
    },
    {
      id: 'wb_4',
      name: 'Кроссовки белые кожаные Nike',
      price: 4999,
      rating: 4.7,
      reviewsCount: 2156,
      brand: 'Nike',
      images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'],
      colors: ['Белый', 'Белый/черный'],
      sizes: ['36', '37', '38', '39', '40', '41'],
      category: 'shoes',
      url: 'https://www.wildberries.ru/catalog/shoes/women/sneakers',
      inStock: true
    },
    {
      id: 'wb_5',
      name: 'Шарф кашемировый Baon',
      price: 1299,
      rating: 4.3,
      reviewsCount: 445,
      brand: 'Baon',
      images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop'],
      colors: ['Серый', 'Бежевый', 'Черный'],
      sizes: ['Единый'],
      category: 'accessories',
      url: 'https://www.wildberries.ru/catalog/accessories/scarves',
      inStock: true
    },
    {
      id: 'ozon_1',
      name: 'Платье миди с длинным рукавом',
      price: 2599,
      rating: 4.5,
      reviewsCount: 789,
      brand: 'LOVE REPUBLIC',
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'],
      colors: ['Черный', 'Темно-синий', 'Бордовый'],
      sizes: ['XS', 'S', 'M', 'L'],
      category: 'dresses',
      url: 'https://www.ozon.ru/category/platya',
      inStock: true
    },
    {
      id: 'ozon_2',
      name: 'Ботинки зимние на меху',
      price: 5999,
      rating: 4.6,
      reviewsCount: 1234,
      brand: 'Tervolina',
      images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop'],
      colors: ['Черный', 'Коричневый'],
      sizes: ['36', '37', '38', '39', '40'],
      category: 'shoes',
      url: 'https://www.ozon.ru/category/obuv',
      inStock: true
    },
    {
      id: 'lamoda_1',
      name: 'Сумка через плечо кожаная',
      price: 3999,
      rating: 4.4,
      reviewsCount: 567,
      brand: 'Fabula',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
      colors: ['Черный', 'Коричневый', 'Бежевый'],
      sizes: ['Единый'],
      category: 'accessories',
      url: 'https://www.lamoda.ru/c/477/bags',
      inStock: true
    },
    {
      id: 'lamoda_2',
      name: 'Пальто шерстяное демисезонное',
      price: 8999,
      rating: 4.8,
      reviewsCount: 345,
      brand: 'MANGO',
      images: ['https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=400&fit=crop'],
      colors: ['Серый', 'Черный', 'Кэмел'],
      sizes: ['S', 'M', 'L'],
      category: 'outerwear',
      url: 'https://www.lamoda.ru/c/515/clothes-verhnyaya_odezhda',
      inStock: true
    },
    {
      id: 'avito_1',
      name: 'Блузка шелковая винтажная',
      price: 1500,
      rating: 4.2,
      reviewsCount: 89,
      brand: 'Vintage',
      images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop'],
      colors: ['Белый', 'Кремовый'],
      sizes: ['S', 'M'],
      category: 'top',
      url: 'https://www.avito.ru/rossiya/odezhda_obuv_aksessuary',
      inStock: true
    }
  ];

  // Фильтруем по категории если указана
  let filteredProducts = category ? 
    baseProducts.filter(p => p.category === category) : 
    baseProducts;

  // Фильтруем по поисковому запросу
  if (query) {
    const searchLower = query.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  }

  // Адаптируем под погоду
  if (weather && weather.temperature) {
    if (weather.temperature < 10) {
      // Добавляем теплую одежду для холодной погоды
      filteredProducts = baseProducts.filter(p => 
        p.category === 'outerwear' || p.category === 'accessories' || 
        p.name.includes('свитер') || p.name.includes('теплый') || 
        p.name.includes('шарф') || p.name.includes('ботинки') ||
        p.name.includes('пальто')
      );
    } else if (weather.temperature > 25) {
      // Легкая одежда для жаркой погоды
      filteredProducts = baseProducts.filter(p => 
        p.category !== 'outerwear' || p.name.includes('легкий') ||
        p.category === 'dresses' || p.name.includes('футболка')
      );
    }
  }

  return filteredProducts.slice(0, 12); // Ограничиваем до 12 товаров
}
