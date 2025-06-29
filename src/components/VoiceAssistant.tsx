
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const { toast } = useToast();

  const startListening = () => {
    setIsListening(true);
    
    // Симуляция голосовой команды
    setTimeout(() => {
      const commands = [
        "Что надеть сегодня?",
        "Добавь новую вещь в гардероб",
        "Покажи мой гардероб",
        "Какая сегодня погода?"
      ];
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      setLastCommand(randomCommand);
      setIsListening(false);
      
      toast({
        title: "Алиса услышала:",
        description: randomCommand
      });
    }, 2000);
  };

  return (
    <Card className="p-4 mb-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎤</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Голосовой помощник Алиса</h3>
            {lastCommand && (
              <p className="text-white/70 text-sm">Последняя команда: "{lastCommand}"</p>
            )}
          </div>
        </div>
        
        <Button
          onClick={startListening}
          disabled={isListening}
          className={`${
            isListening 
              ? "bg-red-500 hover:bg-red-600 animate-pulse" 
              : "bg-white/20 hover:bg-white/30"
          } text-white border-white/30`}
        >
          {isListening ? "Слушаю..." : "Говорить с Алисой"}
        </Button>
      </div>
      
      {isListening && (
        <div className="mt-3 text-center">
          <div className="inline-flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
          <p className="text-white/70 text-sm mt-2">Говорите команду...</p>
        </div>
      )}
    </Card>
  );
};
