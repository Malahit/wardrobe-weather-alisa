
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Image, Heart, Star, RefreshCw, Clock, Plus, MessageSquare } from 'lucide-react';
import { useOutfitTemplates, OutfitTemplate } from '@/hooks/useOutfitTemplates';
import { OutfitTemplateForm } from './OutfitTemplateForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DynamicOutfitGalleryProps {
  weather?: any;
}

export const DynamicOutfitGallery = ({ weather }: DynamicOutfitGalleryProps) => {
  const { templates, loading, fetchTemplates, submitTrainingData } = useOutfitTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [feedbackDialog, setFeedbackDialog] = useState<{open: boolean, template: OutfitTemplate | null}>({
    open: false,
    template: null
  });
  const [feedbackData, setFeedbackData] = useState({
    feedback: '',
    rating: 5
  });

  useEffect(() => {
    fetchTemplates(weather);
  }, [weather]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.clothing_items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStyle = selectedStyle === 'all' || template.style_category === selectedStyle;
    
    return matchesSearch && matchesStyle;
  });

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  const openFeedbackDialog = (template: OutfitTemplate) => {
    setFeedbackDialog({ open: true, template });
    setFeedbackData({ feedback: '', rating: 5 });
  };

  const submitFeedback = async () => {
    if (!feedbackDialog.template) return;
    
    await submitTrainingData(
      feedbackDialog.template.id,
      feedbackData.feedback,
      feedbackData.rating,
      weather
    );
    
    setFeedbackDialog({ open: false, template: null });
  };

  const styleOptions = [
    { value: 'all', label: 'Все стили' },
    { value: 'business', label: 'Деловой' },
    { value: 'casual', label: 'Кэжуал' },
    { value: 'formal', label: 'Формальный' },
    { value: 'street', label: 'Уличный' },
    { value: 'sporty', label: 'Спортивный' },
    { value: 'romantic', label: 'Романтический' },
    { value: 'boho', label: 'Бохо' },
    { value: 'minimalist', label: 'Минимализм' }
  ];

  const getTemperatureText = (template: OutfitTemplate) => {
    if (template.temperature_min && template.temperature_max) {
      return `${template.temperature_min}°C - ${template.temperature_max}°C`;
    } else if (template.temperature_min) {
      return `от ${template.temperature_min}°C`;
    } else if (template.temperature_max) {
      return `до ${template.temperature_max}°C`;
    }
    return null;
  };

  const isWeatherSuitable = (template: OutfitTemplate) => {
    if (!weather) return false;
    
    const temp = weather.temperature;
    const tempSuitable = (!template.temperature_min || temp >= template.temperature_min) &&
                        (!template.temperature_max || temp <= template.temperature_max);
    
    return tempSuitable;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Галерея образов</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Подобрано по погоде: {weather?.temperature}°C</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <OutfitTemplateForm weather={weather} />
            <Button 
              onClick={() => fetchTemplates(weather)}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск образов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70"
              />
            </div>
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

        {/* Результаты */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Образы не найдены</h3>
            <p>Попробуйте изменить параметры поиска или добавьте новые образы</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm hover:scale-105">
                <div className="relative">
                  <img 
                    src={template.image_url} 
                    alt={template.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {isWeatherSuitable(template) && (
                      <Badge className="bg-green-500 text-white">
                        Подходит сегодня
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(template.id)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        favorites.has(template.id) 
                          ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                          : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openFeedbackDialog(template)}
                      className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:scale-110"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {getTemperatureText(template) && (
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/90 rounded-full px-3 py-1 text-sm font-medium">
                        {getTemperatureText(template)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.clothing_items.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {template.clothing_items.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.clothing_items.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge className="bg-indigo-100 text-indigo-800">
                      {styleOptions.find(s => s.value === template.style_category)?.label || template.style_category}
                    </Badge>
                    <Badge variant="outline">
                      {template.season}
                    </Badge>
                  </div>
                  
                  {template.style_tips && (
                    <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-700">💡 {template.style_tips}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Диалог обратной связи */}
      <Dialog open={feedbackDialog.open} onOpenChange={(open) => setFeedbackDialog({ open, template: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оценить образ "{feedbackDialog.template?.name}"</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ваша оценка</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackData(prev => ({ ...prev, rating }))}
                    className={`p-2 ${feedbackData.rating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Комментарий (необязательно)</label>
              <textarea
                value={feedbackData.feedback}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, feedback: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Что вам понравилось или не понравилось в этом образе?"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setFeedbackDialog({ open: false, template: null })}>
                Отмена
              </Button>
              <Button onClick={submitFeedback} className="bg-purple-500 hover:bg-purple-600">
                Отправить отзыв
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
