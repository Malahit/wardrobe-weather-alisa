
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModernWeatherCard } from "@/components/ModernWeatherCard";
import { WardrobeSection } from "@/components/WardrobeSection";
import { OutfitRecommendations } from "@/components/OutfitRecommendations";
import { SavedOutfitsSection } from "@/components/SavedOutfitsSection";
import { WardrobeStatistics } from "@/components/WardrobeStatistics";
import { MarketplaceRecommendations } from "@/components/MarketplaceRecommendations";
import { PersonalStylist } from "@/components/PersonalStylist";
import { VoiceOutfitAssistant } from "@/components/VoiceOutfitAssistant";
import { StyleRecommendations } from "@/components/StyleRecommendations";
import { OutfitVisualizationService } from "@/components/OutfitVisualizationService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useWardrobe } from "@/hooks/useWardrobe";
import { useWeather } from "@/hooks/useWeather";
import { OutfitSuggestion } from "@/services/outfitService";
import { Mic, Heart, BarChart3, ShoppingBag, User, Palette, LogOut, Sparkles, Image } from "lucide-react";

const Index = () => {
  const [currentOutfit, setCurrentOutfit] = useState<OutfitSuggestion | null>(null);
  
  const { user, signOut } = useAuth();
  const { items: wardrobeItems } = useWardrobe();
  const { weather, loading: weatherLoading, error: weatherError, refetch } = useWeather();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="text-4xl">✨</span>
            <h1 className="text-5xl font-bold text-white animate-fade-in tracking-tight">
              StyleAssistant AI
            </h1>
            <span className="text-4xl">👗</span>
          </div>
          <p className="text-white/90 text-xl animate-fade-in font-light">
            Ваш персональный стилист с искусственным интеллектом
          </p>
          {user && (
            <div className="absolute top-0 right-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white/90 font-medium">
                  {user.user_metadata?.full_name || 'Пользователь'}
                </div>
                <div className="text-white/60 text-sm">
                  {user.email}
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </header>

        {/* Weather Card */}
        <div className="mb-8 animate-fade-in">
          <ModernWeatherCard 
            weather={weather} 
            loading={weatherLoading} 
            error={weatherError}
            onRefresh={refetch}
          />
        </div>

        {/* Main Content Tabs */}
        <div className="animate-fade-in">
          <Tabs defaultValue="assistant" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl p-2">
              <TabsTrigger 
                value="assistant" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Ассистент</span>
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Галерея</span>
              </TabsTrigger>
              <TabsTrigger 
                value="styles" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Стили</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stylist" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Стилист</span>
              </TabsTrigger>
              <TabsTrigger 
                value="wardrobe" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Гардероб</span>
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Избранное</span>
              </TabsTrigger>
              <TabsTrigger 
                value="statistics" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Статистика</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistant" className="mt-8">
              <VoiceOutfitAssistant />
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-8">
              <OutfitVisualizationService />
            </TabsContent>
            
            <TabsContent value="styles" className="mt-8">
              <StyleRecommendations />
            </TabsContent>
            
            <TabsContent value="stylist" className="space-y-8 mt-8">
              <PersonalStylist 
                wardrobeItems={wardrobeItems}
                weather={weather}
              />
              <MarketplaceRecommendations 
                weather={weather}
                wardrobeItems={wardrobeItems}
              />
            </TabsContent>
            
            <TabsContent value="wardrobe" className="space-y-8 mt-8">
              <OutfitRecommendations 
                weather={weather} 
                wardrobeItems={wardrobeItems}
                currentOutfit={currentOutfit}
                setCurrentOutfit={setCurrentOutfit}
              />
              <WardrobeSection />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-8">
              <SavedOutfitsSection />
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-8">
              <WardrobeStatistics />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-white/70 text-sm">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <span className="font-medium">Создано с ❤️ для стильных людей</span>
          </div>
          <div className="flex items-center justify-center space-x-8 text-xs">
            <span className="flex items-center space-x-2">
              <span>📊</span>
              <span>{wardrobeItems.length} вещей в гардеробе</span>
            </span>
            {weather && (
              <span className="flex items-center space-x-2">
                <span>🌡️</span>
                <span>{weather.temperature}°C сейчас</span>
              </span>
            )}
            <span className="flex items-center space-x-2">
              <span>✨</span>
              <span>Powered by AI</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
