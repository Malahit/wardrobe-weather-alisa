
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWardrobe } from "@/hooks/useWardrobe";

export const AddWardrobeItemDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    color: "",
    season: "",
    brand: "",
    temperature_min: "",
    temperature_max: ""
  });
  
  const { toast } = useToast();
  const { addItem } = useWardrobe();

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
        category: "", 
        color: "", 
        season: "", 
        brand: "",
        temperature_min: "",
        temperature_max: ""
      });
      setIsOpen(false);
      
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
};
