
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
}

const WEATHER_API_KEY = "088790d298bbc9d15357abd6cda175b5";

export const getWeatherByCity = async (city: string = "Moscow"): Promise<WeatherData> => {
  try {
    console.log(`Запрос данных о погоде для города: ${city}`);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`
    );
    
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
      throw new Error('Не удалось получить данные о погоде');
    }
    
    const data = await response.json();
    console.log('Данные о погоде получены:', data);
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      icon: getWeatherIcon(data.weather[0].main),
      description: data.weather[0].description
    };
  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    // Возвращаем заглушку в случае ошибки
    return {
      temperature: 15,
      condition: "переменная облачность",
      humidity: 65,
      windSpeed: 5,
      icon: "🌤️",
      description: "переменная облачность"
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
          
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`
          );
          
          if (!response.ok) {
            console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
            throw new Error('Не удалось получить данные о погоде');
          }
          
          const data = await response.json();
          console.log('Данные о погоде по геолокации получены:', data);
          
          resolve({
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed),
            icon: getWeatherIcon(data.weather[0].main),
            description: data.weather[0].description
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
