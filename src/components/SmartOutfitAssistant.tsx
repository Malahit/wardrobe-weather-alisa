
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageSquare, Sparkles, User, Star, RefreshCw } from 'lucide-react';
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

interface StyleAdvice {
  title: string;
  description: string;
  items: string[];
  tip: string;
  confidence: number;
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
  const [currentAdvice, setCurrentAdvice] = useState<StyleAdvice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'voice' | 'suggestions' | 'stylist'>('voice');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeSpeechRecognition();
    generateSuggestions();
  }, [weather, wardrobeItems]);

  const initializeSpeechRecognition = async () => {
    // Проверяем сохраненное состояние разрешения
    const savedPermission = localStorage.getItem('microphone-permission');
    
    if (savedPermission === 'granted') {
      setupSpeechRecognition();
      return;
    }

    try {
      const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
      permission.getTracks().forEach(track => track.stop());
      
      // Сохраняем разрешение
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

  const generateStyleAdvice = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const advice = analyzeStyleAndGenerateAdvice();
    setCurrentAdvice(advice);
    setIsGenerating(false);
  };

  const analyzeStyleAndGenerateAdvice = (): StyleAdvice => {
    const categories = wardrobeItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = wardrobeItems.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantColor = Object.entries(colors).sort(([,a], [,b]) => b - a)[0]?.[0] || 'нейтральный';
    const temp = weather?.temperature || 15;
    
    const adviceOptions = [
      {
        title: "Капсульный гардероб",
        description: `Ваш гардероб имеет хорошую основу в ${dominantColor} цвете. Рекомендую создать капсульную коллекцию из 10-15 базовых вещей.`,
        items: [
          "Базовые футболки нейтральных цветов",
          "Классические джинсы",
          "Белая рубашка",
          "Универсальный пиджак"
        ],
        tip: "Правило 70/30: 70% базовых вещей, 30% ярких акцентов",
        confidence: 0.85
      },
      {
        title: "Сезонный стиль",
        description: `При температуре ${temp}°C рекомендую многослойность для адаптации к изменениям температуры.`,
        items: [
          "Легкий кардиган или жакет",
          "Базовый топ",
          "Удобные брюки",
          "Универсальная обувь"
        ],
        tip: temp < 15 ? "Добавьте теплые аксессуары" : "Выбирайте дышащие ткани",
        confidence: 0.90
      }
    ];

    return adviceOptions[Math.floor(Math.random() * adviceOptions.length)];
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
            Рекомендации
          </Button>
          <Button
            onClick={() => setActiveMode('stylist')}
            variant={activeMode === 'stylist' ? 'default' : 'outline'}
            className={activeMode === 'stylist' 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <User className="w-4 h-4 mr-2" />
            Стилист
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

      {/* Stylist Mode */}
      {activeMode === 'stylist' && (
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Персональный стилист</h2>
                <p className="text-white/60">ИИ-анализ вашего стиля</p>
              </div>
            </div>
            
            <Button
              onClick={generateStyleAdvice}
              disabled={isGenerating || wardrobeItems.length === 0}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Анализирую...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Получить совет
                </>
              )}
            </Button>
          </div>

          {currentAdvice ? (
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 border border-pink-400/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{currentAdvice.title}</h3>
                <Badge className="text-green-400 bg-white/10">
                  <Star className="w-3 h-3 mr-1" />
                  {Math.round(currentAdvice.confidence * 100)}%
                </Badge>
              </div>
              
              <p className="text-white/80 mb-6">{currentAdvice.description}</p>
              
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Рекомендуемые элементы:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentAdvice.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-white/70">
                      <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h5 className="text-white font-medium mb-1">Совет стилиста:</h5>
                    <p className="text-white/80 text-sm">{currentAdvice.tip}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white/60">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-lg">Нажмите кнопку выше для получения персональных рекомендаций</p>
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
