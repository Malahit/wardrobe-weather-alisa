
import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { WardrobeSection } from "@/components/WardrobeSection";
import { OutfitRecommendations } from "@/components/OutfitRecommendations";
import { MarketplaceRecommendations } from "@/components/MarketplaceRecommendations";
import { VoiceAssistant } from "@/components/VoiceAssistant";

const Index = () => {
  const [weather, setWeather] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [currentOutfit, setCurrentOutfit] = useState(null);

  // Симуляция загрузки погодных данных
  useEffect(() => {
    setTimeout(() => {
      setWeather({
        temperature: 15,
        condition: "дождь",
        humidity: 80,
        windSpeed: 10,
        icon: "🌧️"
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
            WeatherWardrobe
          </h1>
          <p className="text-white/80 text-lg animate-fade-in">
            Ваш умный помощник в подборе образов
          </p>
        </header>

        {/* Voice Assistant */}
        <VoiceAssistant />

        {/* Weather Card */}
        <div className="mb-8 animate-fade-in">
          <WeatherCard weather={weather} />
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
          <WardrobeSection 
            items={wardrobeItems}
            setItems={setWardrobeItems}
          />
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
