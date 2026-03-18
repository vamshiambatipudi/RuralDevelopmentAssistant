import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, Eye, EyeOff, User, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
      if (data) navigate('/admin', { replace: true });
    };
    checkAuth();
  }, [navigate]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Admin name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email address';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Admin password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      // Sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          data: { name: formData.name.trim() },
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setErrors({ general: 'An account with this email already exists. Please login instead.' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      if (data.user) {
        // Upgrade role to admin using the edge function (service role)
        const { error: fnError } = await supabase.functions.invoke('admin-manage-user', {
          body: { action: 'set_admin_role', userId: data.user.id },
        });

        if (fnError) {
          // Fallback: try direct update (works if current user is admin)
          await supabase.from('user_roles').update({ role: 'admin' }).eq('user_id', data.user.id);
        }

        toast({ title: 'Admin Account Created! 🛡️', description: `Welcome, ${formData.name.trim()}! Your admin account is ready.` });
        navigate('/admin');
      }
    } catch {
      toast({ title: 'Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground variant="auth">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">

          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">
              <Shield className="w-4 h-4" />
              Administrator
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">Admin Registration</h1>
            <p className="text-white/80">Create your admin control panel account</p>
          </div>

          <div className="glass-card rounded-3xl p-8 animate-scale-in border-t-4" style={{ borderTopColor: 'hsl(220 60% 35%)', animationDelay: '150ms' }}>

            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 mb-5 text-sm flex gap-2">
                <span className="mt-0.5">🚫</span><span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admin Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-foreground font-medium">Admin Name *</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="Your full name" className={`input-rural pl-12 ${errors.name ? 'border-destructive' : ''}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground font-medium">Admin Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="admin@example.com" className={`input-rural pl-12 ${errors.email ? 'border-destructive' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground font-medium">Password * <span className="text-muted-foreground font-normal text-xs">(min 8 characters)</span></Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" className={`input-rural pl-12 pr-12 ${errors.password ? 'border-destructive' : ''}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" className={`input-rural pl-12 ${errors.confirmPassword ? 'border-destructive' : ''}`} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                </div>
                {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-muted-foreground" style={{ background: 'hsl(220 60% 35% / 0.08)', border: '1px solid hsl(220 60% 35% / 0.2)' }}>
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'hsl(220 60% 35%)' }} />
                <span>Admin account is created immediately with full management access</span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-base font-semibold rounded-xl text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, hsl(220 60% 35%), hsl(230 55% 45%))' }}
              >
                {loading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Creating admin account…</span>
                  : <span className="flex items-center gap-2"><Shield className="w-5 h-5" />Create Admin Account</span>}
              </Button>
            </form>

            <div className="mt-5 space-y-3 text-center text-sm">
              <p className="text-muted-foreground">
                Already an admin?{' '}
                <Link to="/admin/login" className="font-semibold hover:underline" style={{ color: 'hsl(220 60% 35%)' }}>Login here</Link>
              </p>
              <div className="border-t border-border pt-3">
                <Link to="/auth" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
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

export default AdminRegister;
