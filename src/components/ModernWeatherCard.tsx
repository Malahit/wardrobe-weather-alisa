import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MapPin, Thermometer, Wind, Droplets, Clock, Umbrella, Sun } from 'lucide-react';
import { getClothingRecommendations } from '@/services/weatherService';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AccessibleButton } from '@/components/AccessibleButton';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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
  const { handleAsyncError } = useErrorHandler();

  const handleRefresh = () => {
    if (onRefresh) {
      handleAsyncError(
        async () => onRefresh(),
        { fallbackMessage: 'Не удалось обновить данные о погоде' }
      );
    }
  };

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-center space-x-4">
          <LoadingSpinner size="md" className="text-blue-500" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-blue-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-blue-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorBoundary fallback={
        <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-red-700 font-medium text-sm">{error}</p>
            {onRefresh && (
              <AccessibleButton 
                onClick={handleRefresh} 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white"
                ariaLabel="Повторить загрузку погоды"
              >
                <RefreshCw className="w-4 h-4" />
              </AccessibleButton>
            )}
          </div>
        </Card>
      }>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-red-700 font-medium text-sm">{error}</p>
            {onRefresh && (
              <AccessibleButton 
                onClick={handleRefresh} 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white"
                ariaLabel="Повторить загрузку погоды"
              >
                <RefreshCw className="w-4 h-4" />
              </AccessibleButton>
            )}
          </div>
        </Card>
      </ErrorBoundary>
    );
  }

  if (!weather) {
    return (
      <Card className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
        <p className="text-gray-600 text-sm font-medium">Данные о погоде недоступны</p>
      </Card>
    );
  }

  const recommendations = getClothingRecommendations(weather);

  return (
    <ErrorBoundary>
      <Card className="p-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-blue-200 shadow-md">
        {/* Компактный заголовок */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Погода</h2>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>Ваше местоположение</span>
              </div>
            </div>
          </div>
          {onRefresh && (
            <AccessibleButton 
              onClick={handleRefresh} 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              ariaLabel="Обновить данные о погоде"
            >
              <RefreshCw className="w-4 h-4" />
            </AccessibleButton>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Текущая погода - компактная версия */}
          <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="text-4xl" role="img" aria-label={weather.description}>
                {weather.icon}
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-800">{weather.temperature}°C</div>
                <p className="text-gray-600 capitalize text-sm">{weather.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center space-x-1 text-xs text-gray-700">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-700">
                <Wind className="w-3 h-3 text-gray-500" />
                <span>{weather.windSpeed} м/с</span>
              </div>
            </div>
          </div>

          {/* Прогноз и рекомендации - компактная версия */}
          <div className="space-y-3">
            {/* Мини-прогноз */}
            {weather.forecast && weather.forecast.length > 0 && (
              <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-1 text-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Сегодня</span>
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  {weather.forecast.slice(0, 3).map((forecast, index) => (
                    <div key={index} className="text-center bg-white/70 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-1">{forecast.time}</p>
                      <div className="text-lg mb-1" role="img" aria-label={forecast.condition}>
                        {forecast.icon}
                      </div>
                      <p className="text-xs font-bold text-gray-800">{forecast.temperature}°C</p>
                      {forecast.precipitation !== undefined && forecast.precipitation > 0 && (
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          <Umbrella className="w-2 h-2 text-blue-400" />
                          <span className="text-blue-600 text-xs">{forecast.precipitation}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Компактные рекомендации */}
            <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-1 text-sm">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>Что надеть</span>
              </h3>
              <div className="space-y-1">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs text-gray-700">
                    <span className="w-1 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
                {recommendations.length > 2 && (
                  <p className="text-xs text-gray-500 italic">+{recommendations.length - 2} рекомендаций</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ErrorBoundary>
  );
};