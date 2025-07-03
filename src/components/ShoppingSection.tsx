
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOutfitItems } from "@/hooks/useOutfitItems";
import { useOutfitTemplates } from "@/hooks/useOutfitTemplates";
import { ShoppingCart, ExternalLink, Search, Filter, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ShoppingSection = () => {
  const { items, loading } = useOutfitItems();
  const { templates } = useOutfitTemplates();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.item_type === selectedCategory;
    const matchesBrand = selectedBrand === "all" || item.brand === selectedBrand;
    
    let matchesPrice = true;
    if (priceRange !== "all" && item.price) {
      switch (priceRange) {
        case "under-2000":
          matchesPrice = item.price < 2000;
          break;
        case "2000-5000":
          matchesPrice = item.price >= 2000 && item.price <= 5000;
          break;
        case "5000-10000":
          matchesPrice = item.price >= 5000 && item.price <= 10000;
          break;
        case "over-10000":
          matchesPrice = item.price > 10000;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const categories = [...new Set(items.map(item => item.item_type))];
  const brands = [...new Set(items.map(item => item.brand).filter(Boolean))];

  const getTemplateForItem = (templateId: string | null) => {
    return templates.find(t => t.id === templateId);
  };

  const handlePurchase = (item: any) => {
    if (item.shop_url) {
      window.open(item.shop_url, '_blank');
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center py-12 text-white/60">
          <div className="animate-pulse">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-lg">Загрузка товаров...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold text-white">Магазин стильных вещей</h2>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white/80">
          {filteredItems.length} товаров
        </Badge>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-white/60" />
          <Input
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'top' ? 'Верх' :
                 category === 'bottom' ? 'Низ' :
                 category === 'shoes' ? 'Обувь' :
                 category === 'accessories' ? 'Аксессуары' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Бренд" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все бренды</SelectItem>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand!}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Цена" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любая цена</SelectItem>
            <SelectItem value="under-2000">До 2000 ₽</SelectItem>
            <SelectItem value="2000-5000">2000-5000 ₽</SelectItem>
            <SelectItem value="5000-10000">5000-10000 ₽</SelectItem>
            <SelectItem value="over-10000">Свыше 10000 ₽</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-white/20" />
          <p className="text-lg mb-2">Товары не найдены</p>
          <p>Попробуйте изменить критерии поиска</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const template = getTemplateForItem(item.outfit_template_id);
            
            return (
              <Card key={item.id} className="p-4 bg-white/10 border-white/20 hover:bg-white/15 transition-all hover:scale-105 group">
                <div className="relative mb-4">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop'}
                    alt={item.item_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {template && (
                    <Badge className="absolute top-2 left-2 bg-purple-600/80 text-white text-xs">
                      {template.style_category}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg leading-tight">{item.item_name}</h3>
                    {item.brand && (
                      <p className="text-white/70 text-sm">{item.brand}</p>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-white/60 text-sm line-clamp-2">{item.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200">
                      {item.item_type === 'top' ? 'Верх' :
                       item.item_type === 'bottom' ? 'Низ' :
                       item.item_type === 'shoes' ? 'Обувь' :
                       item.item_type === 'accessories' ? 'Аксессуары' : item.item_type}
                    </Badge>
                    {item.color && (
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-200">
                        {item.color}
                      </Badge>
                    )}
                    {item.material && (
                      <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                        {item.material}
                      </Badge>
                    )}
                  </div>

                  {template && (
                    <div className="text-xs text-white/50">
                      Из образа: {template.name}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-xl font-bold text-white">
                      {item.price ? `${item.price.toLocaleString()} ${item.currency || '₽'}` : 'Цена не указана'}
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={!item.shop_url}
                      className="bg-pink-600 hover:bg-pink-700 text-white group-hover:scale-105 transition-all"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Купить
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Рекомендации */}
      <div className="mt-12 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-400/30">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-semibold text-lg">Рекомендации стилиста</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
          <div>
            <p className="mb-2">💡 <strong>Совет:</strong> Обратите внимание на качество материалов при выборе базовых вещей.</p>
            <p className="mb-2">🎨 <strong>Цвет:</strong> Нейтральные оттенки легче сочетать с другими вещами.</p>
          </div>
          <div>
            <p className="mb-2">📏 <strong>Размер:</strong> Правильная посадка важнее модных трендов.</p>
            <p className="mb-2">💰 <strong>Бюджет:</strong> Инвестируйте в качественную обувь и верхнюю одежду.</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
