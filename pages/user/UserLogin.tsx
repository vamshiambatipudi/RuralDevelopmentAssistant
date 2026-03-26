import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/lib/authService';
import { supabase } from '@/integrations/supabase/client';

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'admin').maybeSingle();
      if (!data) navigate('/dashboard', { replace: true });
    };
    checkAuth();
  }, [navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const result = await loginUser(formData.email, formData.password);
      if (result.success && result.session) {
        // Ensure they are a regular user (not admin)
        const { data: adminRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', result.session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (adminRole) {
          await supabase.auth.signOut();
          setErrors({ general: 'This account has admin privileges. Please use the Admin Login.' });
          return;
        }
        toast({ title: 'Welcome back! 🌾', description: result.welcomeMessage });
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error || 'Login failed. Please try again.' });
      }
    } catch {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground variant="auth">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 shadow-xl">
              <Sprout className="w-10 h-10 text-secondary" />
            </div>
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">
              <User className="w-4 h-4" />
              Farmer / Citizen
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">User Login</h1>
            <p className="text-white/80">Access your rural services dashboard</p>
          </div>

          {/* Card */}
          <div className="glass-card rounded-3xl p-8 animate-scale-in border-t-4" style={{ borderTopColor: 'hsl(145 35% 28%)', animationDelay: '150ms' }}>

            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 mb-5 text-sm flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="Enter your email" className={`input-rural pl-12 ${errors.email ? 'border-destructive' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className={`input-rural pl-12 pr-12 ${errors.password ? 'border-destructive' : ''}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-lg font-semibold rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, hsl(145 35% 28%), hsl(120 40% 35%))' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Signing in…</span>
                ) : (
                  <span className="flex items-center gap-2"><User className="w-5 h-5" />Sign In as User</span>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/user/register" className="font-semibold hover:underline" style={{ color: 'hsl(145 35% 28%)' }}>
                  Create User Account
                </Link>
              </p>
              <div className="border-t border-border pt-3">
                <Link to="/auth" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to role selection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default UserLogin;
