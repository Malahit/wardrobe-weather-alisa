
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, Thermometer, Wind, Droplets } from "lucide-react";

interface WeatherCardProps {
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    description: string;
  } | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export const WeatherCard = ({ weather, loading, error, onRefresh }: WeatherCardProps) => {
  if (loading) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-pulse">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-32 mx-auto"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center text-white/80">
          <p className="mb-4">{error}</p>
          {onRefresh && (
            <Button 
              onClick={onRefresh}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center text-white/60">
          <p>Данные о погоде недоступны</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover-scale">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-white/80">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Текущая локация</span>
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{weather.icon}</div>
        <div className="text-4xl font-bold text-white mb-2">
          {weather.temperature}°C
        </div>
        <p className="text-white/80 text-lg capitalize">{weather.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 text-white/70">
          <Droplets className="w-4 h-4" />
          <span className="text-sm">Влажность: {weather.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2 text-white/70">
          <Wind className="w-4 h-4" />
          <span className="text-sm">Ветер: {weather.windSpeed} м/с</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <p className="text-white/80 text-sm text-center">
          {weather.temperature <= 5 && "🧥 Одевайтесь теплее!"}
          {weather.temperature > 5 && weather.temperature <= 15 && "🧥 Возьмите легкую куртку"}
          {weather.temperature > 15 && weather.temperature <= 25 && "👕 Отличная погода для прогулок"}
          {weather.temperature > 25 && "🩳 Идеальная погода для летней одежды"}
        </p>
      </div>
    </Card>
  );
};
