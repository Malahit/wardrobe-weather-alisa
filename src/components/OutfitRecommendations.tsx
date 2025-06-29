
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OutfitRecommendationsProps {
  weather: any;
  wardrobeItems: any[];
  currentOutfit: any;
  setCurrentOutfit: (outfit: any) => void;
}

export const OutfitRecommendations = ({ 
  weather, 
  wardrobeItems, 
  currentOutfit, 
  setCurrentOutfit 
}: OutfitRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (weather) {
      // Генерируем рекомендации на основе погоды
      const outfits = [
        {
          id: 1,
          name: "Дождливый день",
          description: "Идеально для дождливой погоды",
          items: ["Дождевик", "Джинсы", "Ботинки"],
          comfort: "Высокий",
          style: "Casual"
        },
        {
          id: 2,
          name: "Прохладная погода",
          description: "Комфортно при температуре до 15°C",
          items: ["Свитер", "Брюки", "Кроссовки"],
          comfort: "Средний",
          style: "Smart Casual"
        },
        {
          id: 3,
          name: "Офисный стиль",
          description: "Подходит для работы в прохладную погоду",
          items: ["Блузка", "Пиджак", "Туфли"],
          comfort: "Средний",
          style: "Business"
        }
      ];
      setRecommendations(outfits);
    }
  }, [weather]);

  if (!weather) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-white/60">Загрузка рекомендаций...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Рекомендации образов</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((outfit) => (
          <Card 
            key={outfit.id} 
            className="p-4 bg-white/10 border-white/20 hover:bg-white/15 transition-all hover-scale cursor-pointer"
            onClick={() => setCurrentOutfit(outfit)}
          >
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👗</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{outfit.name}</h3>
              <p className="text-white/70 text-sm">{outfit.description}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              {outfit.items.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-white/20 text-white/80 mr-1">
                  {item}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Комфорт: {outfit.comfort}</span>
              <span className="text-white/60">Стиль: {outfit.style}</span>
            </div>
            
            <Button 
              className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentOutfit(outfit);
              }}
            >
              Выбрать образ
            </Button>
          </Card>
        ))}
      </div>

      {currentOutfit && (
        <div className="mt-6 p-4 bg-white/20 rounded-lg border border-white/30">
          <h3 className="text-white font-semibold mb-2">Выбранный образ: {currentOutfit.name}</h3>
          <p className="text-white/80 text-sm">{currentOutfit.description}</p>
        </div>
      )}
    </Card>
  );
};
