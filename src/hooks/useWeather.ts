
import { useState, useEffect } from 'react';
import { getWeatherByCity, getWeatherByLocation } from '@/services/weatherService';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
}

export const useWeather = (city?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      
      setWeather(weatherData);
    } catch (err) {
      setError('Не удалось загрузить данные о погоде');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
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
