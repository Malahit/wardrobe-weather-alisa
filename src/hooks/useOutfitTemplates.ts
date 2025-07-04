
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

  const fetchTemplates = async (weather?: any, forceRefresh = false) => {
    setLoading(true);
    try {
      console.log('Fetching outfit templates with weather:', weather);
      
      // Используем новую функцию для случайной выборки образов
      const { data, error } = await supabase.rpc('get_random_outfit_templates', {
        weather_condition: weather?.condition || null,
        temperature: weather?.temperature || null,
        limit_count: 12
      });

      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }

      console.log('Fetched templates:', data?.length);
      setTemplates(data || []);
      
      if (forceRefresh && data?.length) {
        toast({
          title: "Образы обновлены!",
          description: `Загружено ${data.length} новых образов под текущую погоду`,
        });
      }
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

  const submitTrainingData = async (
    templateId: string,
    feedback: string,
    rating: number,
    weather?: any
  ) => {
    try {
      const { error } = await supabase
        .from('stylist_training_data')
        .insert({
          outfit_template_id: templateId,
          user_feedback: feedback,
          rating,
          weather_context: weather ? {
            temperature: weather.temperature,
            condition: weather.condition,
            humidity: weather.humidity
          } : null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting training data:', error);
      throw error;
    }
  };

  // Автоматическая загрузка при монтировании
  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    fetchTemplates,
    submitTrainingData,
  };
};
