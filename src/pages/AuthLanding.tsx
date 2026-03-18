import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Shield, User, ArrowRight, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const AuthLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      navigate(data ? '/admin' : '/dashboard', { replace: true });
    };
    checkAuth();
  }, [navigate]);

  return (
    <AnimatedBackground variant="auth">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-3xl">

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6 shadow-2xl">
              <Sprout className="w-12 h-12 text-secondary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Rural Development Assistant
            </h1>
            <p className="text-white/85 text-lg">Empowering Rural Communities with AI</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Leaf className="w-4 h-4 text-secondary" />
              <span className="text-secondary text-sm font-medium">Choose how you want to continue</span>
              <Leaf className="w-4 h-4 text-secondary" />
            </div>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in" style={{ animationDelay: '200ms' }}>

            {/* User Card */}
            <div
              className="group glass-card rounded-3xl p-8 cursor-pointer hover-lift border-2 border-transparent hover:border-secondary/40 transition-all duration-300"
              onClick={() => navigate('/user/login')}
            >
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, hsl(145 35% 28%), hsl(120 40% 35%))' }}>
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Farmer / Citizen
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">User Portal</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Access crop recommendations, telemedicine, government schemes, jobs & weather services
                  </p>
                </div>
                <div className="w-full space-y-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/user/login'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, hsl(145 35% 28%), hsl(120 40% 35%))' }}
                  >
                    User Login <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/user/register'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold border-2 transition-all duration-200 hover:bg-green-50"
                    style={{ borderColor: 'hsl(145 35% 28%)', color: 'hsl(145 35% 28%)' }}
                  >
                    Create User Account
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Card */}
            <div
              className="group glass-card rounded-3xl p-8 cursor-pointer hover-lift border-2 border-transparent hover:border-blue-400/40 transition-all duration-300"
              onClick={() => navigate('/admin/login')}
            >
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, hsl(220 60% 35%), hsl(230 55% 45%))' }}>
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Administrator
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Admin Portal</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Manage users, content, crop data, schemes, jobs & platform configuration
                  </p>
                </div>
                <div className="w-full space-y-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/admin/login'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, hsl(220 60% 35%), hsl(230 55% 45%))' }}
                  >
                    Admin Login <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/admin/register'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold border-2 transition-all duration-200 hover:bg-blue-50"
                    style={{ borderColor: 'hsl(220 60% 35%)', color: 'hsl(220 60% 35%)' }}
                  >
                    Register as Admin
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <p className="text-center text-white/60 text-sm mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            Secure, role-based access for all platform users
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default AuthLanding;
