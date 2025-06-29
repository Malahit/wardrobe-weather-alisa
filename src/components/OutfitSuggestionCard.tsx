
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { OutfitSuggestion } from "@/services/outfitService";

interface OutfitSuggestionCardProps {
  suggestion: OutfitSuggestion;
  onSelect: (suggestion: OutfitSuggestion) => void;
  onSave?: (suggestion: OutfitSuggestion) => void;
  isSelected?: boolean;
}

export const OutfitSuggestionCard = ({ 
  suggestion, 
  onSelect, 
  onSave,
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`p-4 transition-all hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'bg-white/10 backdrop-blur-lg border-white/20'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Star className={`w-4 h-4 ${getScoreColor(suggestion.score)}`} />
          <span className={`text-sm font-medium ${getScoreColor(suggestion.score)}`}>
            {suggestion.score}/100
          </span>
        </div>
        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(suggestion)}
            className="text-white/60 hover:text-red-400 hover:bg-white/10"
          >
            <Heart className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {suggestion.items.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">
                {item.category === 'top' ? '👕' : 
                 item.category === 'bottom' ? '👖' :
                 item.category === 'shoes' ? '👟' :
                 item.category === 'outerwear' ? '🧥' : '🎀'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{item.name}</p>
              <div className="flex gap-1 mt-1">
                <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                  {getCategoryLabel(item.category)}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                  {item.color}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-white/80 text-sm">{suggestion.reason}</p>
      </div>

      <Button 
        onClick={() => onSelect(suggestion)}
        className={`w-full ${
          isSelected 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
        }`}
      >
        {isSelected ? 'Выбран' : 'Выбрать образ'}
      </Button>
    </Card>
  );
};
