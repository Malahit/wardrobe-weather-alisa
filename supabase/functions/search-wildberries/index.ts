
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
      id: '1',
      name: 'Куртка демисезонная водоотталкивающая',
      price: 3499,
      rating: 4.6,
      reviewsCount: 1247,
      brand: 'ТВОЕ',
      images: ['https://example.com/image1.jpg'],
      colors: ['Черный', 'Серый', 'Бежевый'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'outerwear',
      url: 'https://wildberries.ru/catalog/1/detail.aspx',
      inStock: true
    },
    {
      id: '2',
      name: 'Свитер оверсайз из хлопка',
      price: 1899,
      rating: 4.4,
      reviewsCount: 892,
      brand: 'Zarina',
      images: ['https://example.com/image2.jpg'],
      colors: ['Молочный', 'Коричневый', 'Серый'],
      sizes: ['S', 'M', 'L'],
      category: 'top',
      url: 'https://wildberries.ru/catalog/2/detail.aspx',
      inStock: true
    },
    {
      id: '3',
      name: 'Джинсы прямого кроя',
      price: 2299,
      rating: 4.5,
      reviewsCount: 634,
      brand: 'Gloria Jeans',
      images: ['https://example.com/image3.jpg'],
      colors: ['Синий', 'Черный'],
      sizes: ['26', '27', '28', '29', '30'],
      category: 'bottom',
      url: 'https://wildberries.ru/catalog/3/detail.aspx',
      inStock: true
    },
    {
      id: '4',
      name: 'Кроссовки белые кожаные',
      price: 4999,
      rating: 4.7,
      reviewsCount: 2156,
      brand: 'Nike',
      images: ['https://example.com/image4.jpg'],
      colors: ['Белый', 'Белый/черный'],
      sizes: ['36', '37', '38', '39', '40', '41'],
      category: 'shoes',
      url: 'https://wildberries.ru/catalog/4/detail.aspx',
      inStock: true
    },
    {
      id: '5',
      name: 'Шарф кашемировый',
      price: 1299,
      rating: 4.3,
      reviewsCount: 445,
      brand: 'Baon',
      images: ['https://example.com/image5.jpg'],
      colors: ['Серый', 'Бежевый', 'Черный'],
      sizes: ['Единый'],
      category: 'accessories',
      url: 'https://wildberries.ru/catalog/5/detail.aspx',
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
      // Добавляем теплую одежду
      filteredProducts = filteredProducts.filter(p => 
        p.category === 'outerwear' || p.category === 'accessories' || 
        p.name.includes('свитер') || p.name.includes('теплый')
      );
    } else if (weather.temperature > 25) {
      // Легкая одежда
      filteredProducts = filteredProducts.filter(p => 
        p.category !== 'outerwear' || p.name.includes('легкий')
      );
    }
  }

  return filteredProducts.slice(0, 12); // Ограничиваем до 12 товаров
}
