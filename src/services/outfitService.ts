
import { WardrobeItem } from '@/hooks/useWardrobe';

export interface OutfitSuggestion {
  id: string;
  items: WardrobeItem[];
  score: number;
  reason: string;
}

export const generateOutfitSuggestions = (
  wardrobeItems: WardrobeItem[],
  weather: { temperature: number; condition: string; humidity: number }
): OutfitSuggestion[] => {
  if (!wardrobeItems.length) return [];

  const { temperature, condition, humidity } = weather;
  const suggestions: OutfitSuggestion[] = [];

  // Фильтруем вещи по температуре и сезону
  const suitableItems = wardrobeItems.filter(item => {
    const tempMatch = 
      (!item.temperature_min || temperature >= item.temperature_min) &&
      (!item.temperature_max || temperature <= item.temperature_max);
    
    const seasonMatch = getSuitableSeasons(temperature).includes(item.season) || 
                       item.season === 'all-season';
    
    return tempMatch && seasonMatch;
  });

  // Группируем по категориям
  const itemsByCategory = groupByCategory(suitableItems);

  // Генерируем комбинации образов
  const combinations = generateCombinations(itemsByCategory, weather);
  
  combinations.forEach((combo, index) => {
    const score = calculateOutfitScore(combo, weather);
    const reason = generateOutfitReason(combo, weather);
    
    suggestions.push({
      id: `outfit-${index}`,
      items: combo,
      score,
      reason
    });
  });

  // Сортируем по рейтингу и возвращаем топ-5
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

const getSuitableSeasons = (temperature: number): string[] => {
  if (temperature <= 0) return ['winter'];
  if (temperature <= 10) return ['winter', 'autumn'];
  if (temperature <= 20) return ['autumn', 'spring'];
  if (temperature <= 25) return ['spring', 'summer'];
  return ['summer'];
};

const groupByCategory = (items: WardrobeItem[]) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: WardrobeItem[] });
};

const generateCombinations = (
  itemsByCategory: { [key: string]: WardrobeItem[] },
  weather: { temperature: number; condition: string }
): WardrobeItem[][] => {
  const combinations: WardrobeItem[][] = [];
  const { temperature, condition } = weather;

  // Базовые комбинации в зависимости от температуры
  if (temperature <= 5) {
    // Холодная погода: верхняя одежда обязательна
    generateColdWeatherOutfits(itemsByCategory, combinations);
  } else if (temperature <= 15) {
    // Прохладная погода
    generateCoolWeatherOutfits(itemsByCategory, combinations);
  } else if (temperature <= 25) {
    // Теплая погода
    generateWarmWeatherOutfits(itemsByCategory, combinations);
  } else {
    // Жаркая погода
    generateHotWeatherOutfits(itemsByCategory, combinations);
  }

  return combinations;
};

const generateColdWeatherOutfits = (
  itemsByCategory: { [key: string]: WardrobeItem[] },
  combinations: WardrobeItem[][]
) => {
  const tops = itemsByCategory['top'] || [];
  const bottoms = itemsByCategory['bottom'] || [];
  const outerwear = itemsByCategory['outerwear'] || [];
  const shoes = itemsByCategory['shoes'] || [];

  outerwear.forEach(coat => {
    tops.forEach(top => {
      bottoms.forEach(bottom => {
        shoes.forEach(shoe => {
          combinations.push([coat, top, bottom, shoe]);
        });
      });
    });
  });
};

const generateCoolWeatherOutfits = (
  itemsByCategory: { [key: string]: WardrobeItem[] },
  combinations: WardrobeItem[][]
) => {
  const tops = itemsByCategory['top'] || [];
  const bottoms = itemsByCategory['bottom'] || [];
  const outerwear = itemsByCategory['outerwear'] || [];
  const shoes = itemsByCategory['shoes'] || [];

  // С верхней одеждой
  outerwear.forEach(coat => {
    tops.forEach(top => {
      bottoms.forEach(bottom => {
        shoes.forEach(shoe => {
          combinations.push([coat, top, bottom, shoe]);
        });
      });
    });
  });

  // Без верхней одежды
  tops.forEach(top => {
    bottoms.forEach(bottom => {
      shoes.forEach(shoe => {
        combinations.push([top, bottom, shoe]);
      });
    });
  });
};

