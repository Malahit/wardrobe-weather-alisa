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

// Безопасное получение API ключа из переменных окружения
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Кэш для данных о погоде (5 минут)
const CACHE_DURATION = 5 * 60 * 1000;
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();

// Валидация входных данных
const validateCity = (city: string): boolean => {
  return typeof city === 'string' && city.length > 0 && city.length < 100 && /^[a-zA-Zа-яА-Я\s-]+$/.test(city);
};

const validateCoordinates = (lat: number, lon: number): boolean => {
  return typeof lat === 'number' && typeof lon === 'number' && 
         lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

export const getWeatherByCity = async (city: string = "Moscow"): Promise<WeatherData> => {
  try {
    // Валидация входных данных
    if (!validateCity(city)) {
      throw new Error('Некорректное название города');
    }

    if (!WEATHER_API_KEY) {
      console.warn('Weather API key not configured, using fallback data');
      return getFallbackWeatherData();
    }

    // Проверяем кэш
    const cacheKey = `city_${city}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Используем кэшированные данные о погоде');
      return cached.data;
    }

    console.log(`Запрос данных о погоде для города: ${city}`);
    
    // Получаем текущую погоду и прогноз с таймаутом
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`, {
          signal: controller.signal
        }),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`, {
          signal: controller.signal
        })
      ]);

      clearTimeout(timeoutId);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error(`HTTP Error: ${currentResponse.status} / ${forecastResponse.status}`);
      }
      
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      
      // Валидация ответа API
      if (!currentData.main || !currentData.weather || !Array.isArray(currentData.weather)) {
        throw new Error('Некорректный ответ от API погоды');
      }
      
      console.log('Данные о погоде получены:', currentData);
      
      // Обрабатываем прогноз на сегодня (следующие 24 часа)
      const todayForecast: DayForecast[] = (forecastData.list || [])
        .slice(0, 8) // Первые 8 записей (24 часа по 3 часа)
        .map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.round(item.main?.temp || 0),
          condition: item.weather?.[0]?.description || 'неизвестно',
          icon: getWeatherIcon(item.weather?.[0]?.main || 'Clear'),
          precipitation: item.pop ? Math.round(item.pop * 100) : 0
        }));
      
      const weatherData: WeatherData = {
        temperature: Math.round(currentData.main.temp),
        condition: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind?.speed || 0),
        icon: getWeatherIcon(currentData.weather[0].main),
        description: currentData.weather[0].description,
        forecast: todayForecast
      };

      // Сохраняем в кэш
      weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      
      return weatherData;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    return getFallbackWeatherData();
  }
};

const getWeatherIcon = (condition: string): string => {
  const iconMap: { [key: string]: string } = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  
  return iconMap[condition] || '🌤️';
};

export const getWeatherByLocation = async (): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается'));
      return;
    }
    
    const timeoutId = setTimeout(() => {
      reject(new Error('Таймаут получения геолокации'));
    }, 10000);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;
          
          // Валидация координат
          if (!validateCoordinates(latitude, longitude)) {
            throw new Error('Некорректные координаты');
          }

          if (!WEATHER_API_KEY) {
            resolve(getFallbackWeatherData());
            return;
          }

          // Проверяем кэш
          const cacheKey = `coords_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
          const cached = weatherCache.get(cacheKey);
          if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            resolve(cached.data);
            return;
          }

          console.log(`Запрос данных о погоде по координатам: ${latitude}, ${longitude}`);
          
          const controller = new AbortController();
          const apiTimeoutId = setTimeout(() => controller.abort(), 10000);

          try {
            const [currentResponse, forecastResponse] = await Promise.all([
              fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`, {
                signal: controller.signal
              }),
              fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`, {
                signal: controller.signal
              })
            ]);

            clearTimeout(apiTimeoutId);
            
            if (!currentResponse.ok || !forecastResponse.ok) {
              throw new Error(`HTTP Error: ${currentResponse.status} / ${forecastResponse.status}`);
            }
            
            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();
            
            // Валидация ответа
            if (!currentData.main || !currentData.weather) {
              throw new Error('Некорректный ответ от API погоды');
            }
            
            const todayForecast: DayForecast[] = (forecastData.list || [])
              .slice(0, 8)
              .map((item: any) => ({
                time: new Date(item.dt * 1000).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
                temperature: Math.round(item.main?.temp || 0),
                condition: item.weather?.[0]?.description || 'неизвестно',
                icon: getWeatherIcon(item.weather?.[0]?.main || 'Clear'),
                precipitation: item.pop ? Math.round(item.pop * 100) : 0
              }));
            
            const weatherData: WeatherData = {
              temperature: Math.round(currentData.main.temp),
              condition: currentData.weather[0].description,
              humidity: currentData.main.humidity,
              windSpeed: Math.round(currentData.wind?.speed || 0),
              icon: getWeatherIcon(currentData.weather[0].main),
              description: currentData.weather[0].description,
              forecast: todayForecast
            };

            // Сохраняем в кэш
            weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
            
            resolve(weatherData);
          } finally {
            clearTimeout(apiTimeoutId);
          }
        } catch (error) {
          console.error('Ошибка получения погоды по геолокации:', error);
          resolve(getFallbackWeatherData());
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('Ошибка получения геолокации:', error);
        reject(new Error('Не удалось получить местоположение'));
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000 // 5 минут
      }
    );
  });
};

