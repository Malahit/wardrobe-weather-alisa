import { useState, useEffect } from 'react';
import { getWeatherByCity, getWeatherByLocation } from '@/services/weatherService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
  forecast?: DayForecast[];
}

interface DayForecast {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  precipitation?: number;
}

export const useWeather = (city?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleAsyncError } = useErrorHandler();

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    
    const result = await handleAsyncError(async () => {
      let weatherData: WeatherData;
      
      if (city) {
        weatherData = await getWeatherByCity(city);
      } else {
        try {
          weatherData = await getWeatherByLocation();
        } catch (locationError) {
          // Если не удалось получить по геолокации, используем Москву по умолчанию
          weatherData = await getWeatherByCity('Moscow');
        }
      }
      
      return weatherData;
    }, { 
      showToast: false,
      logError: true 
    });

    if (result) {
      setWeather(result);
    } else {
      setError('Не удалось загрузить данные о погоде');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather
  };
};