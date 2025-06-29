
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WardrobeItem } from "@/hooks/useWardrobe";

interface WardrobeItemCardProps {
  item: WardrobeItem;
  onRemove: (id: string) => void;
}

const categoryLabels = {
  'top': 'Верх',
  'bottom': 'Низ', 
  'shoes': 'Обувь',
  'outerwear': 'Верхняя одежда',
  'accessories': 'Аксессуары'
} as const;

const seasonLabels = {
  'spring': 'Весна',
  'summer': 'Лето',
  'autumn': 'Осень',
  'winter': 'Зима',
  'all-season': 'Всесезон'
} as const;

export const WardrobeItemCard = ({ item, onRemove }: WardrobeItemCardProps) => {
  const getCategoryLabel = (category: string) => {
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const getSeasonLabel = (season: string) => {
    return seasonLabels[season as keyof typeof seasonLabels] || season;
  };

  return (
    <Card className="p-4 bg-white/10 border-white/20 hover:bg-white/15 transition-all hover-scale">
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-2xl">👕</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{item.name}</h3>
          {item.brand && (
            <p className="text-sm text-white/70 mb-2">{item.brand}</p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
              {getCategoryLabel(item.category)}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
              {item.color}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
              {getSeasonLabel(item.season)}
            </Badge>
          </div>
          {(item.temperature_min || item.temperature_max) && (
            <p className="text-xs text-white/60 mb-2">
              {item.temperature_min && item.temperature_max 
                ? `${item.temperature_min}°C - ${item.temperature_max}°C`
                : item.temperature_min 
                ? `от ${item.temperature_min}°C`
                : `до ${item.temperature_max}°C`
              }
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="mt-2 text-white/60 hover:text-white hover:bg-white/10"
          >
            Удалить
          </Button>
        </div>
      </div>
    </Card>
  );
};
