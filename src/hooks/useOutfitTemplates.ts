
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OutfitTemplate {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  weather_conditions: string[];
  temperature_min: number | null;
  temperature_max: number | null;
  style_category: string;
  season: string;
  occasion: string | null;
  color_palette: string[];
  clothing_items: string[];
  style_tips: string | null;
  source_url: string | null;
  is_approved: boolean | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useOutfitTemplates = () => {
  const [templates, setTemplates] = useState<OutfitTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTemplates = async (weather?: any) => {
    setLoading(true);
    try {
      let query = supabase
        .from('outfit_templates')
        .select('*')
        .eq('is_approved', true);

      // Фильтрация по погоде если передана
      if (weather) {
        const temp = weather.temperature;
        const condition = mapWeatherCondition(weather.condition);
        
        query = query
          .or(`temperature_min.is.null,temperature_min.lte.${temp}`)
          .or(`temperature_max.is.null,temperature_max.gte.${temp}`);
          
        if (condition) {
          query = query.contains('weather_conditions', [condition]);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching outfit templates:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить образы",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (template: Omit<OutfitTemplate, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('outfit_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Образ добавлен для модерации",
      });

      return data;
    } catch (error) {
      console.error('Error adding template:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить образ",
        variant: "destructive",
      });
      throw error;
    }
  };

  const submitTrainingData = async (templateId: string, feedback: string, rating: number, weatherContext: any) => {
    try {
      const { error } = await supabase
        .from('stylist_training_data')
        .insert([{
          outfit_template_id: templateId,
          user_feedback: feedback,
          rating,
          weather_context: weatherContext,
        }]);

      if (error) throw error;

      toast({
        title: "Спасибо!",
        description: "Ваш отзыв поможет улучшить рекомендации",
      });
    } catch (error) {
      console.error('Error submitting training data:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отзыв",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    fetchTemplates,
    addTemplate,
    submitTrainingData,
  };
};

// Мапинг погодных условий
const mapWeatherCondition = (condition: string): string | null => {
  const conditionMap: Record<string, string> = {
    'clear': 'clear',
    'sunny': 'clear',
    'partly-cloudy': 'partly-cloudy',
    'cloudy': 'cloudy',
    'overcast': 'cloudy',
    'rain': 'light-rain',
    'drizzle': 'light-rain',
    'heavy-rain': 'heavy-rain',
    'snow': 'snow',
    'sleet': 'snow',
    'fog': 'cloudy',
    'mist': 'cloudy',
    'wind': 'windy',
  };

  return conditionMap[condition.toLowerCase()] || null;
};
