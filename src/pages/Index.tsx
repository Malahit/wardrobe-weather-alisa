
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModernWeatherCard } from "@/components/ModernWeatherCard";
import { WardrobeSection } from "@/components/WardrobeSection";
import { SavedOutfitsSection } from "@/components/SavedOutfitsSection";
import { WardrobeStatistics } from "@/components/WardrobeStatistics";
import { MarketplaceRecommendations } from "@/components/MarketplaceRecommendations";
import { SmartOutfitAssistant } from "@/components/SmartOutfitAssistant";
import { DynamicOutfitGallery } from "@/components/DynamicOutfitGallery";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useWardrobe } from "@/hooks/useWardrobe";
import { useWeather } from "@/hooks/useWeather";
import { OutfitSuggestion } from "@/services/outfitService";
import { Mic, Heart, BarChart3, ShoppingBag, Sparkles, LogOut, Image } from "lucide-react";

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
      <style>{`
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
            <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl p-2">
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
              <SmartOutfitAssistant 
                wardrobeItems={wardrobeItems}
                weather={weather}
                currentOutfit={currentOutfit}
                setCurrentOutfit={setCurrentOutfit}
              />
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-8">
              <DynamicOutfitGallery weather={weather} />
            </TabsContent>
            
            <TabsContent value="wardrobe" className="space-y-8 mt-8">
              <WardrobeSection />
              <MarketplaceRecommendations 
                weather={weather}
                wardrobeItems={wardrobeItems}
              />
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
