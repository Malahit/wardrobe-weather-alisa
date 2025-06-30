
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWardrobe } from "@/hooks/useWardrobe";
import { TrendingUp, TrendingDown, Clock, Star } from "lucide-react";

export const WardrobeStatistics = () => {
  const { items } = useWardrobe();

  const getStatistics = () => {
    if (items.length === 0) return null;

    const totalItems = items.length;
    const totalTimesWorn = items.reduce((sum, item) => sum + item.times_worn, 0);
    const averageTimesWorn = Math.round(totalTimesWorn / totalItems);

    // Самые популярные вещи
    const mostWorn = items
      .filter(item => item.times_worn > 0)
      .sort((a, b) => b.times_worn - a.times_worn)
      .slice(0, 3);

    // Редко используемые вещи
    const leastWorn = items
      .filter(item => item.times_worn === 0)
      .slice(0, 3);

    // Недавно добавленные
    const recentlyAdded = items
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);

    // Статистика по категориям
    const categoryStats = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { count: 0, totalWorn: 0 };
      }
      acc[item.category].count++;
      acc[item.category].totalWorn += item.times_worn;
      return acc;
    }, {} as { [key: string]: { count: number; totalWorn: number } });

    const getCategoryLabel = (category: string) => {
      const labels: { [key: string]: string } = {
        'top': 'Верх',
        'bottom': 'Низ',
        'shoes': 'Обувь',
        'outerwear': 'Верхняя одежда',
        'accessories': 'Аксессуары'
      };
      return labels[category] || category;
    };

    return {
      totalItems,
      totalTimesWorn,
      averageTimesWorn,
      mostWorn,
      leastWorn,
      recentlyAdded,
      categoryStats,
      getCategoryLabel
    };
  };

  const stats = getStatistics();

  if (!stats) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Статистика гардероба</h2>
        <div className="text-center py-8 text-white/60">
          <p>Добавьте вещи в гардероб, чтобы увидеть статистику</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Статистика гардероба</h2>
      
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalItems}</div>
          <div className="text-white/70 text-sm">Всего вещей</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalTimesWorn}</div>
          <div className="text-white/70 text-sm">Всего надеваний</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.averageTimesWorn}</div>
          <div className="text-white/70 text-sm">В среднем на вещь</div>
        </div>
      </div>

      {/* Статистика по категориям */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">По категориям</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(stats.categoryStats).map(([category, data]) => (
            <div key={category} className="bg-white/10 rounded-lg p-3">
              <div className="font-medium text-white">{stats.getCategoryLabel(category)}</div>
              <div className="text-white/70 text-sm">{data.count} вещей</div>
              <div className="text-white/70 text-sm">{data.totalWorn} надеваний</div>
            </div>
          ))}
        </div>
      </div>

      {/* Популярные вещи */}
      {stats.mostWorn.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Самые популярные
          </h3>
          <div className="space-y-2">
            {stats.mostWorn.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div>
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-white/70 text-sm">{item.color}</div>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-200">
                  {item.times_worn} раз
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Редко используемые */}
      {stats.leastWorn.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-yellow-400" />
            Редко используемые
          </h3>
          <div className="space-y-2">
            {stats.leastWorn.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div>
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-white/70 text-sm">{item.color}</div>
                </div>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200">
                  Не надевали
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Недавно добавленные */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-400" />
          Недавно добавленные
        </h3>
        <div className="space-y-2">
          {stats.recentlyAdded.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <div>
                <div className="font-medium text-white">{item.name}</div>
                <div className="text-white/70 text-sm">{item.color}</div>
              </div>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                {new Date(item.created_at).toLocaleDateString('ru-RU')}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
