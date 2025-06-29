
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WardrobeItem {
  id: number;
  name: string;
  category: string;
  color: string;
  season: string;
  imageUrl?: string;
}

interface WardrobeSectionProps {
  items: WardrobeItem[];
  setItems: (items: WardrobeItem[]) => void;
}

export const WardrobeSection = ({ items, setItems }: WardrobeSectionProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    color: "",
    season: ""
  });
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.color || !newItem.season) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const item: WardrobeItem = {
      id: Date.now(),
      ...newItem,
      imageUrl: `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop&crop=center`
    };

    setItems([...items, item]);
    setNewItem({ name: "", category: "", color: "", season: "" });
    setIsAddModalOpen(false);
    
    toast({
      title: "Успешно!",
      description: "Вещь добавлена в гардероб"
    });
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Удалено",
      description: "Вещь удалена из гардероба"
    });
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Мой гардероб</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              Добавить вещь
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Добавить новую вещь</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Например: Красная рубашка"
                />
              </div>
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Верх</SelectItem>
                    <SelectItem value="bottom">Низ</SelectItem>
                    <SelectItem value="shoes">Обувь</SelectItem>
                    <SelectItem value="outerwear">Верхняя одежда</SelectItem>
                    <SelectItem value="accessories">Аксессуары</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Цвет</Label>
                <Input
                  id="color"
                  value={newItem.color}
                  onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                  placeholder="Например: Красный"
                />
              </div>
              <div>
                <Label htmlFor="season">Сезон</Label>
                <Select onValueChange={(value) => setNewItem({...newItem, season: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите сезон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Весна</SelectItem>
                    <SelectItem value="summer">Лето</SelectItem>
                    <SelectItem value="autumn">Осень</SelectItem>
                    <SelectItem value="winter">Зима</SelectItem>
                    <SelectItem value="all-season">Всесезон</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Добавить в гардероб
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <p className="text-lg mb-4">Ваш гардероб пуст</p>
          <p>Добавьте первую вещь, чтобы начать подбор образов!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 bg-white/10 border-white/20 hover:bg-white/15 transition-all hover-scale">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👕</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                      {item.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                      {item.color}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                      {item.season}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="mt-2 text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
