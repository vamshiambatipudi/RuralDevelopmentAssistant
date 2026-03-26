import { useEffect, useState } from 'react';
import { Sprout, Stethoscope, Building2, Briefcase, Cloud, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '@/components/ModuleCard';
import { Button } from '@/components/ui/button';
import { VoiceNavigationAssistant } from '@/components/VoiceNavigationAssistant';
import { supabase } from '@/integrations/supabase/client';

const modules = [
  {
    title: 'Crop Recommendation',
    description: 'Get AI-powered crop suggestions based on your soil and climate conditions',
    icon: Sprout,
    path: '/crop-recommendation',
    gradient: 'bg-gradient-to-br from-crop to-green-600',
    delay: 100,
  },
  {
    title: 'Telemedicine Support',
    description: 'Access healthcare advice through chat or voice-based AI assistant',
    icon: Stethoscope,
    path: '/telemedicine',
    gradient: 'bg-gradient-to-br from-health to-blue-600',
    delay: 200,
  },
  {
    title: 'Government Schemes',
    description: 'Discover and apply for government schemes designed for rural citizens',
    icon: Building2,
    path: '/schemes',
    gradient: 'bg-gradient-to-br from-scheme to-purple-700',
    delay: 300,
  },
  {
    title: 'Jobs & Skills',
    description: 'Find employment opportunities and skill development programs',
    icon: Briefcase,
    path: '/jobs',
    gradient: 'bg-gradient-to-br from-job to-orange-600',
    delay: 400,
  },
  {
    title: 'Weather Forecast',
    description: 'Real-time weather updates and farming tips based on conditions',
    icon: Cloud,
    path: '/weather',
    gradient: 'bg-gradient-to-br from-weather to-blue-500',
    delay: 500,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/user/login');
        return;
      }
      setUserName(session.user.user_metadata?.name || session.user.email || 'User');
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/user/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.auth.signOut();
    navigate('/user/login');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background bg-pattern-leaves">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Sprout className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Rural Development</h1>
                <p className="text-sm text-muted-foreground">Smart AI Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" className="gap-2" onClick={() => navigate('/profile')}>
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{userName}</span>
              </Button>
              <Button variant="outline" className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Welcome, {userName}! 🌾</h2>
          <p className="text-lg text-muted-foreground">Choose a module below to get started with AI-powered assistance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Schemes', value: '50+', color: 'bg-scheme' },
            { label: 'Crops Database', value: '200+', color: 'bg-crop' },
            { label: 'Health Tips', value: '1000+', color: 'bg-health' },
            { label: 'Job Listings', value: '500+', color: 'bg-job' },
          ].map((stat, index) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (<ModuleCard key={module.path} {...module} />))}
        </div>

        <div className="mt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <VoiceNavigationAssistant variant="full" />
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">© 2024 Rural Development Assistant | Empowering Farmers with Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
