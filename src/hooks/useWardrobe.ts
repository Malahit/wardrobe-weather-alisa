
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/types/supabase';

type WardrobeItemDB = Database['public']['Tables']['wardrobe_items']['Row'];

export interface WardrobeItem {
  id: string;
  name: string;
  category: string; // изменено с union типа на string
  color: string;
  season: string; // изменено с union типа на string
  brand?: string;
  image_url?: string;
  weather_conditions?: string[];
  temperature_min?: number;
  temperature_max?: number;
  times_worn: number;
  last_worn?: string;
  created_at: string;
  updated_at: string;
}

export const useWardrobe = () => {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWardrobeItems();
    }
  }, [user]);

  const fetchWardrobeItems = async () => {
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Преобразуем данные из базы в нужный формат
      const transformedData: WardrobeItem[] = (data || []).map((item: WardrobeItemDB) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        color: item.color,
        season: item.season,
        brand: item.brand || undefined,
        image_url: item.image_url || undefined,
        weather_conditions: item.weather_conditions || undefined,
        temperature_min: item.temperature_min || undefined,
        temperature_max: item.temperature_max || undefined,
        times_worn: item.times_worn || 0,
        last_worn: item.last_worn || undefined,
        created_at: item.created_at || '',
        updated_at: item.updated_at || ''
      }));
      
      setItems(transformedData);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at' | 'times_worn'>) => {
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert([{
          ...item,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error('No data returned from insert');
      }

      // Преобразуем новый элемент в нужный формат
      const newItem: WardrobeItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        color: data.color,
        season: data.season,
        brand: data.brand || undefined,
        image_url: data.image_url || undefined,
        weather_conditions: data.weather_conditions || undefined,
        temperature_min: data.temperature_min || undefined,
        temperature_max: data.temperature_max || undefined,
        times_worn: data.times_worn || 0,
        last_worn: data.last_worn || undefined,
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      };
      
      setItems(prev => [newItem, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      return { success: false, error };
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wardrobe_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error removing wardrobe item:', error);
      return { success: false, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<WardrobeItem>) => {
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error('No data returned from update');
      }

      // Преобразуем обновленный элемент в нужный формат
      const updatedItem: WardrobeItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        color: data.color,
        season: data.season,
        brand: data.brand || undefined,
        image_url: data.image_url || undefined,
        weather_conditions: data.weather_conditions || undefined,
        temperature_min: data.temperature_min || undefined,
        temperature_max: data.temperature_max || undefined,
        times_worn: data.times_worn || 0,
        last_worn: data.last_worn || undefined,
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      };
      
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return { success: true };
    } catch (error) {
      console.error('Error updating wardrobe item:', error);
      return { success: false, error };
    }
  };

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateItem,
    refetch: fetchWardrobeItems
  };
};
