
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { OutfitSuggestionCard } from "./OutfitSuggestionCard";
import { generateOutfitSuggestions, OutfitSuggestion } from "@/services/outfitService";
import { WardrobeItem } from "@/hooks/useWardrobe";

interface OutfitRecommendationsProps {
  weather: any;
  wardrobeItems: WardrobeItem[];
  currentOutfit: OutfitSuggestion | null;
  setCurrentOutfit: (outfit: OutfitSuggestion | null) => void;
}

export const OutfitRecommendations = ({ 
  weather, 
  wardrobeItems, 
  currentOutfit, 
  setCurrentOutfit 
}: OutfitRecommendationsProps) => {
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = () => {
    if (!weather || !wardrobeItems.length) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newSuggestions = generateOutfitSuggestions(wardrobeItems, weather);
      setSuggestions(newSuggestions);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    generateSuggestions();
  }, [weather, wardrobeItems]);

  const handleSelectOutfit = (suggestion: OutfitSuggestion) => {
    setCurrentOutfit(currentOutfit?.id === suggestion.id ? null : suggestion);
  };

  const handleSaveOutfit = (suggestion: OutfitSuggestion) => {
    // TODO: Реализовать сохранение образа в базу данных
    console.log('Сохранение образа:', suggestion);
  };

  if (!weather) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center py-8 text-white/60">
          <p className="text-lg">Загрузка погодных данных...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Рекомендации образов</h2>
        <Button
          onClick={generateSuggestions}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {wardrobeItems.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <p className="text-lg mb-2">Добавьте вещи в гардероб</p>
          <p>чтобы получить персональные рекомендации образов!</p>
        </div>
      ) : suggestions.length === 0 && !loading ? (
        <div className="text-center py-8 text-white/60">
          <p className="text-lg mb-2">Не удалось подобрать образы</p>
          <p>для текущей погоды. Попробуйте добавить больше вещей в гардероб.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            // Скелетоны загрузки
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-4 bg-white/10 border-white/20 animate-pulse">
                <div className="h-32 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
              </Card>
            ))
          ) : (
            suggestions.map((suggestion) => (
              <OutfitSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onSelect={handleSelectOutfit}
                onSave={handleSaveOutfit}
                isSelected={currentOutfit?.id === suggestion.id}
              />
            ))
          )}
        </div>
      )}

      {currentOutfit && (
        <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
          <h3 className="text-white font-semibold mb-2">Выбранный образ:</h3>
          <p className="text-white/80 text-sm mb-3">{currentOutfit.reason}</p>
          <div className="flex flex-wrap gap-2">
            {currentOutfit.items.map((item) => (
              <span key={item.id} className="px-2 py-1 bg-blue-600/30 rounded text-white text-xs">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
