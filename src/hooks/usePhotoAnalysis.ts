
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WardrobeItem } from '@/hooks/useWardrobe';

interface PhotoAnalysisResult {
  name: string;
  category: string;
  color: string;
  season: string;
  brand?: string;
  confidence: number;
  description: string;
}

export const usePhotoAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PhotoAnalysisResult | null>(null);
  const { user } = useAuth();

  const analyzePhoto = async (imageFile: File): Promise<PhotoAnalysisResult | null> => {
    if (!user || !imageFile) return null;

    try {
      setAnalyzing(true);
      
      // Конвертируем изображение в base64
      const base64Image = await convertToBase64(imageFile);
      
      // Отправляем на анализ в edge function
      const { data, error } = await supabase.functions.invoke('analyze-clothing', {
        body: { 
          image: base64Image,
          userId: user.id 
        }
      });

      if (error) throw error;

      const analysisResult: PhotoAnalysisResult = {
        name: data.name || 'Неопознанная вещь',
        category: data.category || 'other',
        color: data.color || 'неопределенный',
        season: data.season || 'all-season',
        brand: data.brand,
        confidence: data.confidence || 0.8,
        description: data.description || ''
      };

      setResult(analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing photo:', error);
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const addAnalyzedItemToWardrobe = async (
    analysis: PhotoAnalysisResult,
    imageFile: File,
    customName?: string
  ): Promise<{ success: boolean; item?: WardrobeItem }> => {
    if (!user) return { success: false };

    try {
      // Загружаем изображение в storage
      const fileName = `${user.id}_${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wardrobe-photos')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('wardrobe-photos')
        .getPublicUrl(fileName);

      // Добавляем вещь в гардероб
      const { data: itemData, error: itemError } = await supabase
        .from('wardrobe_items')
        .insert([{
          name: customName || analysis.name,
          category: analysis.category,
          color: analysis.color,
          season: analysis.season,
          brand: analysis.brand,
          image_url: urlData.publicUrl,
          user_id: user.id,
          weather_conditions: getWeatherConditions(analysis.season, analysis.category),
          temperature_min: getTemperatureRange(analysis.season, analysis.category).min,
          temperature_max: getTemperatureRange(analysis.season, analysis.category).max
        }])
        .select()
        .single();

      if (itemError) throw itemError;

      return { 
        success: true, 
        item: itemData as WardrobeItem 
      };
    } catch (error) {
      console.error('Error adding analyzed item:', error);
      return { success: false };
    }
  };

  return {
    analyzing,
    result,
    analyzePhoto,
    addAnalyzedItemToWardrobe
  };
};

// Утилиты
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Убираем префикс data:image/...;base64,
    };
    reader.onerror = reject;
  });
};

const getWeatherConditions = (season: string, category: string): string[] => {
  const conditions: string[] = [];
  
  if (season === 'winter') conditions.push('снег', 'холод');
  if (season === 'autumn' || season === 'spring') conditions.push('дождь', 'ветер');
  if (season === 'summer') conditions.push('жара', 'солнце');
  if (category === 'outerwear') conditions.push('дождь', 'ветер', 'холод');
  
  return conditions;
};

const getTemperatureRange = (season: string, category: string) => {
  const ranges = {
    winter: { min: -20, max: 5 },
    autumn: { min: 0, max: 15 },
    spring: { min: 5, max: 20 },
    summer: { min: 15, max: 35 },
    'all-season': { min: -10, max: 30 }
  };

  const baseRange = ranges[season as keyof typeof ranges] || ranges['all-season'];
  
  // Корректируем для верхней одежды
  if (category === 'outerwear') {
    return { min: baseRange.min - 10, max: baseRange.max };
  }
  
  return baseRange;
};
