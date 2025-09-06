
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { OutfitSuggestion } from '@/services/outfitService';

export interface SavedOutfit {
  id: string;
  name: string;
  item_ids: string[];
  rating?: number | null;
  times_used: number;
  user_id: string;
  weather_context?: any | null;
  last_used?: string | null;
  created_at: string;
  updated_at: string;
}

export const useSavedOutfits = () => {
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedOutfits();
  }, [user]);

  const fetchSavedOutfits = async () => {
    if (!user) {
      // Для неавторизованных пользователей используем локальное хранилище
      try {
        const localOutfits = localStorage.getItem('saved_outfits');
        if (localOutfits) {
          setSavedOutfits(JSON.parse(localOutfits));
        }
      } catch (error) {
        console.error('Error loading local saved outfits:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_outfits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedOutfits(data || []);
    } catch (error) {
      console.error('Error fetching saved outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfit: OutfitSuggestion, name: string, weather?: any) => {
    try {
      if (!user) {
        // Для неавторизованных пользователей сохраняем в локальное хранилище
        const newOutfit: SavedOutfit = {
          id: Date.now().toString(),
          name,
          item_ids: outfit.items.map(item => item.id),
          times_used: 0,
          user_id: 'local',
          weather_context: weather ? {
            condition: weather.condition,
            temperature: weather.temperature,
            reason: outfit.reason
          } : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const currentOutfits = JSON.parse(localStorage.getItem('saved_outfits') || '[]');
        const updatedOutfits = [newOutfit, ...currentOutfits];
        localStorage.setItem('saved_outfits', JSON.stringify(updatedOutfits));
        setSavedOutfits(updatedOutfits);
        
        return { success: true };
      }

      const { data, error } = await supabase
        .from('saved_outfits')
        .insert([{
          name,
          item_ids: outfit.items.map(item => item.id),
          user_id: user.id,
          weather_context: weather ? {
            condition: weather.condition,
            temperature: weather.temperature,
            reason: outfit.reason
          } : null
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSavedOutfits(prev => [data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error saving outfit:', error);
      return { success: false, error };
    }
  };

  const deleteOutfit = async (id: string) => {
    try {
      if (!user) {
        // Для неавторизованных пользователей работаем с локальным хранилищем
        const currentOutfits = JSON.parse(localStorage.getItem('saved_outfits') || '[]');
        const updatedOutfits = currentOutfits.filter((outfit: SavedOutfit) => outfit.id !== id);
        localStorage.setItem('saved_outfits', JSON.stringify(updatedOutfits));
        setSavedOutfits(updatedOutfits);
        return { success: true };
      }

      const { error } = await supabase
        .from('saved_outfits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSavedOutfits(prev => prev.filter(outfit => outfit.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting outfit:', error);
      return { success: false, error };
    }
  };

  const useOutfit = async (id: string) => {
    try {
      const outfit = savedOutfits.find(o => o.id === id);
      if (!outfit) return { success: false };

      if (!user) {
        // Для неавторизованных пользователей обновляем локальное хранилище
        const currentOutfits = JSON.parse(localStorage.getItem('saved_outfits') || '[]');
        const updatedOutfits = currentOutfits.map((o: SavedOutfit) => 
          o.id === id 
            ? { ...o, times_used: o.times_used + 1, last_used: new Date().toISOString() }
            : o
        );
        localStorage.setItem('saved_outfits', JSON.stringify(updatedOutfits));
        setSavedOutfits(updatedOutfits);
        return { success: true };
      }

      const { error } = await supabase
        .from('saved_outfits')
        .update({
          times_used: outfit.times_used + 1,
          last_used: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;
      
      // Обновляем статистику использования вещей
      for (const itemId of outfit.item_ids) {
        // Сначала получаем текущее значение times_worn
        const { data: currentItem } = await supabase
          .from('wardrobe_items')
          .select('times_worn')
          .eq('id', itemId)
          .single();

        if (currentItem) {
          await supabase
            .from('wardrobe_items')
            .update({
              times_worn: (currentItem.times_worn || 0) + 1,
              last_worn: new Date().toISOString().split('T')[0]
            })
            .eq('id', itemId);
        }
      }
      
      await fetchSavedOutfits();
      return { success: true };
    } catch (error) {
      console.error('Error using outfit:', error);
      return { success: false, error };
    }
  };

  const rateOutfit = async (id: string, rating: number) => {
    try {
      if (!user) {
        // Для неавторизованных пользователей обновляем локальное хранилище
        const currentOutfits = JSON.parse(localStorage.getItem('saved_outfits') || '[]');
        const updatedOutfits = currentOutfits.map((o: SavedOutfit) => 
          o.id === id ? { ...o, rating } : o
        );
        localStorage.setItem('saved_outfits', JSON.stringify(updatedOutfits));
        setSavedOutfits(updatedOutfits);
        return { success: true };
      }

      const { error } = await supabase
        .from('saved_outfits')
        .update({ rating })
        .eq('id', id);

      if (error) throw error;
      
      await fetchSavedOutfits();
      return { success: true };
    } catch (error) {
      console.error('Error rating outfit:', error);
      return { success: false, error };
    }
  };

  return {
    savedOutfits,
    loading,
    saveOutfit,
    deleteOutfit,
    useOutfit,
    rateOutfit,
    refetch: fetchSavedOutfits
  };
};