const generateWarmWeatherOutfits = (
  itemsByCategory: { [key: string]: WardrobeItem[] },
  combinations: WardrobeItem[][]
) => {
  const tops = itemsByCategory['top'] || [];
  const bottoms = itemsByCategory['bottom'] || [];
  const shoes = itemsByCategory['shoes'] || [];

  tops.forEach(top => {
    bottoms.forEach(bottom => {
      shoes.forEach(shoe => {
        combinations.push([top, bottom, shoe]);
      });
    });
  });
};

const generateHotWeatherOutfits = (
  itemsByCategory: { [key: string]: WardrobeItem[] },
  combinations: WardrobeItem[][]
) => {
  const tops = (itemsByCategory['top'] || []).filter(item => 
    item.color === 'белый' || item.color === 'светлый' || 
    item.name.toLowerCase().includes('футболка') ||
    item.name.toLowerCase().includes('майка')
  );
  const bottoms = (itemsByCategory['bottom'] || []).filter(item =>
    item.name.toLowerCase().includes('шорты') ||
    item.name.toLowerCase().includes('юбка')
  );
  const shoes = itemsByCategory['shoes'] || [];

  tops.forEach(top => {
    bottoms.forEach(bottom => {
      shoes.forEach(shoe => {
        combinations.push([top, bottom, shoe]);
      });
    });
  });
};

const calculateOutfitScore = (
  items: WardrobeItem[],
  weather: { temperature: number; condition: string; humidity: number }
): number => {
  let score = 50; // базовый рейтинг

  // Бонусы за соответствие температуре
  items.forEach(item => {
    if (item.temperature_min && item.temperature_max) {
      const tempRange = item.temperature_max - item.temperature_min;
      const tempDiff = Math.abs(weather.temperature - ((item.temperature_min + item.temperature_max) / 2));
      score += Math.max(0, (tempRange - tempDiff) / tempRange * 20);
    }
  });

  // Бонус за частоту использования (редко носимые вещи получают бонус)
  const avgTimesWorn = items.reduce((sum, item) => sum + item.times_worn, 0) / items.length;
  if (avgTimesWorn < 5) score += 10;

  // Штраф за повторение недавно надетых вещей
  const recentlyWorn = items.some(item => {
    if (!item.last_worn) return false;
    const daysSince = Math.floor((Date.now() - new Date(item.last_worn).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince < 7;
  });
  if (recentlyWorn) score -= 15;

  // Бонус за цветовую гармонию
  const colors = items.map(item => item.color.toLowerCase());
  if (hasColorHarmony(colors)) score += 15;

  return Math.min(100, Math.max(0, score));
};

const hasColorHarmony = (colors: string[]): boolean => {
  const neutrals = ['черный', 'белый', 'серый', 'бежевый', 'коричневый'];
  const hasNeutral = colors.some(color => neutrals.includes(color));
  
  if (hasNeutral) return true;
  
  // Проверяем на монохромность
  const uniqueColors = [...new Set(colors)];
  if (uniqueColors.length <= 2) return true;
  
  return false;
};

const generateOutfitReason = (
  items: WardrobeItem[],
  weather: { temperature: number; condition: string }
): string => {
  const { temperature, condition } = weather;
  
  if (temperature <= 5) {
    return `Теплый образ для холодной погоды ${temperature}°C. ${condition.includes('снег') ? 'Защита от снега.' : ''}`;
  } else if (temperature <= 15) {
    return `Комфортный образ для прохладной погоды ${temperature}°C. Легко снять лишний слой при потеплении.`;
  } else if (temperature <= 25) {
    return `Стильный образ для приятной погоды ${temperature}°C. Идеально для прогулок.`;
  } else {
    return `Легкий образ для жаркой погоды ${temperature}°C. Светлые тона и дышащие материалы.`;
  }
};
