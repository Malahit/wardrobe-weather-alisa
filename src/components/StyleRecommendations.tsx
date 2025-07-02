
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Star, Zap, Crown } from 'lucide-react';

interface StyleType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  colors: string[];
  pieces: string[];
  occasions: string[];
  icon: React.ReactNode;
  tips: string[];
}

const popularStyles: StyleType[] = [
  {
    id: 'casual',
    name: 'Кэжуал',
    description: 'Удобный и расслабленный стиль для повседневной жизни',
    characteristics: ['Комфорт', 'Практичность', 'Простота'],
    colors: ['Синий', 'Серый', 'Белый', 'Черный', 'Бежевый'],
    pieces: ['Джинсы', 'Футболки', 'Кроссовки', 'Худи', 'Кардиганы'],
    occasions: ['Прогулки', 'Шоппинг', 'Встречи с друзьями', 'Дома'],
    icon: <Heart className="w-6 h-6" />,
    tips: [
      'Сочетайте джинсы с простыми футболками или рубашками',
      'Добавляйте яркие аксессуары для разнообразия',
      'Выбирайте удобную обувь на каждый день'
    ]
  },
  {
    id: 'business',
    name: 'Деловой',
    description: 'Строгий и элегантный стиль для офиса и деловых встреч',
    characteristics: ['Строгость', 'Элегантность', 'Профессионализм'],
    colors: ['Черный', 'Серый', 'Темно-синий', 'Белый', 'Бордовый'],
    pieces: ['Костюмы', 'Блузки', 'Брюки', 'Юбки', 'Туфли на каблуке'],
    occasions: ['Офис', 'Деловые встречи', 'Презентации', 'Конференции'],
    icon: <Crown className="w-6 h-6" />,
    tips: [
      'Соблюдайте дресс-код компании',
      'Инвестируйте в качественные базовые вещи',
      'Используйте минимум аксессуаров, но качественных'
    ]
  },
  {
    id: 'romantic',
    name: 'Романтический',
    description: 'Женственный и нежный стиль с акцентом на мягкость',
    characteristics: ['Женственность', 'Нежность', 'Изящество'],
    colors: ['Розовый', 'Персиковый', 'Молочный', 'Лавандовый', 'Мятный'],
    pieces: ['Платья', 'Блузки с рюшами', 'Юбки', 'Кардиганы', 'Балетки'],
    occasions: ['Свидания', 'Романтические ужины', 'Прогулки', 'Кафе'],
    icon: <Sparkles className="w-6 h-6" />,
    tips: [
      'Используйте ткани с мягкой текстурой',
      'Добавляйте цветочные принты и кружева',
      'Выбирайте пастельные оттенки'
    ]
  },
  {
    id: 'sporty',
    name: 'Спортивный',
    description: 'Активный и энергичный стиль для спорта и активного отдыха',
    characteristics: ['Активность', 'Комфорт', 'Функциональность'],
    colors: ['Черный', 'Белый', 'Яркие акценты', 'Серый', 'Неон'],
    pieces: ['Леггинсы', 'Топы', 'Кроссовки', 'Ветровки', 'Рюкзаки'],
    occasions: ['Спортзал', 'Пробежки', 'Йога', 'Активный отдых'],
    icon: <Zap className="w-6 h-6" />,
    tips: [
      'Выбирайте дышащие материалы',
      'Сочетайте спортивные вещи с повседневными',
      'Используйте яркие цвета для мотивации'
    ]
  },
  {
    id: 'boho',
    name: 'Бохо',
    description: 'Свободный и творческий стиль с этническими мотивами',
    characteristics: ['Свобода', 'Креативность', 'Этничность'],
    colors: ['Терракотовый', 'Оливковый', 'Горчичный', 'Коричневый', 'Бордовый'],
    pieces: ['Макси-платья', 'Кимоно', 'Широкие брюки', 'Сандалии', 'Шляпы'],
    occasions: ['Фестивали', 'Путешествия', 'Творческие мероприятия', 'Прогулки'],
    icon: <Star className="w-6 h-6" />,
    tips: [
      'Миксуйте текстуры и принты',
      'Добавляйте этнические аксессуары',
      'Используйте натуральные ткани'
    ]
  }
];

export const StyleRecommendations = () => {
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null);

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Популярные стили</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {popularStyles.map((style) => (
          <Card 
            key={style.id} 
            className={`p-4 cursor-pointer transition-all hover:shadow-lg hover-scale ${
              selectedStyle?.id === style.id 
                ? 'ring-2 ring-yellow-400 bg-yellow-50/20' 
                : 'bg-white/10 backdrop-blur-lg border-white/20'
            }`}
            onClick={() => setSelectedStyle(selectedStyle?.id === style.id ? null : style)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-white">
                {style.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{style.name}</h3>
            </div>
            
            <p className="text-white/80 text-sm mb-3">{style.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {style.characteristics.map((char, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-white/20 text-white/80">
                  {char}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {style.colors.slice(0, 3).map((color, index) => (
                <span key={index} className="text-xs text-white/60">
                  {color}{index < 2 ? ', ' : ''}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {selectedStyle && (
        <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-white">
              {selectedStyle.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{selectedStyle.name}</h3>
              <p className="text-white/80">{selectedStyle.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Основные цвета:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStyle.colors.map((color, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white/80">
                    {color}
                  </Badge>
                ))}
              </div>

              <h4 className="text-white font-semibold mb-2">Базовые вещи:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStyle.pieces.map((piece, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-200">
                    {piece}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Подходящие случаи:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStyle.occasions.map((occasion, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-200">
                    {occasion}
                  </Badge>
                ))}
              </div>

              <h4 className="text-white font-semibold mb-2">Советы стилиста:</h4>
              <ul className="space-y-2">
                {selectedStyle.tips.map((tip, index) => (
                  <li key={index} className="text-white/80 text-sm flex items-start space-x-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button 
            onClick={() => setSelectedStyle(null)}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Закрыть
          </Button>
        </Card>
      )}
    </Card>
  );
};
