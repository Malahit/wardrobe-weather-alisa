
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe } from "@/hooks/useWardrobe";
import { WardrobeItemCard } from "@/components/WardrobeItemCard";
import { AddWardrobeItemDialog } from "@/components/AddWardrobeItemDialog";
import { PhotoAnalysisDialog } from "@/components/PhotoAnalysisDialog";
import { WardrobeChatbot } from "@/components/WardrobeChatbot";
import { useWeather } from "@/hooks/useWeather";

export const WardrobeSection = () => {
  const { toast } = useToast();
  const { items, loading, removeItem, refetch } = useWardrobe();
  const { weather } = useWeather();

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

  const handleItemAdded = () => {
    refetch();
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
    <div className="space-y-6">
      {/* Chatbot */}
      <WardrobeChatbot wardrobeItems={items} weather={weather} />
      
      {/* Wardrobe Items */}
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Мой гардероб</h2>
          <div className="flex space-x-2">
            <PhotoAnalysisDialog onItemAdded={handleItemAdded} />
            <AddWardrobeItemDialog />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👗</span>
            </div>
            <p className="text-lg mb-4">Ваш гардероб пуст</p>
            <p className="mb-6">Добавьте первую вещь, чтобы начать подбор образов и общение со стилист-ботом!</p>
            <div className="flex justify-center space-x-4">
              <PhotoAnalysisDialog onItemAdded={handleItemAdded} />
              <AddWardrobeItemDialog />
            </div>
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
    </div>
  );
};
