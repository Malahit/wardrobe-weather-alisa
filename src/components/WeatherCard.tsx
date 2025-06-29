
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherProps {
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  } | null;
}

export const WeatherCard = ({ weather }: WeatherProps) => {
  if (!weather) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-pulse">
        <div className="flex items-center justify-center h-32">
          <div className="text-white/60">Загрузка погоды...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover-scale">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-6xl">{weather.icon}</div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              {weather.temperature}°C
            </h2>
            <p className="text-white/80 capitalize text-lg">
              {weather.condition}
            </p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="mb-2 bg-white/20 text-white">
            Влажность: {weather.humidity}%
          </Badge>
          <br />
          <Badge variant="secondary" className="bg-white/20 text-white">
            Ветер: {weather.windSpeed} м/с
          </Badge>
        </div>
      </div>
    </Card>
  );
};
