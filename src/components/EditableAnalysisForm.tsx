
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AnalysisResult {
  name: string;
  category: string;
  color: string;
  season: string;
  brand?: string;
  confidence: number;
  description: string;
}

interface EditableAnalysisFormProps {
  initialData: AnalysisResult;
  onChange: (data: AnalysisResult) => void;
}

export const EditableAnalysisForm = ({ initialData, onChange }: EditableAnalysisFormProps) => {
  const [formData, setFormData] = useState<AnalysisResult>(initialData);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field: keyof AnalysisResult, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categories = [
    { value: 'top', label: 'Верх' },
    { value: 'bottom', label: 'Низ' },
    { value: 'shoes', label: 'Обувь' },
    { value: 'outerwear', label: 'Верхняя одежда' },
    { value: 'accessories', label: 'Аксессуары' },
    { value: 'other', label: 'Другое' }
  ];

  const seasons = [
    { value: 'spring', label: 'Весна' },
    { value: 'summer', label: 'Лето' },
    { value: 'autumn', label: 'Осень' },
    { value: 'winter', label: 'Зима' },
    { value: 'all-season', label: 'Всесезон' }
  ];

  const colors = [
    'черный', 'белый', 'серый', 'красный', 'синий', 'зеленый',
    'желтый', 'оранжевый', 'розовый', 'фиолетовый', 'коричневый',
    'бежевый', 'голубой', 'темно-синий', 'бордовый', 'хаки'
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand">Бренд (необязательно)</Label>
          <Input
            id="brand"
            value={formData.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Категория</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-gray-700">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Сезон</Label>
          <Select value={formData.season} onValueChange={(value) => handleChange('season', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {seasons.map(season => (
                <SelectItem key={season.value} value={season.value} className="text-white hover:bg-gray-700">
                  {season.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Цвет</Label>
        <Select value={formData.color} onValueChange={(value) => handleChange('color', value)}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {colors.map(color => (
              <SelectItem key={color} value={color} className="text-white hover:bg-gray-700">
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          rows={3}
        />
      </div>
    </div>
  );
};
