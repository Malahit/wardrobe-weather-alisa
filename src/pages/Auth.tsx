
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Успешный вход!",
        description: "Добро пожаловать в WeatherWardrobe"
      });
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Регистрация успешна!",
        description: "Проверьте email для подтверждения аккаунта"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">WeatherWardrobe</h1>
          <p className="text-white/80">Ваш умный помощник гардероба</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/20">
            <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
              Вход
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email" className="text-white">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Введите ваш email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signin-password" className="text-white">Пароль</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className="text-white">Полное имя</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email" className="text-white">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Введите ваш email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password" className="text-white">Пароль</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Создайте пароль"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
