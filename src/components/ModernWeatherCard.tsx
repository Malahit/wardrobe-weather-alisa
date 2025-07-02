
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MapPin, Thermometer, Wind, Droplets, Clock, Umbrella, Sun } from 'lucide-react';
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

export const ModernWeatherCard = ({ weather, loading, error, onRefresh }: WeatherCardProps) => {
  if (loading) {
    return (
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto"></div>
          <div className="h-8 bg-blue-200 rounded mx-auto w-32"></div>
          <div className="h-4 bg-blue-200 rounded mx-auto w-48"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <div className="text-center text-red-700">
          <p className="mb-4 font-medium">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} className="bg-red-600 hover:bg-red-700 text-white">
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
      <Card className="p-8 bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
        <div className="text-center text-gray-600">
          <p className="font-medium">Данные о погоде недоступны</p>
        </div>
      </Card>
    );
  }

  const recommendations = getClothingRecommendations(weather);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-blue-200 shadow-lg">
      {/* Заголовок с обновлением */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Погода и рекомендации</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Ваше местоположение</span>
            </div>
          </div>
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Текущая погода */}
        <div className="lg:col-span-1">
          <div className="text-center bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-6xl mb-3">{weather.icon}</div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {weather.temperature}°C
            </div>
            <p className="text-gray-600 capitalize text-lg mb-4">{weather.description}</p>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-center space-x-2 bg-white/70 rounded-lg p-3">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">{weather.humidity}%</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/70 rounded-lg p-3">
                <Wind className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{weather.windSpeed} м/с</span>
              </div>
            </div>
          </div>
        </div>

        {/* Прогноз и рекомендации */}
        <div className="lg:col-span-2 space-y-6">
          {/* Прогноз на день */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Прогноз на сегодня</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weather.forecast.slice(0, 4).map((forecast, index) => (
                  <div key={index} className="text-center bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-2 font-medium">{forecast.time}</p>
                    <div className="text-2xl mb-2">{forecast.icon}</div>
                    <p className="text-sm font-bold text-gray-800">{forecast.temperature}°C</p>
                    {forecast.precipitation !== undefined && forecast.precipitation > 0 && (
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <Umbrella className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-600 text-xs font-medium">{forecast.precipitation}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Рекомендации по одежде */}
          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <span>Что надеть сегодня</span>
            </h3>
            <div className="grid gap-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white/70 rounded-lg p-4">
                  <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