// Fallback данные при недоступности API
const getFallbackWeatherData = (): WeatherData => {
  return {
    temperature: 15,
    condition: "переменная облачность",
    humidity: 65,
    windSpeed: 5,
    icon: "🌤️",
    description: "переменная облачность",
    forecast: [
      {
        time: "12:00",
        temperature: 16,
        condition: "ясно",
        icon: "☀️",
        precipitation: 0
      },
      {
        time: "15:00",
        temperature: 18,
        condition: "переменная облачность",
        icon: "🌤️",
        precipitation: 10
      },
      {
        time: "18:00",
        temperature: 14,
        condition: "облачно",
        icon: "☁️",
        precipitation: 20
      }
    ]
  };
};

export const getClothingRecommendations = (weather: WeatherData): string[] => {
  const recommendations: string[] = [];
  const temp = weather.temperature;
  const condition = weather.condition.toLowerCase();
  
  // Базовые рекомендации по температуре
  if (temp <= -10) {
    recommendations.push("🧥 Теплая зимняя куртка или пуховик");
    recommendations.push("🧣 Шарф и шапка обязательны");
    recommendations.push("🧤 Теплые перчатки");
    recommendations.push("👢 Зимняя обувь");
  } else if (temp <= 0) {
    recommendations.push("🧥 Зимняя куртка");
    recommendations.push("🧣 Шарф рекомендуется");
    recommendations.push("👢 Утепленная обувь");
  } else if (temp <= 10) {
    recommendations.push("🧥 Демисезонная куртка или пальто");
    recommendations.push("👖 Теплые брюки");
    recommendations.push("👞 Закрытая обувь");
  } else if (temp <= 20) {
    recommendations.push("👕 Легкая кофта или свитер");
    recommendations.push("👖 Джинсы или брюки");
    recommendations.push("👟 Удобная обувь");
  } else if (temp <= 25) {
    recommendations.push("👕 Футболка или рубашка");
    recommendations.push("👖 Легкие брюки или джинсы");
    recommendations.push("👟 Легкая обувь");
  } else {
    recommendations.push("👕 Легкая футболка");
    recommendations.push("🩳 Шорты или легкие брюки");
    recommendations.push("👡 Открытая обувь");
  }
  
  // Дополнительные рекомендации по погодным условиям
  if (condition.includes('дождь') || condition.includes('ливень')) {
    recommendations.push("☔ Зонт или дождевик");
    recommendations.push("👢 Водонепроницаемая обувь");
  }
  
  if (condition.includes('снег')) {
    recommendations.push("❄️ Теплая водонепроницаемая обувь");
    recommendations.push("🧥 Дополнительный слой одежды");
  }
  
  if (weather.windSpeed > 5) {
    recommendations.push("🌪️ Ветрозащитная куртка");
  }
  
  return recommendations;
};

// Очистка кэша (можно вызывать периодически)
export const clearWeatherCache = (): void => {
  weatherCache.clear();
};