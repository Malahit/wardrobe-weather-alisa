
import { useState, useEffect } from "react";
import { WildberriesIntegration } from "./WildberriesIntegration";
import { WardrobeItem } from "@/hooks/useWardrobe";

interface MarketplaceRecommendationsProps {
  weather: any;
  wardrobeItems: WardrobeItem[];
}

export const MarketplaceRecommendations = ({ weather, wardrobeItems }: MarketplaceRecommendationsProps) => {
  const [wardrobeGaps, setWardrobeGaps] = useState<string[]>([]);

  useEffect(() => {
    analyzeWardrobeGaps();
  }, [wardrobeItems, weather]);

  const analyzeWardrobeGaps = () => {
    const categories = ['top', 'bottom', 'shoes', 'outerwear'];
    const seasons = ['summer', 'autumn', 'winter', 'spring'];
    const gaps: string[] = [];

    // Анализируем пробелы в гардеробе
    categories.forEach(category => {
      const itemsInCategory = wardrobeItems.filter(item => item.category === category);
      
      if (itemsInCategory.length === 0) {
        const categoryNames = {
          'top': 'верх',
          'bottom': 'низ', 
          'shoes': 'обувь',
          'outerwear': 'верхняя одежда'
        };
        gaps.push(categoryNames[category as keyof typeof categoryNames]);
      }
    });

    // Анализируем по сезонам
    const currentSeason = getCurrentSeason(weather?.temperature || 15);
    const seasonItems = wardrobeItems.filter(item => 
      item.season === currentSeason || item.season === 'all-season'
    );

    if (seasonItems.length < 3) {
      gaps.push(`одежда для ${getSeasonName(currentSeason)}`);
    }

    // Анализируем по цветам
    const colors = [...new Set(wardrobeItems.map(item => item.color))];
    if (colors.length < 3) {
      gaps.push('разнообразие цветов');
    }

    setWardrobeGaps(gaps);
  };

  const getCurrentSeason = (temperature: number): string => {
    if (temperature <= 5) return 'winter';
    if (temperature <= 15) return 'autumn';
    if (temperature <= 25) return 'spring';
    return 'summer';
  };

  const getSeasonName = (season: string): string => {
    const names = {
      'winter': 'зимы',
      'autumn': 'осени',
      'spring': 'весны', 
      'summer': 'лета'
    };
    return names[season as keyof typeof names] || season;
  };

  return (
    <div className="space-y-6">
      <WildberriesIntegration
        weather={weather}
        wardrobeGaps={wardrobeGaps}
        category=""
      />
    </div>
  );
};
