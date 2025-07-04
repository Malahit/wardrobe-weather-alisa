
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WardrobeItem } from '@/hooks/useWardrobe';
import { OutfitSuggestion, generateOutfitSuggestions } from '@/services/outfitService';
import { OutfitSuggestionCard } from './OutfitSuggestionCard';

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

interface SmartOutfitAssistantProps {
  wardrobeItems: WardrobeItem[];
  weather: any;
  currentOutfit: OutfitSuggestion | null;
  setCurrentOutfit: (outfit: OutfitSuggestion | null) => void;
}

export const SmartOutfitAssistant = ({ 
  wardrobeItems, 
  weather,
  currentOutfit,
  setCurrentOutfit 
}: SmartOutfitAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'voice' | 'suggestions'>('voice');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeSpeechRecognition();
    generateSuggestions();
  }, [weather, wardrobeItems]);

  const initializeSpeechRecognition = async () => {
    const savedPermission = localStorage.getItem('microphone-permission');
    
    if (savedPermission === 'granted') {
      setupSpeechRecognition();
      return;
    }

    try {
      const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
      permission.getTracks().forEach(track => track.stop());
      
      localStorage.setItem('microphone-permission', 'granted');
      setupSpeechRecognition();
    } catch (error) {
      console.error('Microphone access denied:', error);
      localStorage.setItem('microphone-permission', 'denied');
      toast({
        title: "Микрофон недоступен",
        description: "Разрешите доступ к микрофону для использования голосового помощника",
        duration: 5000,
      });
    }
  };

  const setupSpeechRecognition = () => {
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
      };

      recognitionRef.current = recognition;
      setIsConnected(true);
    }
  };

  const generateSuggestions = () => {
    if (!weather || !wardrobeItems.length) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newSuggestions = generateOutfitSuggestions(wardrobeItems, weather);
      setSuggestions(newSuggestions);
      setLoading(false);
    }, 800);
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

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

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSelectOutfit = (suggestion: OutfitSuggestion) => {
    setCurrentOutfit(currentOutfit?.id === suggestion.id ? null : suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={() => setActiveMode('voice')}
            variant={activeMode === 'voice' ? 'default' : 'outline'}
            className={activeMode === 'voice' 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <Mic className="w-4 h-4 mr-2" />
            Голосовой чат
          </Button>
          <Button
            onClick={() => setActiveMode('suggestions')}
            variant={activeMode === 'suggestions' ? 'default' : 'outline'}
            className={activeMode === 'suggestions' 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Рекомендации образов
          </Button>
        </div>
      </Card>

      {/* Voice Chat Mode */}
      {activeMode === 'voice' && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Голосовой помощник</h2>
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

          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <Volume2 className="w-20 h-20 mx-auto mb-4 text-purple-300" />
                <h3 className="text-xl font-semibold mb-2">Готов помочь с выбором образа!</h3>
                <p className="mb-4">Скажите что-то вроде:</p>
                <div className="space-y-2 text-sm">
                  <p>"Что надеть на работу?"</p>
                  <p>"Подбери образ для прогулки"</p>
                  <p>"Что одеть на свидание?"</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-800 shadow-md border'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Suggestions Mode */}
      {activeMode === 'suggestions' && (
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Рекомендации образов</h2>
            </div>
            <Button
              onClick={generateSuggestions}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>

          {wardrobeItems.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👗</span>
              </div>
              <p className="text-lg">Добавьте вещи в гардероб для получения рекомендаций!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-4 bg-white/10 border-white/20 animate-pulse">
                    <div className="h-32 bg-white/20 rounded mb-4"></div>
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 bg-white/20 rounded"></div>
                  </Card>
                ))
              ) : (
                suggestions.map((suggestion) => (
                  <OutfitSuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onSelect={handleSelectOutfit}
                    weather={weather}
                    isSelected={currentOutfit?.id === suggestion.id}
                  />
                ))
              )}
            </div>
          )}
        </Card>
      )}

      {/* Selected Outfit Display */}
      {currentOutfit && (
        <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 animate-fade-in">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">✨</span>
            <h3 className="text-white font-semibold text-lg">Выбранный образ</h3>
          </div>
          <p className="text-white/80 text-sm mb-4">{currentOutfit.reason}</p>
          <div className="flex flex-wrap gap-2">
            {currentOutfit.items.map((item) => (
              <span key={item.id} className="px-3 py-1 bg-blue-600/30 rounded-full text-white text-sm border border-blue-400/50">
                {item.name}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
