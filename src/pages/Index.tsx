
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnhancedWeatherCard } from "@/components/EnhancedWeatherCard";
import { WardrobeSection } from "@/components/WardrobeSection";
import { OutfitRecommendations } from "@/components/OutfitRecommendations";
import { SavedOutfitsSection } from "@/components/SavedOutfitsSection";
import { WardrobeStatistics } from "@/components/WardrobeStatistics";
import { MarketplaceRecommendations } from "@/components/MarketplaceRecommendations";
import { PersonalStylist } from "@/components/PersonalStylist";
import { YandexAliceIntegration } from "@/components/YandexAliceIntegration";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useWardrobe } from "@/hooks/useWardrobe";
import { useWeather } from "@/hooks/useWeather";
import { OutfitSuggestion } from "@/services/outfitService";
import { Shirt, Heart, BarChart3, ShoppingBag, User, Mic, LogOut } from "lucide-react";

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
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="text-4xl">👗</span>
            <h1 className="text-4xl font-bold text-white animate-fade-in">
              WeatherWardrobe
            </h1>
            <span className="text-4xl">☀️</span>
          </div>
          <p className="text-white/80 text-lg animate-fade-in">
            Ваш умный помощник в подборе образов
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
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </header>

        {/* Weather Card */}
        <div className="mb-8 animate-fade-in">
          <EnhancedWeatherCard 
            weather={weather} 
            loading={weatherLoading} 
            error={weatherError}
            onRefresh={refetch}
          />
        </div>

        {/* Main Content Tabs */}
        <div className="animate-fade-in">
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg border-white/20">
              <TabsTrigger 
                value="recommendations" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <Shirt className="w-4 h-4" />
                <span className="hidden sm:inline">Образы</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stylist" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Стилист</span>
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Сохранённые</span>
              </TabsTrigger>
              <TabsTrigger 
                value="statistics" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Статистика</span>
              </TabsTrigger>
              <TabsTrigger 
                value="assistant" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Помощник</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendations" className="space-y-8 mt-6">
              <OutfitRecommendations 
                weather={weather} 
                wardrobeItems={wardrobeItems}
                currentOutfit={currentOutfit}
                setCurrentOutfit={setCurrentOutfit}
              />
              <WardrobeSection />
            </TabsContent>
            
            <TabsContent value="stylist" className="space-y-8 mt-6">
              <PersonalStylist 
                wardrobeItems={wardrobeItems}
                weather={weather}
              />
              <MarketplaceRecommendations 
                weather={weather}
                wardrobeItems={wardrobeItems}
              />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              <SavedOutfitsSection />
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-6">
              <WardrobeStatistics />
            </TabsContent>
            
            <TabsContent value="assistant" className="mt-6">
              <YandexAliceIntegration />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/60 text-sm">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span>Сделано с ❤️ для стильных людей</span>
          </div>
          <div className="flex items-center justify-center space-x-6">
            <span>📊 {wardrobeItems.length} вещей в гардеробе</span>
            {weather && <span>🌡️ {weather.temperature}°C</span>}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
