
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface WardrobeItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessories';
  color: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all-season';
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
      setItems(data || []);
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
      setItems(prev => [data, ...prev]);
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
      setItems(prev => prev.map(item => item.id === id ? data : item));
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
