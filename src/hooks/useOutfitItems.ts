
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OutfitItem {
  id: string;
  outfit_template_id: string | null;
  item_name: string;
  item_type: string;
  brand: string | null;
  price: number | null;
  currency: string | null;
  shop_url: string | null;
  image_url: string | null;
  size_range: string | null;
  color: string | null;
  material: string | null;
  description: string | null;
  is_available: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useOutfitItems = () => {
  const [items, setItems] = useState<OutfitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchItems = async (templateId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('outfit_items')
        .select('*')
        .eq('is_available', true);

      if (templateId) {
        query = query.eq('outfit_template_id', templateId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching outfit items:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getItemsByTemplate = (templateId: string) => {
    return items.filter(item => item.outfit_template_id === templateId);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    fetchItems,
    getItemsByTemplate,
  };
};
