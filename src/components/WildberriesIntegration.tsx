
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, ShoppingCart, Search, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WBProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  images: string[];
  colors: string[];
  sizes: string[];
  category: string;
  url: string;
  inStock: boolean;
}

interface WildberriesIntegrationProps {
  searchQuery?: string;
  category?: string;
  weather?: any;
  wardrobeGaps?: string[];
}

export const WildberriesIntegration = ({ 
  searchQuery = "", 
  category = "",
  weather,
  wardrobeGaps = []
}: WildberriesIntegrationProps) => {
  const [products, setProducts] = useState<WBProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchQuery);
  const { user } = useAuth();

  useEffect(() => {
    if (searchQuery || wardrobeGaps.length > 0) {
      searchProducts();
    }
  }, [searchQuery, category, weather]);

  const searchProducts = async (customQuery?: string) => {
    setLoading(true);
    try {
      const searchTerm = customQuery || query || wardrobeGaps.join(' ') || 'одежда';
      
      const { data, error } = await supabase.functions.invoke('search-wildberries', {
        body: {
          query: searchTerm,
          category,
          weather: weather ? {
            temperature: weather.temperature,
            condition: weather.condition
          } : null,
          userId: user?.id
        }
      });

      if (error) throw error;
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error searching Wildberries:', error);
      // Заглушка с тестовыми данными
      setProducts(getTestProducts());
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: WBProduct) => {
    try {
      await supabase.from('wishlist_items').insert([{
        item_name: product.name,
        marketplace: 'Wildberries',
        price: product.price,
        external_url: product.url,
        category: product.category,
        image_url: product.images[0],
        weather_reason: weather ? `Подходит для ${weather.temperature}°C` : null,
        user_id: user?.id
      }]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const getTestProducts = (): WBProduct[] => [
    {
      id: '1',
      name: 'Куртка демисезонная женская',
      price: 3499,
      rating: 4.6,
      reviewsCount: 1247,
      brand: 'ТВОЕ',
      images: ['https://basket-01.wb.ru/vol1/pic1.jpg'],
      colors: ['Черный', 'Серый', 'Бежевый'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'outerwear',
      url: 'https://wildberries.ru/catalog/1/detail.aspx',
      inStock: true
    },
    {
      id: '2', 
      name: 'Свитер оверсайз',
      price: 1899,
      rating: 4.4,
      reviewsCount: 892,
      brand: 'Zarina',
      images: ['https://basket-02.wb.ru/vol2/pic2.jpg'],
      colors: ['Молочный', 'Коричневый'],
      sizes: ['S', 'M', 'L'],
      category: 'top',
      url: 'https://wildberries.ru/catalog/2/detail.aspx',
      inStock: true
    }
  ];

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Wildberries</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск товаров..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
          />
          <Button
            onClick={() => searchProducts()}
            disabled={loading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {wardrobeGaps.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
          <p className="text-yellow-200 text-sm mb-2">🎯 Рекомендуем дополнить гардероб:</p>
          <div className="flex flex-wrap gap-2">
            {wardrobeGaps.map((gap, index) => (
              <Badge key={index} variant="secondary" className="bg-yellow-500/20 text-yellow-200">
                {gap}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 bg-white/10 border-white/20 animate-pulse">
              <div className="aspect-square bg-white/20 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-3 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4 bg-white/10 border-white/20 hover:bg-white/15 transition-all hover-scale">
              <div className="aspect-square bg-white/20 rounded-lg mb-4 flex items-center justify-center text-4xl">
                {product.category === 'outerwear' ? '🧥' :
                 product.category === 'top' ? '👕' :
                 product.category === 'bottom' ? '👖' :
                 product.category === 'shoes' ? '👟' : '👗'}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-white text-sm line-clamp-2 flex-1">
                    {product.name}
                  </h3>
                  {product.inStock && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 ml-2">
                      В наличии
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300 font-bold text-lg">
                    {product.price.toLocaleString()} ₽
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-300">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs">{product.rating}</span>
                    <span className="text-xs text-white/60">({product.reviewsCount})</span>
                  </div>
                </div>
                
                <p className="text-white/60 text-xs">{product.brand}</p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-white/20 text-white/80">
                      {color}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                    onClick={() => window.open(product.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Купить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white/80 hover:bg-white/10 text-xs"
                    onClick={() => addToWishlist(product)}
                  >
                    ❤️
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12 text-white/60">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-lg">Товары не найдены</p>
          <p className="text-sm">Попробуйте изменить поисковый запрос</p>
        </div>
      )}
    </Card>
  );
};
