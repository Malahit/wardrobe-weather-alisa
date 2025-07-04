
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { WardrobeItem } from '@/hooks/useWardrobe';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
  suggestion?: {
    items: string[];
    reason: string;
    confidence: number;
  };
}

interface WardrobeChatbotProps {
  wardrobeItems: WardrobeItem[];
  weather?: any;
}

export const WardrobeChatbot = ({ wardrobeItems, weather }: WardrobeChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Приветственное сообщение
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: `Привет! Я ваш персональный стилист-бот. В вашем гардеробе ${wardrobeItems.length} вещей. ${weather ? `Сегодня ${weather.temperature}°C и ${getWeatherDescription(weather.condition)}.` : ''} Чем могу помочь?`,
        type: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [wardrobeItems.length, weather]);

  const getWeatherDescription = (condition: string) => {
    const conditions: Record<string, string> = {
      'clear': 'ясно',
      'partly-cloudy': 'переменная облачность',
      'cloudy': 'облачно',
      'light-rain': 'небольшой дождь',
      'heavy-rain': 'сильный дождь',
      'snow': 'снег',
      'windy': 'ветрено'
    };
    return conditions[condition] || condition;
  };

  const analyzeWardrobe = () => {
    const categories = wardrobeItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = wardrobeItems.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
    const dominantColor = Object.entries(colors).sort(([,a], [,b]) => b - a)[0];

    return { categories, colors, dominantCategory, dominantColor };
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    const analysis = analyzeWardrobe();
    const temp = weather?.temperature || 15;

    // Анализ запроса пользователя
    if (lowerMessage.includes('что надеть') || lowerMessage.includes('что одеть') || lowerMessage.includes('образ')) {
      const suggestions = generateOutfitSuggestion(temp, weather?.condition);
      return {
        id: Date.now().toString(),
        text: suggestions.text,
        type: 'bot',
        timestamp: new Date(),
        suggestion: suggestions.outfit
      };
    } else if (lowerMessage.includes('анализ') || lowerMessage.includes('статистика')) {
      return {
        id: Date.now().toString(),
        text: `Анализ вашего гардероба:\n• Всего вещей: ${wardrobeItems.length}\n• Преобладающая категория: ${analysis.dominantCategory?.[0] || 'не определена'} (${analysis.dominantCategory?.[1] || 0} вещей)\n• Любимый цвет: ${analysis.dominantColor?.[0] || 'не определен'} (${analysis.dominantColor?.[1] || 0} вещей)\n• Разнообразие категорий: ${Object.keys(analysis.categories).length}`,
        type: 'bot',
        timestamp: new Date()
      };
    } else if (lowerMessage.includes('совет') || lowerMessage.includes('рекомендаци')) {
      return {
        id: Date.now().toString(),
        text: generateStyleAdvice(analysis),
        type: 'bot',
        timestamp: new Date()
      };
    } else if (lowerMessage.includes('цвет')) {
      return {
        id: Date.now().toString(),
        text: generateColorAdvice(analysis.colors),
        type: 'bot',
        timestamp: new Date()
      };
    } else if (lowerMessage.includes('помощь') || lowerMessage.includes('что ты умеешь')) {
      return {
        id: Date.now().toString(),
        text: `Я могу помочь вам с:\n• Подбором образов ("что надеть?")\n• Анализом гардероба ("анализ гардероба")\n• Советами по стилю ("дай совет")\n• Рекомендациями по цветам ("цветовые советы")\n• Общими вопросами о моде и стиле`,
        type: 'bot',
        timestamp: new Date()
      };
    } else {
      return {
        id: Date.now().toString(),
        text: `Интересный вопрос! ${getRandomStyleTip()} Если нужна помощь с выбором образа, просто спросите "что надеть?"`,
        type: 'bot',
        timestamp: new Date()
      };
    }
  };

  // Fixed parameter order: required parameters first, optional parameters last
  const generateOutfitSuggestion = (temperature: number, condition?: string) => {
    const availableItems = wardrobeItems.filter(item => {
      if (item.temperature_min && temperature < item.temperature_min) return false;
      if (item.temperature_max && temperature > item.temperature_max) return false;
      if (condition && item.weather_conditions && !item.weather_conditions.includes(condition)) return false;
      return true;
    });

    if (availableItems.length === 0) {
      return {
        text: "К сожалению, в вашем гардеробе нет подходящих вещей для текущей погоды. Возможно, стоит добавить новые вещи!",
        outfit: null
      };
    }

    const categories = ['top', 'bottom', 'shoes', 'outerwear'];
    const selectedItems = categories.map(cat => {
      const items = availableItems.filter(item => item.category === cat);
      return items[Math.floor(Math.random() * items.length)];
    }).filter(Boolean);

    if (selectedItems.length < 2) {
      return {
        text: "Рекомендую дополнить гардероб базовыми вещами для создания полноценных образов.",
        outfit: null
      };
    }

    const reason = generateOutfitReason(temperature, condition, selectedItems);
    
    return {
      text: `Вот что я рекомендую надеть сегодня: ${reason}`,
      outfit: {
        items: selectedItems.map(item => item.name),
        reason,
        confidence: 0.85
      }
    };
  };

  // Fixed parameter order: required parameters first, optional parameters last
  const generateOutfitReason = (temp: number, condition: string | undefined, items: WardrobeItem[]) => {
    const reasons = [];
    
    if (temp < 10) {
      reasons.push("для прохладной погоды выбрал теплые вещи");
    } else if (temp > 25) {
      reasons.push("для жаркой погоды подобрал легкие материалы");
    } else {
      reasons.push("комфортная погода позволяет разнообразие");
    }

    if (condition === 'light-rain' || condition === 'heavy-rain') {
      reasons.push("учитывая дождь, стоит взять водонепроницаемые вещи");
    }

    const colors = items.map(item => item.color);
    const uniqueColors = [...new Set(colors)];
    
    if (uniqueColors.length <= 2) {
      reasons.push("цвета хорошо сочетаются");
    }

    return reasons.join(", ");
  };

  const generateStyleAdvice = (analysis: any) => {
    const tips = [
      `У вас много вещей категории "${analysis.dominantCategory?.[0]}" - попробуйте разнообразить гардероб другими типами одежды.`,
      `Цвет "${analysis.dominantColor?.[0]}" преобладает в вашем гардеробе. Добавьте контрастные оттенки для создания интересных образов.`,
      "Инвестируйте в качественные базовые вещи - они станут основой многих образов.",
      "Не бойтесь экспериментировать с аксессуарами - они могут полностью изменить образ."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const generateColorAdvice = (colors: Record<string, number>) => {
    const colorCount = Object.keys(colors).length;
    
    if (colorCount < 5) {
      return "Ваш гардероб довольно монохромный. Попробуйте добавить 2-3 новых цвета для разнообразия образов.";
    } else if (colorCount > 10) {
      return "У вас очень разнообразная цветовая палитра! Попробуйте создавать образы в одной цветовой гамме для более гармоничного вида.";
    } else {
      return "Отличный баланс цветов в гардеробе! Используйте правило 60-30-10: основной цвет, дополнительный и акцентный.";
    }
  };

  const getRandomStyleTip = () => {
    const tips = [
      "Помните: стиль - это способ выразить себя без слов.",
      "Качество важнее количества - лучше иметь меньше, но лучших вещей.",
      "Не следуйте слепо моде - выбирайте то, что подходит именно вам.",
      "Аксессуары могут превратить простой образ в стильный."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Имитация печати бота
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: '1',
        text: `Привет! Я ваш персональный стилист-бот. В вашем гардеробе ${wardrobeItems.length} вещей. Чем могу помочь?`,
        type: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Стилист-бот</h3>
            <p className="text-white/60 text-sm">Персональный консультант по стилю</p>
          </div>
        </div>
        <Button
          onClick={clearChat}
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-center space-x-2 mb-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'bot' && <Bot className="w-4 h-4 text-purple-400" />}
                <span className="text-xs text-white/60">
                  {message.type === 'user' ? 'Вы' : 'Стилист-бот'}
                </span>
                {message.type === 'user' && <User className="w-4 h-4 text-blue-400" />}
              </div>
              
              <div className={`p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/20 text-white border border-white/30'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                
                {message.suggestion && (
                  <div className="mt-3 p-3 bg-white/20 rounded-lg border border-purple-400/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-300">Рекомендованный образ</span>
                      <Badge className="text-xs bg-purple-500/30 text-purple-200">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {Math.round(message.suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {message.suggestion.items.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-600/30 rounded-full text-xs text-purple-200 border border-purple-400/50">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-white/80">{message.suggestion.reason}</p>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-white/40 mt-1 text-center">
                {message.timestamp.toLocaleTimeString('ru', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white/20 p-3 rounded-2xl border border-white/30">
              <Bot className="w-4 h-4 text-purple-400" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Спросите что-нибудь о стиле или гардеробе..."
            className="w-full p-3 pr-12 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={1}
            disabled={isTyping}
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
          className="bg-purple-600 hover:bg-purple-700 rounded-2xl px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
