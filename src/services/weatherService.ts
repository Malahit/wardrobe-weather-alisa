
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

const WEATHER_API_KEY = "088790d298bbc9d15357abd6cda175b5";

export const getWeatherByCity = async (city: string = "Moscow"): Promise<WeatherData> => {
  try {
    console.log(`Запрос данных о погоде для города: ${city}`);
    
    // Получаем текущую погоду и прогноз
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`)
    ]);
    
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Не удалось получить данные о погоде');
    }
    
    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    
    console.log('Данные о погоде получены:', currentData);
    console.log('Прогноз получен:', forecastData);
    
    // Обрабатываем прогноз на сегодня (следующие 24 часа)
    const todayForecast: DayForecast[] = forecastData.list
      .slice(0, 8) // Первые 8 записей (24 часа по 3 часа)
      .map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].description,
        icon: getWeatherIcon(item.weather[0].main),
        precipitation: item.pop ? Math.round(item.pop * 100) : 0
      }));
    
    return {
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed),
      icon: getWeatherIcon(currentData.weather[0].main),
      description: currentData.weather[0].description,
      forecast: todayForecast
    };
  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    return {
      temperature: 15,
      condition: "переменная облачность",
      humidity: 65,
      windSpeed: 5,
      icon: "🌤️",
      description: "переменная облачность",
      forecast: []
    };
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
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log(`Запрос данных о погоде по координатам: ${latitude}, ${longitude}`);
          
          const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`)
          ]);
          
          if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Не удалось получить данные о погоде');
          }
          
          const currentData = await currentResponse.json();
          const forecastData = await forecastResponse.json();
          
          const todayForecast: DayForecast[] = forecastData.list
            .slice(0, 8)
            .map((item: any) => ({
              time: new Date(item.dt * 1000).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
              temperature: Math.round(item.main.temp),
              condition: item.weather[0].description,
              icon: getWeatherIcon(item.weather[0].main),
              precipitation: item.pop ? Math.round(item.pop * 100) : 0
            }));
          
          resolve({
            temperature: Math.round(currentData.main.temp),
            condition: currentData.weather[0].description,
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed),
            icon: getWeatherIcon(currentData.weather[0].main),
            description: currentData.weather[0].description,
            forecast: todayForecast
          });
        } catch (error) {
          console.error('Ошибка получения погоды по геолокации:', error);
          reject(error);
        }
      },
      (error) => {
        console.error('Ошибка получения геолокации:', error);
        reject(new Error('Не удалось получить местоположение'));
      }
    );
  });
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
