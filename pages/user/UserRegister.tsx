import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Eye, EyeOff, Phone, Loader2, ArrowLeft, Sprout, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/dashboard', { replace: true });
    };
    checkAuth();
  }, [navigate]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Full name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email address';
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          data: { name: formData.name.trim(), phone: formData.phone || null },
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
        // Update phone in profile if provided
        if (formData.phone) {
          await supabase.from('profiles').update({ phone: formData.phone }).eq('id', data.user.id);
        }
        toast({ title: 'Account Created! 🎉', description: `Welcome, ${formData.name.trim()}! You can now log in.` });
        navigate('/dashboard');
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
              <Sprout className="w-10 h-10 text-secondary" />
            </div>
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">
              <User className="w-4 h-4" />
              Farmer / Citizen
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">User Registration</h1>
            <p className="text-white/80">Create your rural services account</p>
          </div>

          <div className="glass-card rounded-3xl p-8 animate-scale-in border-t-4" style={{ borderTopColor: 'hsl(145 35% 28%)', animationDelay: '150ms' }}>

            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 mb-5 text-sm flex gap-2">
                <span className="mt-0.5">⚠️</span><span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="Your full name" className={`input-rural pl-12 ${errors.name ? 'border-destructive' : ''}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground font-medium">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="your@email.com" className={`input-rural pl-12 ${errors.email ? 'border-destructive' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-foreground font-medium">Mobile Number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="10-digit mobile number" className={`input-rural pl-12 ${errors.phone ? 'border-destructive' : ''}`} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground font-medium">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" className={`input-rural pl-12 pr-12 ${errors.password ? 'border-destructive' : ''}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
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

              <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-muted-foreground" style={{ background: 'hsl(145 35% 28% / 0.08)', border: '1px solid hsl(145 35% 28% / 0.2)' }}>
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'hsl(145 35% 28%)' }} />
                <span>Account is created immediately — no email verification needed</span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-base font-semibold rounded-xl text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, hsl(145 35% 28%), hsl(120 40% 35%))' }}
              >
                {loading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Creating account…</span>
                  : <span className="flex items-center gap-2"><User className="w-5 h-5" />Create Account</span>}
              </Button>
            </form>

            <div className="mt-5 space-y-3 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/user/login" className="font-semibold hover:underline" style={{ color: 'hsl(145 35% 28%)' }}>Login here</Link>
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

export default UserRegister;
