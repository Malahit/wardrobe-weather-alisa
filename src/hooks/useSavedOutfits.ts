
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { OutfitSuggestion } from '@/services/outfitService';

export interface SavedOutfit {
  id: string;
  name: string;
  item_ids: string[];
  rating?: number;
  times_used: number;
  last_used?: string;
  weather_condition?: string;
  temperature?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSavedOutfits = () => {
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedOutfits();
    }
  }, [user]);

  const fetchSavedOutfits = async () => {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
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
      const { data, error } = await supabase
        .from('outfits')
        .insert([{
          name,
          item_ids: outfit.items.map(item => item.id),
          description: outfit.reason,
          weather_condition: weather?.condition,
          temperature: weather?.temperature,
          user_id: user?.id
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
      const { error } = await supabase
        .from('outfits')
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

      const { error } = await supabase
        .from('outfits')
        .update({
          times_used: outfit.times_used + 1,
          last_used: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;
      
      // Обновляем статистику использования вещей
      for (const itemId of outfit.item_ids) {
        await supabase
          .from('wardrobe_items')
          .update({
            times_worn: supabase.sql`times_worn + 1`,
            last_worn: new Date().toISOString().split('T')[0]
          })
          .eq('id', itemId);
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
      const { error } = await supabase
        .from('outfits')
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
