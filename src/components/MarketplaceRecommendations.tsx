
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MarketplaceRecommendationsProps {
  weather: any;
  wardrobeItems: any[];
}

export const MarketplaceRecommendations = ({ weather, wardrobeItems }: MarketplaceRecommendationsProps) => {
  const recommendations = [
    {
      id: 1,
      name: "Водонепроницаемая куртка",
      price: "2,990 ₽",
      marketplace: "Wildberries",
      rating: 4.5,
      image: "🧥",
      reason: "Идеально для дождливой погоды"
    },
    {
      id: 2,
      name: "Утепленные ботинки",
      price: "3,500 ₽",
      marketplace: "Ozon",
      rating: 4.7,
      image: "👢",
      reason: "Защита от влаги и холода"
    },
    {
      id: 3,
      name: "Зонт-автомат",
      price: "1,200 ₽",
      marketplace: "Wildberries",
      rating: 4.3,
      image: "☂️",
      reason: "Необходим в дождливую погоду"
    }
  ];

  const handleBuyClick = (item: any) => {
    // Здесь будет реальная интеграция с маркетплейсами
    console.log(`Переход к покупке: ${item.name} на ${item.marketplace}`);
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Рекомендации магазинов</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <Card key={item.id} className="p-4 bg-white/10 border-white/20 hover:bg-white/15 transition-all hover-scale">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{item.image}</div>
              <h3 className="font-semibold text-white mb-1">{item.name}</h3>
              <p className="text-2xl font-bold text-white mb-2">{item.price}</p>
              <Badge variant="secondary" className="bg-white/20 text-white/80 mb-2">
                {item.marketplace}
              </Badge>
              <div className="flex items-center justify-center space-x-1 text-yellow-300">
                <span>⭐</span>
                <span className="text-white/80">{item.rating}</span>
              </div>
            </div>
            
            <p className="text-white/70 text-sm text-center mb-4">
              💡 {item.reason}
            </p>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              onClick={() => handleBuyClick(item)}
            >
              Купить на {item.marketplace}
            </Button>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-white/20 rounded-lg border border-white/30">
        <p className="text-white/80 text-sm text-center">
          💡 Рекомендации основаны на текущей погоде и анализе вашего гардероба
        </p>
      </div>
    </Card>
  );
};
