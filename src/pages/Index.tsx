import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModernWeatherCard } from "@/components/ModernWeatherCard";
import { WardrobeSection } from "@/components/WardrobeSection";
import { SavedOutfitsSection } from "@/components/SavedOutfitsSection";
import { WardrobeStatistics } from "@/components/WardrobeStatistics";
import { MarketplaceRecommendations } from "@/components/MarketplaceRecommendations";
import { EnhancedOutfitGallery } from "@/components/EnhancedOutfitGallery";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkipLink } from "@/components/ui/skip-link";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import { useWardrobe } from "@/hooks/useWardrobe";
import { useWeather } from "@/hooks/useWeather";
import { OutfitSuggestion } from "@/services/outfitService";
import { Heart, BarChart3, ShoppingBag, Sparkles, LogOut, Image } from "lucide-react";

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
      <SkipLink href="#main-content">Перейти к основному содержимому</SkipLink>
      
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
            <span className="text-4xl" role="img" aria-label="sparkles">✨</span>
            <h1 className="text-5xl font-bold text-white animate-fade-in tracking-tight">
              StyleAssistant AI
            </h1>
            <span className="text-4xl" role="img" aria-label="dress">👗</span>
          </div>
          <p className="text-white/90 text-xl animate-fade-in font-light">
            Ваш персональный стилист с искусственным интеллектом
          </p>
          
          {!user && (
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-lg mx-auto">
              <p className="text-white/80 text-sm">
                💡 Приложение работает без регистрации! Все данные сохраняются локально. 
                <br />
                Для синхронизации между устройствами можно создать аккаунт.
              </p>
            </div>
          )}
          {user ? (
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
                aria-label="Выйти из аккаунта"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="absolute top-0 right-0">
              <Button
                onClick={() => navigate('/auth')}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                aria-label="Войти в аккаунт"
              >
                Войти
              </Button>
            </div>
          )}
        </header>

        {/* Weather Card */}
        <div className="mb-8 animate-fade-in">
          <ErrorBoundary>
            <ModernWeatherCard 
              weather={weather} 
              loading={weatherLoading} 
              error={weatherError}
              onRefresh={refetch}
            />
          </ErrorBoundary>
        </div>

        {/* Main Content Tabs */}
        <main id="main-content" className="animate-fade-in">
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList 
              className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl p-2"
              role="tablist"
              aria-label="Основные разделы приложения"
            >
              <TabsTrigger 
                value="gallery" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
                aria-label="Галерея образов"
              >
                <Image className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Галерея</span>
              </TabsTrigger>
              <TabsTrigger 
                value="shopping" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
                aria-label="Магазин товаров"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Магазин</span>
              </TabsTrigger>
              <TabsTrigger 
                value="wardrobe" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
                aria-label="Мой гардероб"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Гардероб</span>
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
                aria-label="Избранные образы"
              >
                <Heart className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Избранное</span>
              </TabsTrigger>
              <TabsTrigger 
                value="statistics" 
                className="flex items-center space-x-2 data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/70 rounded-xl py-3 font-medium"
                aria-label="Статистика гардероба"
              >
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Статистика</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="mt-8" role="tabpanel" aria-labelledby="gallery-tab">
              <ErrorBoundary>
                <EnhancedOutfitGallery weather={weather} />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="shopping" className="mt-8" role="tabpanel" aria-labelledby="shopping-tab">
              <ErrorBoundary>
                <ShoppingSection />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="wardrobe" className="space-y-8 mt-8" role="tabpanel" aria-labelledby="wardrobe-tab">
              <ErrorBoundary>
                <WardrobeSection />
                <MarketplaceRecommendations 
                  weather={weather}
                  wardrobeItems={wardrobeItems}
                />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-8" role="tabpanel" aria-labelledby="saved-tab">
              <ErrorBoundary>
                <SavedOutfitsSection />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-8" role="tabpanel" aria-labelledby="statistics-tab">
              <ErrorBoundary>
                <WardrobeStatistics />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-white/70 text-sm" role="contentinfo">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <span className="font-medium">Создано с ❤️ для стильных людей</span>
          </div>
          <div className="flex items-center justify-center space-x-8 text-xs">
            <span className="flex items-center space-x-2">
              <span role="img" aria-label="chart">📊</span>
              <span>{wardrobeItems.length} вещей в гардеробе</span>
            </span>
            {weather && (
              <span className="flex items-center space-x-2">
                <span role="img" aria-label="thermometer">🌡️</span>
                <span>{weather.temperature}°C сейчас</span>
              </span>
            )}
            <span className="flex items-center space-x-2">
              <span role="img" aria-label="sparkles">✨</span>
              <span>Powered by AI</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;