
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { OutfitSuggestion } from "@/services/outfitService";
import { useSavedOutfits } from "@/hooks/useSavedOutfits";
import { useToast } from "@/hooks/use-toast";

interface SaveOutfitDialogProps {
  outfit: OutfitSuggestion;
  weather?: any;
}

export const SaveOutfitDialog = ({ outfit, weather }: SaveOutfitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveOutfit } = useSavedOutfits();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);
    const result = await saveOutfit(outfit, name.trim(), weather);
    
    if (result.success) {
      toast({
        title: "Сохранено",
        description: `Образ "${name}" добавлен в сохраненные`
      });
      setOpen(false);
      setName("");
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить образ",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-red-400 hover:bg-white/10"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Сохранить образ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outfit-name">Название образа</Label>
            <Input
              id="outfit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Повседневный образ на прохладную погоду"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          
          <div className="p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Образ включает:</p>
            <div className="space-y-1">
              {outfit.items.map((item) => (
                <div key={item.id} className="text-sm text-white">
                  • {item.name} ({item.color})
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Сохраняю..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
