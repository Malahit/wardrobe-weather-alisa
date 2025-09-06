
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

  // Маппинг русских погодных условий на английские
  const mapWeatherCondition = (russianCondition: string): string | null => {
    const weatherMap: Record<string, string> = {
      'ясно': 'clear',
      'облачно': 'cloudy',
      'переменная облачность': 'partly-cloudy',
      'дождь': 'light-rain',
      'снег': 'snow',
      'ветрено': 'windy',
      'туман': 'cloudy'
    };
    
    const condition = russianCondition?.toLowerCase();
    return weatherMap[condition] || null;
  };

  const fetchTemplates = async (weather?: any, forceRefresh = false) => {
    setLoading(true);
    try {
      console.log('🎨 Fetching outfit templates with weather:', weather);
      console.log('🌡️ Temperature:', weather?.temperature);
      console.log('☁️ Condition:', weather?.condition);
      
      // Маппинг погодного условия
      const mappedCondition = weather?.condition ? mapWeatherCondition(weather.condition) : null;
      console.log('🗂️ Mapped condition:', weather?.condition, '=>', mappedCondition);
      
      // Теперь попробуем вызвать RPC функцию
      const { data, error } = await supabase.rpc('get_random_outfit_templates', {
        weather_condition: mappedCondition,
        temperature: weather?.temperature || null,
        limit_count: 12
      });

      if (error) {
        console.error('❌ RPC Error fetching templates:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Fetched templates:', data?.length || 0);
      console.log('📋 Templates data:', data);
      setTemplates(data || []);
      
      if (forceRefresh && data && data.length > 0) {
        toast({
          title: "Образы обновлены!",
          description: `Загружено ${data.length} новых образов под текущую погоду`,
        });
      }
    } catch (error) {
      console.error('💥 Critical error fetching outfit templates:', error);
      
      // Попробуем fallback запрос без RPC
      try {
        console.log('🔄 Trying fallback query...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('outfit_templates')
          .select('*')
          .eq('is_approved', true)
          .limit(12);
          
        if (fallbackError) {
          console.error('❌ Fallback error:', fallbackError);
        } else {
          console.log('✅ Fallback success:', fallbackData?.length);
          setTemplates(fallbackData || []);
          return;
        }
      } catch (fallbackErr) {
        console.error('💥 Fallback also failed:', fallbackErr);
      }
      
      toast({
        title: "Ошибка",
        description: `Не удалось загрузить образы: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (template: Omit<OutfitTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('outfit_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Образ добавлен!",
        description: "Новый образ отправлен на модерацию",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error adding template:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить образ",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const submitTrainingData = async (
    templateId: string,
    feedback: string,
    rating: number,
    weather?: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
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
          user_id: user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting training data:', error);
      throw error;
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
