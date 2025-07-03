
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOutfitTemplates } from "@/hooks/useOutfitTemplates";
import { useOutfitItems } from "@/hooks/useOutfitItems";
import { Heart, ShoppingBag, Star, Thermometer, Cloud, Sun, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedOutfitGalleryProps {
  weather: any;
}

export const EnhancedOutfitGallery = ({ weather }: EnhancedOutfitGalleryProps) => {
  const { templates, loading, fetchTemplates, submitTrainingData } = useOutfitTemplates();
  const { getItemsByTemplate } = useOutfitItems();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Автоматическое обновление образов каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTemplates(weather);
    }, 30000);

    return () => clearInterval(interval);
  }, [weather]);

  const handleLikeOutfit = async (templateId: string, rating: number) => {
    try {
      await submitTrainingData(templateId, `Понравился образ`, rating, weather);
      toast({
        title: "Спасибо!",
        description: "Ваша оценка поможет улучшить рекомендации",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const getWeatherIcon = (conditions: string[]) => {
    if (conditions.includes('clear') || conditions.includes('sunny')) return <Sun className="w-4 h-4" />;
    if (conditions.includes('rain') || conditions.includes('light-rain')) return <Cloud className="w-4 h-4" />;
    if (conditions.includes('snow')) return <div className="w-4 h-4 text-center">❄️</div>;
    return <Cloud className="w-4 h-4" />;
  };

  const getSeasonEmoji = (season: string) => {
    switch (season) {
      case 'spring': return '🌱';
      case 'summer': return '☀️';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🌟';
    }
  };

  const getStyleEmoji = (style: string) => {
    switch (style) {
      case 'casual': return '👕';
      case 'business': return '💼';
      case 'formal': return '🎩';
      case 'sporty': return '🏃‍♀️';
      case 'romantic': return '💕';
      case 'street': return '🛹';
      case 'boho': return '🌺';
      default: return '✨';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center py-12 text-white/60">
          <div className="animate-pulse">
            <RefreshCw className="w-16 h-16 mx-auto mb-4 text-white/20 animate-spin" />
            <p className="text-lg">Подбираем стильные образы...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✨</span>
          <h2 className="text-2xl font-bold text-white">Галерея образов</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-white/20 text-white/80">
            {templates.length} образов
          </Badge>
          <Button
            onClick={() => fetchTemplates(weather)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      {weather && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
          <div className="flex items-center space-x-4 text-white/80">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4" />
              <span>{weather.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              {getWeatherIcon([weather.condition])}
              <span className="capitalize">{weather.condition}</span>
            </div>
            <span className="text-sm">Образы подобраны под текущую погоду</span>
          </div>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">🎨</span>
          </div>
          <p className="text-lg mb-2">Образы не найдены</p>
          <p>Попробуйте обновить или изменить параметры поиска</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const items = getItemsByTemplate(template.id);
            
            return (
              <Card 
                key={template.id} 
                className={`p-4 transition-all hover:shadow-xl hover:scale-105 ${
                  selectedTemplate === template.id 
                    ? 'ring-2 ring-pink-400 bg-pink-50/20' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
                onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
              >
                <div className="relative mb-4">
                  <img
                    src={template.image_url}
                    alt={template.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Badge className="bg-black/60 text-white text-xs">
                      {getSeasonEmoji(template.season)} {template.season}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-purple-600/80 text-white text-xs">
                      {getStyleEmoji(template.style_category)} {template.style_category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{template.name}</h3>
                    <p className="text-white/70 text-sm mt-1">{template.description}</p>
                  </div>

                  {/* Температурный диапазон */}
                  {(template.temperature_min || template.temperature_max) && (
                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <Thermometer className="w-4 h-4" />
                      <span>
                        {template.temperature_min}°C - {template.temperature_max}°C
                      </span>
                    </div>
                  )}

                  {/* Погодные условия */}
                  <div className="flex flex-wrap gap-1">
                    {template.weather_conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-500/20 text-blue-200">
                        {getWeatherIcon([condition])} {condition}
                      </Badge>
                    ))}
                  </div>

                  {/* Цветовая палитра */}
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 text-sm">Цвета:</span>
                    <div className="flex space-x-1">
                      {template.color_palette.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-white/30"
                          style={{ backgroundColor: color === 'navy' ? '#000080' : color === 'burgundy' ? '#800020' : color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Вещи */}
                  <div className="space-y-2">
                    <span className="text-white/60 text-sm">Состав образа:</span>
                    <div className="flex flex-wrap gap-1">
                      {template.clothing_items.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-500/20 text-green-200">
                          {item}
                        </Badge>
                      ))}
                      {template.clothing_items.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-500/20 text-gray-200">
                          +{template.clothing_items.length - 3} еще
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Советы стилиста */}
                  {template.style_tips && (
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-white/80 text-sm italic">
                        💡 {template.style_tips}
                      </p>
                    </div>
                  )}

                  {/* Товары */}
                  {items.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-white/60 text-sm">Доступные товары:</span>
                      <div className="flex flex-wrap gap-1">
                        {items.slice(0, 2).map((item) => (
                          <Badge key={item.id} variant="secondary" className="text-xs bg-orange-500/20 text-orange-200">
                            {item.item_name} - {item.price}₽
                          </Badge>
                        ))}
                        {items.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-200">
                            +{items.length - 2} товаров
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Действия */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeOutfit(template.id, rating);
                          }}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeOutfit(template.id, 5);
                        }}
                        className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/20"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      {items.length > 0 && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Можно добавить переход на вкладку покупок
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Купить
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Card>
  );
};
