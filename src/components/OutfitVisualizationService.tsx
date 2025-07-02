
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Image, ExternalLink, Heart, Star } from 'lucide-react';

interface OutfitIdea {
  id: string;
  title: string;
  description: string;
  style: string;
  occasion: string;
  items: string[];
  imageUrl: string;
  sourceUrl?: string;
  rating: number;
}

const SAMPLE_OUTFITS: OutfitIdea[] = [
  {
    id: '1',
    title: 'Деловой классический образ',
    description: 'Элегантный деловой стиль для офиса',
    style: 'business',
    occasion: 'work',
    items: ['Темный костюм', 'Белая рубашка', 'Классические туфли', 'Кожаный портфель'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    rating: 4.8
  },
  {
    id: '2',
    title: 'Кэжуал для прогулок',
    description: 'Удобный стиль для повседневной жизни',
    style: 'casual',
    occasion: 'daily',
    items: ['Джинсы', 'Хлопковая футболка', 'Кроссовки', 'Легкая куртка'],
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
    rating: 4.6
  },
  {
    id: '3',
    title: 'Романтический вечерний образ',
    description: 'Нежный образ для особых случаев',
    style: 'romantic',
    occasion: 'evening',
    items: ['Платье', 'Туфли на каблуке', 'Клатч', 'Украшения'],
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
    rating: 4.9
  },
  {
    id: '4',
    title: 'Спортивный стиль',
    description: 'Активный образ для тренировок',
    style: 'sporty',
    occasion: 'sport',
    items: ['Леггинсы', 'Спортивный топ', 'Кроссовки', 'Ветровка'],
    imageUrl: 'https://images.unsplash.com/photo-1506629905607-d9f02e62059c?w=400&h=600&fit=crop',
    rating: 4.7
  },
  {
    id: '5',
    title: 'Бохо-шик',
    description: 'Свободный богемный стиль',
    style: 'boho',
    occasion: 'leisure',
    items: ['Макси-платье', 'Сандалии', 'Широкополая шляпа', 'Этнические украшения'],
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
    rating: 4.5
  },
  {
    id: '6',
    title: 'Стритстайл',
    description: 'Модный уличный образ',
    style: 'street',
    occasion: 'daily',
    items: ['Рваные джинсы', 'Оверсайз толстовка', 'Высокие кеды', 'Бейсболка'],
    imageUrl: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=400&h=600&fit=crop',
    rating: 4.4
  }
];

interface OutfitVisualizationServiceProps {
  searchQuery?: string;
  styleFilter?: string;
}

export const OutfitVisualizationService = ({ 
  searchQuery = '', 
  styleFilter = 'all' 
}: OutfitVisualizationServiceProps) => {
  const [outfits, setOutfits] = useState<OutfitIdea[]>(SAMPLE_OUTFITS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedStyle, setSelectedStyle] = useState(styleFilter);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const searchOutfits = async () => {
    setLoading(true);
    // Имитация поиска в интернете
    setTimeout(() => {
      let filtered = SAMPLE_OUTFITS;
      
      if (searchTerm) {
        filtered = filtered.filter(outfit => 
          outfit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          outfit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          outfit.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (selectedStyle && selectedStyle !== 'all') {
        filtered = filtered.filter(outfit => outfit.style === selectedStyle);
      }
      
      setOutfits(filtered);
      setLoading(false);
    }, 1000);
  };

  const toggleFavorite = (outfitId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(outfitId)) {
        newFavorites.delete(outfitId);
      } else {
        newFavorites.add(outfitId);
      }
      return newFavorites;
    });
  };

  const styleOptions = [
    { value: 'all', label: 'Все стили' },
    { value: 'business', label: 'Деловой' },
    { value: 'casual', label: 'Кэжуал' },
    { value: 'romantic', label: 'Романтический' },
    { value: 'sporty', label: 'Спортивный' },
    { value: 'boho', label: 'Бохо' },
    { value: 'street', label: 'Стритстайл' }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
          <Image className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Галерея образов</h2>
      </div>

      {/* Поиск и фильтры */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск образов (например: деловой, вечерний, кэжуал...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70"
            />
          </div>
          <Button 
            onClick={searchOutfits}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Поиск...' : 'Найти'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {styleOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedStyle === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStyle(option.value)}
              className={selectedStyle === option.value 
                ? "bg-indigo-600 hover:bg-indigo-700" 
                : "hover:bg-indigo-50"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Результаты поиска */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit) => (
            <Card key={outfit.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white/70 backdrop-blur-sm">
              <div className="relative">
                <img 
                  src={outfit.imageUrl} 
                  alt={outfit.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(outfit.id)}
                    className={`p-2 rounded-full ${
                      favorites.has(outfit.id) 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{outfit.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{outfit.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{outfit.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {outfit.items.slice(0, 3).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {outfit.items.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{outfit.items.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge className="bg-indigo-100 text-indigo-800">
                    {styleOptions.find(s => s.value === outfit.style)?.label || outfit.style}
                  </Badge>
                  {outfit.sourceUrl && (
                    <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {outfits.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-600">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Образы не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </Card>
  );
};
