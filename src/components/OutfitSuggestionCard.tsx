
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { OutfitSuggestion } from "@/services/outfitService";
import { SaveOutfitDialog } from "./SaveOutfitDialog";

interface OutfitSuggestionCardProps {
  suggestion: OutfitSuggestion;
  onSelect: (suggestion: OutfitSuggestion) => void;
  weather?: any;
  isSelected?: boolean;
}

export const OutfitSuggestionCard = ({ 
  suggestion, 
  onSelect, 
  weather,
  isSelected = false 
}: OutfitSuggestionCardProps) => {
  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'top': 'Верх',
      'bottom': 'Низ',
      'shoes': 'Обувь',
      'outerwear': 'Верхняя одежда',
      'accessories': 'Аксессуары'
    };
    return labels[category] || category;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return '🔥';
    if (score >= 80) return '⭐';
    if (score >= 60) return '👍';
    return '🤔';
  };

  return (
    <Card className={`p-4 transition-all hover:shadow-lg hover-scale ${
      isSelected ? 'ring-2 ring-blue-400 bg-blue-50/20' : 'bg-white/10 backdrop-blur-lg border-white/20'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getScoreIcon(suggestion.score)}</span>
          <div className="flex items-center space-x-1">
            <Star className={`w-4 h-4 ${getScoreColor(suggestion.score)}`} />
            <span className={`text-sm font-medium ${getScoreColor(suggestion.score)}`}>
              {suggestion.score}/100
            </span>
          </div>
        </div>
        <SaveOutfitDialog outfit={suggestion} weather={weather} />
      </div>

      <div className="space-y-3 mb-4">
        {suggestion.items.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-2">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">
                {item.category === 'top' ? '👕' : 
                 item.category === 'bottom' ? '👖' :
                 item.category === 'shoes' ? '👟' :
                 item.category === 'outerwear' ? '🧥' : '🎀'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{item.name}</p>
              {item.brand && (
                <p className="text-white/60 text-xs">{item.brand}</p>
              )}
              <div className="flex gap-1 mt-1">
                <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                  {getCategoryLabel(item.category)}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                  {item.color}
                </Badge>
                {item.times_worn > 0 && (
                  <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                    {item.times_worn}×
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 p-3 bg-white/10 rounded-lg">
        <p className="text-white/80 text-sm leading-relaxed">{suggestion.reason}</p>
      </div>

      {/* Дополнительная информация */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="text-xs bg-indigo-500/20 text-indigo-200">
          Совместимость цветов: {suggestion.items.length > 1 ? 'Хорошая' : 'Отлично'}
        </Badge>
        {weather && (
          <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200">
            Для {weather.temperature}°C
          </Badge>
        )}
      </div>

      <Button 
        onClick={() => onSelect(suggestion)}
        className={`w-full transition-all ${
          isSelected 
            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg scale-105' 
            : 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:scale-105'
        }`}
      >
        {isSelected ? '✅ Выбран' : 'Выбрать образ'}
      </Button>
    </Card>
  );
};
