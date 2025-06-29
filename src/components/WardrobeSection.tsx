
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe, WardrobeItem } from "@/hooks/useWardrobe";

const categoryLabels = {
  top: 'Верх',
  bottom: 'Низ', 
  shoes: 'Обувь',
  outerwear: 'Верхняя одежда',
  accessories: 'Аксессуары'
};

const seasonLabels = {
  spring: 'Весна',
  summer: 'Лето',
  autumn: 'Осень',
  winter: 'Зима',
  'all-season': 'Всесезон'
};

export const WardrobeSection = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "" as WardrobeItem['category'],
    color: "",
    season: "" as WardrobeItem['season'],
    brand: "",
    temperature_min: "",
    temperature_max: ""
  });
  
  const { toast } = useToast();
  const { items, loading, addItem, removeItem } = useWardrobe();

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.color || !newItem.season) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const itemData = {
      name: newItem.name,
      category: newItem.category,
      color: newItem.color,
      season: newItem.season,
      brand: newItem.brand || undefined,
      temperature_min: newItem.temperature_min ? parseInt(newItem.temperature_min) : undefined,
      temperature_max: newItem.temperature_max ? parseInt(newItem.temperature_max) : undefined,
    };

    const result = await addItem(itemData);
    
    if (result.success) {
      setNewItem({ 
        name: "", 
        category: "" as WardrobeItem['category'], 
        color: "", 
        season: "" as WardrobeItem['season'], 
        brand: "",
        temperature_min: "",
        temperature_max: ""
      });
      setIsAddModalOpen(false);
      
      toast({
        title: "Успешно!",
        description: "Вещь добавлена в гардероб"
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить вещь в гардероб",
        variant: "destructive"
      });
    }
  };

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
                <Label htmlFor="name">Название*</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Например: Красная рубашка"
                />
              </div>
              <div>
                <Label htmlFor="category">Категория*</Label>
                <Select onValueChange={(value) => setNewItem({...newItem, category: value as WardrobeItem['category']})}>
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
                <Label htmlFor="color">Цвет*</Label>
                <Input
                  id="color"
                  value={newItem.color}
                  onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                  placeholder="Например: Красный"
                />
              </div>
              <div>
                <Label htmlFor="season">Сезон*</Label>
                <Select onValueChange={(value) => setNewItem({...newItem, season: value as WardrobeItem['season']})}>
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
              <div>
                <Label htmlFor="brand">Бренд</Label>
                <Input
                  id="brand"
                  value={newItem.brand}
                  onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                  placeholder="Например: Zara"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temp-min">Мин. температура (°C)</Label>
                  <Input
                    id="temp-min"
                    type="number"
                    value={newItem.temperature_min}
                    onChange={(e) => setNewItem({...newItem, temperature_min: e.target.value})}
                    placeholder="Например: -10"
                  />
                </div>
                <div>
                  <Label htmlFor="temp-max">Макс. температура (°C)</Label>
                  <Input
                    id="temp-max"
                    type="number"
                    value={newItem.temperature_max}
                    onChange={(e) => setNewItem({...newItem, temperature_max: e.target.value})}
                    placeholder="Например: 25"
                  />
                </div>
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
                  {item.brand && (
                    <p className="text-sm text-white/70 mb-2">{item.brand}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                      {categoryLabels[item.category]}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                      {item.color}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                      {seasonLabels[item.season]}
                    </Badge>
                  </div>
                  {(item.temperature_min || item.temperature_max) && (
                    <p className="text-xs text-white/60 mb-2">
                      {item.temperature_min && item.temperature_max 
                        ? `${item.temperature_min}°C - ${item.temperature_max}°C`
                        : item.temperature_min 
                        ? `от ${item.temperature_min}°C`
                        : `до ${item.temperature_max}°C`
                      }
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
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
