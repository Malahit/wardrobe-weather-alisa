
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MapPin, Thermometer, Wind, Droplets, Clock, Umbrella } from 'lucide-react';
import { getClothingRecommendations } from '@/services/weatherService';

interface WeatherCardProps {
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    description: string;
    forecast?: Array<{
      time: string;
      temperature: number;
      condition: string;
      icon: string;
      precipitation?: number;
    }>;
  } | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export const EnhancedWeatherCard = ({ weather, loading, error, onRefresh }: WeatherCardProps) => {
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

  const recommendations = getClothingRecommendations(weather);

  return (
    <div className="space-y-4">
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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Текущая погода */}
          <div className="text-center">
            <div className="text-6xl mb-2">{weather.icon}</div>
            <div className="text-4xl font-bold text-white mb-2">
              {weather.temperature}°C
            </div>
            <p className="text-white/80 text-lg capitalize">{weather.description}</p>
          </div>

          {/* Детали погоды */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-white/70">
              <Droplets className="w-5 h-5" />
              <span>Влажность: {weather.humidity}%</span>
            </div>
            <div className="flex items-center space-x-3 text-white/70">
              <Wind className="w-5 h-5" />
              <span>Ветер: {weather.windSpeed} м/с</span>
            </div>
            <div className="flex items-center space-x-3 text-white/70">
              <Thermometer className="w-5 h-5" />
              <span>Ощущается как {weather.temperature}°C</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Прогноз на день */}
      {weather.forecast && weather.forecast.length > 0 && (
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Прогноз на сегодня</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {weather.forecast.slice(0, 4).map((forecast, index) => (
              <div key={index} className="text-center bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-sm mb-2">{forecast.time}</p>
                <div className="text-2xl mb-2">{forecast.icon}</div>
                <p className="text-white font-medium">{forecast.temperature}°C</p>
                {forecast.precipitation !== undefined && forecast.precipitation > 0 && (
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Umbrella className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 text-xs">{forecast.precipitation}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Рекомендации по одежде */}
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <h3 className="text-white font-semibold mb-4">Рекомендации по одежде</h3>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-center space-x-3 text-white/80">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="text-sm">{rec}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
