
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WeatherCard } from "@/components/WeatherCard";
import { WardrobeSection } from "@/components/WardrobeSection";
import { OutfitRecommendations } from "@/components/OutfitRecommendations";
import { MarketplaceRecommendations } from "@/components/MarketplaceRecommendations";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useWardrobe } from "@/hooks/useWardrobe";
import { useWeather } from "@/hooks/useWeather";
import { OutfitSuggestion } from "@/services/outfitService";

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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
            WeatherWardrobe
          </h1>
          <p className="text-white/80 text-lg animate-fade-in">
            Ваш умный помощник в подборе образов
          </p>
          {user && (
            <div className="absolute top-0 right-0 flex items-center space-x-4">
              <span className="text-white/80">
                Привет, {user.user_metadata?.full_name || user.email}!
              </span>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Выйти
              </Button>
            </div>
          )}
        </header>

        {/* Voice Assistant */}
        <VoiceAssistant />

        {/* Weather Card */}
        <div className="mb-8 animate-fade-in">
          <WeatherCard 
            weather={weather} 
            loading={weatherLoading} 
            error={weatherError}
            onRefresh={refetch}
          />
        </div>

        {/* Outfit Recommendations */}
        <div className="mb-8 animate-fade-in">
          <OutfitRecommendations 
            weather={weather} 
            wardrobeItems={wardrobeItems}
            currentOutfit={currentOutfit}
            setCurrentOutfit={setCurrentOutfit}
          />
        </div>

        {/* Wardrobe Section */}
        <div className="mb-8 animate-fade-in">
          <WardrobeSection />
        </div>

        {/* Marketplace Recommendations */}
        <div className="animate-fade-in">
          <MarketplaceRecommendations 
            weather={weather}
            wardrobeItems={wardrobeItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
