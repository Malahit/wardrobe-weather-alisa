
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, Edit3 } from "lucide-react";
import { usePhotoAnalysis } from "@/hooks/usePhotoAnalysis";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EditableAnalysisForm } from "./EditableAnalysisForm";

export const PhotoAnalysisDialog = ({ onItemAdded }: { onItemAdded?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'analyze' | 'edit' | 'confirm'>('upload');
  const [editedResult, setEditedResult] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzing, result, analyzePhoto, addAnalyzedItemToWardrobe } = usePhotoAnalysis();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла 10MB",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Неверный тип файла",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive"
      });
      return;
    }

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
      setEditedResult(analysisResult);
      setStep('edit');
    } else {
      toast({
        title: "Ошибка анализа",
        description: "Не удалось проанализировать изображение",
        variant: "destructive"
      });
    }
  };

  const handleConfirm = async () => {
    if (!editedResult || !selectedImage) return;

    const addResult = await addAnalyzedItemToWardrobe(editedResult, selectedImage);
    
    if (addResult.success) {
      toast({
        title: "Успешно добавлено",
        description: `${editedResult.name} добавлен в ваш гардероб`
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
    setEditedResult(null);
    setStep('upload');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-600/20 text-green-300";
    if (confidence >= 0.6) return "bg-yellow-600/20 text-yellow-300";
    return "bg-red-600/20 text-red-300";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Camera className="w-4 h-4 mr-2" />
          Добавить по фото
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Анализ одежды по фото</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <div className="text-center">
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
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
            
            <Alert className="bg-blue-600/20 border-blue-600/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-300">
                ИИ проанализирует ваше фото и определит тип одежды, цвет и сезон
              </AlertDescription>
            </Alert>
            
            <div className="text-center space-y-4">
              <p className="text-gray-300">Готово к анализу!</p>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Анализируем...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Анализировать фото
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'edit' && result && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Analyzed" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Edit3 className="w-4 h-4" />
                  <span className="font-medium">Редактирование результата</span>
                  <Badge variant="secondary" className={getConfidenceColor(result.confidence)}>
                    {Math.round(result.confidence * 100)}% точность
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">
                  Проверьте и отредактируйте данные перед добавлением в гардероб
                </p>
              </div>
            </div>
            
            <EditableAnalysisForm
              initialData={result}
              onChange={setEditedResult}
            />

            <div className="flex space-x-2">
              <Button
                onClick={() => setStep('analyze')}
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
