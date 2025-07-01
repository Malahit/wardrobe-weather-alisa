
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, Calendar, MapPin, Star } from 'lucide-react';
import { WardrobeItem } from '@/hooks/useWardrobe';

interface PersonalStylistProps {
  wardrobeItems: WardrobeItem[];
  weather: any;
}

interface StyleAdvice {
  title: string;
  description: string;
  items: string[];
  tip: string;
  confidence: number;
}

export const PersonalStylist = ({ wardrobeItems, weather }: PersonalStylistProps) => {
  const [currentAdvice, setCurrentAdvice] = useState<StyleAdvice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStyleAdvice = async () => {
    setIsGenerating(true);
    
    // Имитация работы ИИ стилиста
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const advice = analyzeStyleAndGenerateAdvice();
    setCurrentAdvice(advice);
    setIsGenerating(false);
  };

  const analyzeStyleAndGenerateAdvice = (): StyleAdvice => {
    const categories = wardrobeItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = wardrobeItems.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantColor = Object.entries(colors).sort(([,a], [,b]) => b - a)[0]?.[0] || 'нейтральный';
    const temp = weather?.temperature || 15;
    
    // Генерируем советы на основе анализа гардероба
    const adviceOptions = [
      {
        title: "Капсульный гардероб",
        description: `Ваш гардероб имеет хорошую основу в ${dominantColor} цвете. Рекомендую создать капсульную коллекцию из 10-15 базовых вещей, которые легко комбинируются между собой.`,
        items: [
          "Базовые футболки нейтральных цветов",
          "Классические джинсы",
          "Белая рубашка",
          "Черные брюки",
          "Универсальный пиджак"
        ],
        tip: "Правило 70/30: 70% базовых вещей, 30% ярких акцентов",
        confidence: 0.85
      },
      {
        title: "Цветовая гармония",
        description: `В вашем гардеробе преобладает ${dominantColor} цвет. Добавьте комплементарные оттенки для создания более гармоничных образов.`,
        items: [
          "Аксессуары контрастного цвета",
          "Яркий топ для создания акцента",
          "Нейтральные оттенки для баланса"
        ],
        tip: "Используйте правило трех цветов: основной, дополнительный и акцентный",
        confidence: 0.78
      },
      {
        title: "Сезонный стиль",
        description: `При температуре ${temp}°C рекомендую многослойность. Это позволит адаптироваться к изменениям температуры в течение дня.`,
        items: [
          "Легкий кардиган или жакет",
          "Базовый топ",
          "Удобные брюки",
          "Универсальная обувь"
        ],
        tip: temp < 15 ? "Добавьте теплые аксессуары" : "Выбирайте дышащие ткани",
        confidence: 0.90
      },
      {
        title: "Образ дня",
        description: "Создайте элегантный повседневный образ, который подойдет для работы и отдыха.",
        items: [
          "Структурированный блейзер",
          "Удобные брюки или юбка",
          "Качественная футболка",
          "Аккуратные туфли или кроссовки"
        ],
        tip: "Добавьте один яркий аксессуар для индивидуальности",
        confidence: 0.82
      }
    ];

    return adviceOptions[Math.floor(Math.random() * adviceOptions.length)];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Персональный стилист</h2>
            <p className="text-white/60">ИИ-помощник по стилю</p>
          </div>
        </div>
        
        <Button
          onClick={generateStyleAdvice}
          disabled={isGenerating || wardrobeItems.length === 0}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Анализирую...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Получить совет
            </>
          )}
        </Button>
      </div>

      {wardrobeItems.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <User className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-lg mb-2">Добавьте вещи в гардероб</p>
          <p>чтобы получить персональные советы стилиста!</p>
        </div>
      ) : currentAdvice ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 border border-pink-400/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{currentAdvice.title}</h3>
              <Badge className={`${getConfidenceColor(currentAdvice.confidence)} bg-white/10`}>
                <Star className="w-3 h-3 mr-1" />
                {Math.round(currentAdvice.confidence * 100)}%
              </Badge>
            </div>
            
            <p className="text-white/80 mb-6">{currentAdvice.description}</p>
            
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Рекомендуемые элементы:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentAdvice.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-white/70">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h5 className="text-white font-medium mb-1">Совет стилиста:</h5>
                  <p className="text-white/80 text-sm">{currentAdvice.tip}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              onClick={generateStyleAdvice}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Получить другой совет
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-white/60">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-lg mb-2">Готов помочь с выбором стиля!</p>
          <p>Нажмите кнопку выше, чтобы получить персональные рекомендации</p>
        </div>
      )}
    </Card>
  );
};
