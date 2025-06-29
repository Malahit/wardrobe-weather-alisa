
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe } from "@/hooks/useWardrobe";
import { WardrobeItemCard } from "@/components/WardrobeItemCard";
import { AddWardrobeItemDialog } from "@/components/AddWardrobeItemDialog";

export const WardrobeSection = () => {
  const { toast } = useToast();
  const { items, loading, removeItem } = useWardrobe();

  const handleRemoveItem = async (id: string) => {
    const result = await removeItem(id);
    
    if (result.success) {
      toast({
        title: "Удалено",
        description: "Вещь удалена из гардероба"
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить вещь",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center py-12 text-white/60">
          <p className="text-lg">Загрузка гардероба...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Мой гардероб</h2>
        <AddWardrobeItemDialog />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <p className="text-lg mb-4">Ваш гардероб пуст</p>
          <p>Добавьте первую вещь, чтобы начать подбор образов!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <WardrobeItemCard
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
