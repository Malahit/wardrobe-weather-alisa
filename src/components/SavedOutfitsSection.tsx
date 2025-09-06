
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSavedOutfits } from "@/hooks/useSavedOutfits";
import { useWardrobe } from "@/hooks/useWardrobe";
import { Star, Trash2, Play, Calendar } from "lucide-react";
import { useState } from "react";

export const SavedOutfitsSection = () => {
  const { toast } = useToast();
  const { savedOutfits, loading, deleteOutfit, useOutfit, rateOutfit } = useSavedOutfits();
  const { items: wardrobeItems } = useWardrobe();
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);

  const handleDeleteOutfit = async (id: string) => {
    const result = await deleteOutfit(id);
    
    if (result.success) {
      toast({
        title: "Удалено",
        description: "Образ удален из сохраненных"
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить образ",
        variant: "destructive"
      });
    }
  };

  const handleUseOutfit = async (id: string) => {
    const result = await useOutfit(id);
    
    if (result.success) {
      toast({
        title: "Использован",
        description: "Образ отмечен как использованный сегодня"
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось отметить использование",
        variant: "destructive"
      });
    }
  };

  const handleRateOutfit = async (id: string, rating: number) => {
    const result = await rateOutfit(id, rating);
    
    if (result.success) {
      toast({
        title: "Оценено",
        description: `Образ оценен на ${rating} звезд`
      });
    }
  };

  const getOutfitItems = (itemIds: string[]) => {
    return wardrobeItems.filter(item => itemIds.includes(item.id));
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center py-12 text-white/60">
          <p className="text-lg">Загрузка сохраненных образов...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Сохраненные образы</h2>
        <Badge variant="secondary" className="bg-white/20 text-white/80">
          {savedOutfits.length} образов
        </Badge>
      </div>

      {savedOutfits.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <p className="text-lg mb-4">У вас нет сохраненных образов</p>
          <p>Сохраните понравившиеся образы из рекомендаций!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedOutfits.map((outfit) => {
            const items = getOutfitItems(outfit.item_ids);
            
            return (
              <Card 
                key={outfit.id} 
                className={`p-4 transition-all hover:shadow-lg ${
                  selectedOutfit === outfit.id 
                    ? 'ring-2 ring-blue-400 bg-blue-50/20' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                } hover-scale`}
                onClick={() => setSelectedOutfit(selectedOutfit === outfit.id ? null : outfit.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white text-lg">{outfit.name}</h3>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRateOutfit(outfit.id, star);
                        }}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            outfit.rating && star <= outfit.rating ? 'fill-current' : ''
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {outfit.weather_context?.reason && (
                  <p className="text-white/70 text-sm mb-3">{outfit.weather_context.reason}</p>
                )}

                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                        <span className="text-xs">
                          {item.category === 'top' ? '👕' : 
                           item.category === 'bottom' ? '👖' :
                           item.category === 'shoes' ? '👟' :
                           item.category === 'outerwear' ? '🧥' : '🎀'}
                        </span>
                      </div>
                      <span className="text-white/80 text-sm">{item.name}</span>
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white/70">
                        {item.color}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {outfit.weather_context?.condition && (
                    <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200">
                      {outfit.weather_context.condition}
                    </Badge>
                  )}
                  {outfit.weather_context?.temperature && (
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-200">
                      {outfit.weather_context.temperature}°C
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                    Использован: {outfit.times_used} раз
                  </Badge>
                </div>

                {outfit.last_used && (
                  <p className="text-white/60 text-xs mb-3">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Последний раз: {new Date(outfit.last_used).toLocaleDateString('ru-RU')}
                  </p>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseOutfit(outfit.id);
                    }}
                    className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-200 border-green-400/30"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Надеть
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOutfit(outfit.id);
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Card>
  );
};
