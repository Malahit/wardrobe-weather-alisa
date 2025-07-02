
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageSquare, Sparkles, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  outfitSuggestion?: {
    items: string[];
    reason: string;
    imageUrl?: string;
  };
}

export const VoiceOutfitAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeSpeechRecognition();
  }, []);

  const initializeSpeechRecognition = async () => {
    try {
      // Проверяем разрешения на микрофон
      const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
      permission.getTracks().forEach(track => track.stop());
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'ru-RU';

        recognition.onstart = () => {
          setIsListening(true);
          toast({
            description: "🎤 Слушаю ваш запрос...",
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          handleUserMessage(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'not-allowed') {
            setPermissionStatus('denied');
            toast({
              title: "Нет доступа к микрофону",
              description: "Разрешите доступ к микрофону в настройках браузера",
              duration: 5000,
            });
          }
        };

        recognitionRef.current = recognition;
        setIsConnected(true);
        setPermissionStatus('granted');
      }
    } catch (error) {
      console.error('Microphone access denied:', error);
      setPermissionStatus('denied');
      toast({
        title: "Микрофон недоступен",
        description: "Разрешите доступ к микрофону для использования голосового помощника",
        duration: 5000,
      });
    }
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Имитация анализа запроса и генерации ответа
    setTimeout(() => {
      const response = generateOutfitResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        type: 'assistant',
        timestamp: new Date(),
        outfitSuggestion: response.outfit
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      speakText(response.text);
    }, 1500);
  };

  const generateOutfitResponse = (userText: string) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('деловой') || lowerText.includes('офис') || lowerText.includes('работ')) {
      return {
        text: 'Для делового стиля рекомендую классический костюм в темных тонах, белую рубашку и туфли.',
        outfit: {
          items: ['Темный костюм', 'Белая рубашка', 'Классические туфли', 'Кожаный ремень'],
          reason: 'Деловой стиль для офиса',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'
        }
      };
    } else if (lowerText.includes('прогулк') || lowerText.includes('кэжуал') || lowerText.includes('повседнев')) {
      return {
        text: 'Для прогулки отлично подойдут джинсы, удобная футболка и кроссовки.',
        outfit: {
          items: ['Джинсы', 'Хлопковая футболка', 'Кроссовки', 'Легкая куртка'],
          reason: 'Комфортный стиль для прогулок',
          imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop'
        }
      };
    } else if (lowerText.includes('вечер') || lowerText.includes('свидани') || lowerText.includes('ресторан')) {
      return {
        text: 'На вечер предлагаю элегантное платье или рубашку с брюками и стильные аксессуары.',
        outfit: {
          items: ['Элегантное платье', 'Туфли на каблуке', 'Клатч', 'Украшения'],
          reason: 'Вечерний образ для особого случая',
          imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop'
        }
      };
    } else {
      return {
        text: 'Расскажите больше о планах! Куда собираетесь: на работу, прогулку или особое мероприятие?',
        outfit: {
          items: ['Универсальные джинсы', 'Базовая футболка', 'Удобная обувь'],
          reason: 'Базовый комплект на каждый день'
        }
      };
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

  const startListening = async () => {
    if (permissionStatus === 'denied') {
      await initializeSpeechRecognition();
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось запустить распознавание речи",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (permissionStatus === 'denied') {
    return (
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <Mic className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Голосовой помощник недоступен</h3>
          <p className="text-gray-600 mb-4">Для работы голосового помощника необходимо разрешить доступ к микрофону</p>
          <Button onClick={initializeSpeechRecognition} className="bg-purple-600 hover:bg-purple-700">
            Разрешить доступ к микрофону
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Голосовой стилист</h2>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? "Готов к работе" : "Недоступен"}
              </Badge>
              {isListening && (
                <Badge className="text-xs bg-red-500 animate-pulse">
                  Слушаю...
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={!isConnected}
          size="lg"
          className={`${isListening 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-purple-600 hover:bg-purple-700'
          } px-6 py-3`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Стоп
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Говорить
            </>
          )}
        </Button>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <Volume2 className="w-20 h-20 mx-auto mb-4 text-purple-300" />
          <h3 className="text-xl font-semibold mb-2">Готов помочь с выбором образа!</h3>
          <p className="mb-4">Нажмите "Говорить" и скажите:</p>
          <div className="space-y-2 text-sm">
            <p>"Что надеть на работу?"</p>
            <p>"Подбери образ для прогулки"</p>
            <p>"Что одеть на свидание?"</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-800 shadow-md border'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.type === 'assistant' && <User className="w-4 h-4 text-purple-600" />}
                    <p className="text-sm font-medium">
                      {message.type === 'user' ? 'Вы' : 'Стилист'}
                    </p>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString('ru', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
              
              {message.outfitSuggestion && (
                <div className="bg-white rounded-xl p-4 shadow-md border ml-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Рекомендованный образ:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{message.outfitSuggestion.reason}</p>
                      <div className="flex flex-wrap gap-2">
                        {message.outfitSuggestion.items.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {message.outfitSuggestion.imageUrl && (
                      <div className="flex justify-center">
                        <img 
                          src={message.outfitSuggestion.imageUrl} 
                          alt="Образ" 
                          className="w-24 h-32 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
