import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageSquare } from 'lucide-react';

interface AliceMessage {
  id: string;
  text: string;
  type: 'user' | 'alice';
  timestamp: Date;
}

export const YandexAliceIntegration = () => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<AliceMessage[]>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Инициализация Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'ru-RU';

      speechRecognition.onstart = () => {
        setIsListening(true);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(speechRecognition);
      setIsConnected(true);
    } else {
      console.warn('Web Speech API не поддерживается в этом браузере');
    }
  }, []);

  const handleUserMessage = (text: string) => {
    const userMessage: AliceMessage = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Имитация ответа Алисы
    setTimeout(() => {
      const aliceResponse = generateAliceResponse(text);
      const aliceMessage: AliceMessage = {
        id: (Date.now() + 1).toString(),
        text: aliceResponse,
        type: 'alice',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aliceMessage]);
      speakText(aliceResponse);
    }, 1000);
  };

  const generateAliceResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('погод')) {
      return 'Сейчас проверю погоду для вас. Рекомендую одеться потеплее!';
    } else if (lowerText.includes('одежд') || lowerText.includes('что надеть')) {
      return 'Основываясь на погоде и вашем гардеробе, рекомендую надеть легкую куртку и удобные джинсы.';
    } else if (lowerText.includes('гардероб')) {
      return 'В вашем гардеробе много интересных вещей. Хотите, подберу образ на сегодня?';
    } else if (lowerText.includes('стиль')) {
      return 'Ваш стиль выглядит гармонично. Попробуйте добавить яркий аксессуар для создания акцента.';
    } else {
      return 'Я помогаю с выбором одежды и созданием образов. Спросите меня о погоде или что лучше надеть!';
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Голосовой помощник</h2>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? "Подключено" : "Не подключено"}
              </Badge>
              {isListening && (
                <Badge variant="default" className="text-xs bg-red-500 animate-pulse">
                  Слушаю...
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!isConnected}
            className={`${isListening 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Стоп
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Говорить
              </>
            )}
          </Button>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-8 text-white/60">
          <Mic className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-lg mb-2">Голосовой помощник недоступен</p>
          <p>Ваш браузер не поддерживает распознавание речи</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <Volume2 className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-lg mb-2">Готов к разговору!</p>
          <p>Нажмите кнопку "Говорить" и спросите о погоде или одежде</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('ru', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
