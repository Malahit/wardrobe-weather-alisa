
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Loader2, CheckCircle } from "lucide-react";
import { usePhotoAnalysis } from "@/hooks/usePhotoAnalysis";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const PhotoAnalysisDialog = ({ onItemAdded }: { onItemAdded?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [step, setStep] = useState<'upload' | 'analyze' | 'confirm'>('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzing, result, analyzePhoto, addAnalyzedItemToWardrobe } = usePhotoAnalysis();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep('analyze');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    const analysisResult = await analyzePhoto(selectedImage);
    if (analysisResult) {
      setStep('confirm');
    } else {
      toast({
        title: "Ошибка анализа",
        description: "Не удалось проанализировать изображение",
        variant: "destructive"
      });
    }
  };

  const handleConfirm = async () => {
    if (!result || !selectedImage) return;

    const addResult = await addAnalyzedItemToWardrobe(result, selectedImage, customName);
    
    if (addResult.success) {
      toast({
        title: "Успешно добавлено",
        description: `${customName || result.name} добавлен в ваш гардероб`
      });
      onItemAdded?.();
      handleClose();
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить вещь в гардероб",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setPreviewUrl(null);
    setCustomName("");
    setStep('upload');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'top': 'Верх',
      'bottom': 'Низ', 
      'shoes': 'Обувь',
      'outerwear': 'Верхняя одежда',
      'accessories': 'Аксессуары'
    };
    return labels[category] || category;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Camera className="w-4 h-4 mr-2" />
          Добавить по фото
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Анализ одежды по фото</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-gray-500 transition-colors">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-48 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-gray-300">Выберите фото одежды</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG до 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {previewUrl ? 'Выбрать другое фото' : 'Выбрать фото'}
              </Button>
            </div>
          </div>
        )}

        {step === 'analyze' && (
          <div className="space-y-4">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Selected" 
                className="w-full max-h-48 object-contain rounded-lg"
              />
            )}
            
            <div className="text-center space-y-4">
              <p className="text-gray-300">Готово к анализу!</p>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Анализируем...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Анализировать
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && result && (
          <div className="space-y-4">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Analyzed" 
                className="w-full max-h-32 object-contain rounded-lg"
              />
            )}
            
            <div className="bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Распознано:</span>
                <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                  {Math.round(result.confidence * 100)}% точность
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Название:</span>
                  <span className="text-white">{result.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Категория:</span>
                  <span className="text-white">{getCategoryLabel(result.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Цвет:</span>
                  <span className="text-white">{result.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Сезон:</span>
                  <span className="text-white">{result.season}</span>
                </div>
                {result.brand && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Бренд:</span>
                    <span className="text-white">{result.brand}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-name">Название (можно изменить)</Label>
              <Input
                id="custom-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={result.name}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => setStep('upload')}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Назад
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Добавить в гардероб
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
