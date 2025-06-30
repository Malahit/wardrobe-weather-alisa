
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
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
    }, 800);
  };

  useEffect(() => {
    generateSuggestions();
  }, [weather, wardrobeItems]);

  const handleSelectOutfit = (suggestion: OutfitSuggestion) => {
    setCurrentOutfit(currentOutfit?.id === suggestion.id ? null : suggestion);
  };

  if (!weather) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center py-8 text-white/60">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
            <p className="text-lg">Загрузка погодных данных...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Рекомендации образов</h2>
        </div>
        <Button
          onClick={generateSuggestions}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:scale-105 transition-all"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {wardrobeItems.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">👗</span>
          </div>
          <p className="text-lg mb-2">Добавьте вещи в гардероб</p>
          <p>чтобы получить персональные рекомендации образов!</p>
        </div>
      ) : suggestions.length === 0 && !loading ? (
        <div className="text-center py-12 text-white/60">
          <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">🤔</span>
          </div>
          <p className="text-lg mb-2">Не удалось подобрать образы</p>
          <p>для текущей погоды. Попробуйте добавить больше вещей в гардероб.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Улучшенные скелетоны загрузки
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-4 bg-white/10 border-white/20 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 bg-white/20 rounded w-20"></div>
                  <div className="h-4 bg-white/20 rounded w-4"></div>
                </div>
                <div className="space-y-3 mb-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-white/20 rounded mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-16 bg-white/20 rounded mb-4"></div>
                <div className="h-10 bg-white/20 rounded"></div>
              </Card>
            ))
          ) : (
            suggestions.map((suggestion) => (
              <OutfitSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onSelect={handleSelectOutfit}
                weather={weather}
                isSelected={currentOutfit?.id === suggestion.id}
              />
            ))
          )}
        </div>
      )}

      {currentOutfit && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 animate-fade-in">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">✨</span>
            <h3 className="text-white font-semibold text-lg">Выбранный образ</h3>
          </div>
          <p className="text-white/80 text-sm mb-4">{currentOutfit.reason}</p>
          <div className="flex flex-wrap gap-2">
            {currentOutfit.items.map((item) => (
              <span key={item.id} className="px-3 py-1 bg-blue-600/30 rounded-full text-white text-sm border border-blue-400/50">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
