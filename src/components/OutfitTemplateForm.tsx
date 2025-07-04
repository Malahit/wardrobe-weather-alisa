import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Star, Sparkles } from 'lucide-react';
import { useOutfitTemplates } from '@/hooks/useOutfitTemplates';
import { supabase } from '@/integrations/supabase/client';

interface OutfitTemplateFormProps {
  weather?: any;
}

export const OutfitTemplateForm = ({ weather }: OutfitTemplateFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    weather_conditions: [] as string[],
    temperature_min: '',
    temperature_max: '',
    style_category: '',
    season: '',
    occasion: '',
    color_palette: [] as string[],
    clothing_items: [] as string[],
    style_tips: '',
    source_url: '',
  });

  const { addTemplate } = useOutfitTemplates();

  const weatherOptions = [
    { value: 'clear', label: 'Ясно' },
    { value: 'partly-cloudy', label: 'Переменная облачность' },
    { value: 'cloudy', label: 'Облачно' },
    { value: 'light-rain', label: 'Небольшой дождь' },
    { value: 'heavy-rain', label: 'Сильный дождь' },
    { value: 'snow', label: 'Снег' },
    { value: 'windy', label: 'Ветрено' },
  ];

  const styleCategories = [
    { value: 'casual', label: 'Кэжуал' },
    { value: 'business', label: 'Деловой' },
    { value: 'formal', label: 'Формальный' },
    { value: 'street', label: 'Уличный' },
    { value: 'sporty', label: 'Спортивный' },
    { value: 'romantic', label: 'Романтический' },
    { value: 'boho', label: 'Бохо' },
    { value: 'minimalist', label: 'Минимализм' },
  ];

  const seasons = [
    { value: 'spring', label: 'Весна' },
    { value: 'summer', label: 'Лето' },
    { value: 'autumn', label: 'Осень' },
    { value: 'winter', label: 'Зима' },
    { value: 'all-season', label: 'Всесезонный' },
  ];

  const occasions = [
    { value: 'work', label: 'Работа' },
    { value: 'casual', label: 'Повседневный' },
    { value: 'date', label: 'Свидание' },
    { value: 'party', label: 'Вечеринка' },
    { value: 'sport', label: 'Спорт' },
    { value: 'travel', label: 'Путешествие' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      await addTemplate({
        ...formData,
        temperature_min: formData.temperature_min ? parseInt(formData.temperature_min) : null,
        temperature_max: formData.temperature_max ? parseInt(formData.temperature_max) : null,
        is_approved: false, // Требует модерации
        created_by: user?.id || null, // Add the missing created_by field
      });
      
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        image_url: '',
        weather_conditions: [],
        temperature_min: '',
        temperature_max: '',
        style_category: '',
        season: '',
        occasion: '',
        color_palette: [],
        clothing_items: [],
        style_tips: '',
        source_url: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addToArray = (field: 'weather_conditions' | 'color_palette' | 'clothing_items', value: string) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeFromArray = (field: 'weather_conditions' | 'color_palette' | 'clothing_items', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Добавить образ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Добавить образ для обучения ИИ-стилиста</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название образа*</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Например: Стильный деловой образ"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Краткое описание образа"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">URL изображения*</label>
              <input
                type="url"
                required
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Источник (необязательно)</label>
              <input
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://lookastic.ru/..."
              />
            </div>
          </div>

          {/* Категоризация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Категория стиля*</label>
              <select
                required
                value={formData.style_category}
                onChange={(e) => setFormData(prev => ({ ...prev, style_category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Выберите категорию</option>
                {styleCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Сезон*</label>
              <select
                required
                value={formData.season}
                onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Выберите сезон</option>
                {seasons.map(season => (
                  <option key={season.value} value={season.value}>{season.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Случай</label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Выберите случай</option>
                {occasions.map(occasion => (
                  <option key={occasion.value} value={occasion.value}>{occasion.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Температурный диапазон */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Мин. температура (°C)</label>
              <input
                type="number"
                value={formData.temperature_min}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature_min: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Макс. температура (°C)</label>
              <input
                type="number"
                value={formData.temperature_max}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature_max: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="25"
              />
            </div>
          </div>

          {/* Погодные условия */}
          <div>
            <label className="block text-sm font-medium mb-2">Подходящие погодные условия</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {weatherOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => addToArray('weather_conditions', option.value)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.weather_conditions.includes(option.value)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {formData.weather_conditions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.weather_conditions.map(condition => (
                  <Badge key={condition} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('weather_conditions', condition)}>
                    {weatherOptions.find(opt => opt.value === condition)?.label} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Элементы гардероба */}
          <div>
            <label className="block text-sm font-medium mb-2">Элементы образа</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Добавить элемент (например: Джинсы)"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('clothing_items', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button type="button" size="sm">Добавить</Button>
            </div>
            {formData.clothing_items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.clothing_items.map(item => (
                  <Badge key={item} variant="outline" className="cursor-pointer" onClick={() => removeFromArray('clothing_items', item)}>
                    {item} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Цветовая палитра */}
          <div>
            <label className="block text-sm font-medium mb-2">Цветовая палитра</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Добавить цвет (например: Черный)"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('color_palette', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button type="button" size="sm">Добавить</Button>
            </div>
            {formData.color_palette.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.color_palette.map(color => (
                  <Badge key={color} variant="outline" className="cursor-pointer" onClick={() => removeFromArray('color_palette', color)}>
                    {color} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Советы по стилю */}
          <div>
            <label className="block text-sm font-medium mb-2">Советы по стилю</label>
            <textarea
              value={formData.style_tips}
              onChange={(e) => setFormData(prev => ({ ...prev, style_tips: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Советы и рекомендации по этому образу"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
              <Upload className="w-4 h-4 mr-2" />
              Добавить образ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
