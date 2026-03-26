import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, Mail, Lock, User, Eye, EyeOff, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  initiateRegistration, 
  verifyRegistrationOTP, 
  resendOTP,
  loginUser, 
} from '@/lib/authService';
import { supabase } from '@/integrations/supabase/client';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type AuthStep = 'form' | 'otp';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<AuthStep>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otpValue, setOtpValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const redirectByRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    navigate(data ? '/admin' : '/dashboard');
  };

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) redirectByRole(session.user.id);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) redirectByRole(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required';
    else if (!isLogin && formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const result = await loginUser(formData.email, formData.password);
        if (result.success && result.session) {
          toast({ title: "Welcome back! 🎉", description: result.welcomeMessage || `Logged in successfully` });
          await redirectByRole(result.session.user.id);
        } else {
          setErrors({ general: result.error || 'Login failed' });
          toast({ title: "Login Failed", description: result.error, variant: "destructive" });
        }
      } else {
        const result = await initiateRegistration(formData.name, formData.email, formData.password);
        if (result.success) {
          setStep('otp');
          setResendTimer(60);
          toast({ title: "Verification Email Sent! 📧", description: result.message });
        } else {
          setErrors({ general: result.error || 'Registration failed' });
          toast({ title: "Registration Failed", description: result.error, variant: "destructive" });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' });
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const result = await verifyRegistrationOTP(formData.email, otpValue);
      if (result.success) {
        toast({ title: "Account Verified! 🎉", description: result.welcomeMessage || "Your account has been verified." });
        navigate('/dashboard');
      } else {
        setErrors({ otp: result.error || 'Verification failed' });
        toast({ title: "Verification Failed", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Verification failed. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const result = await resendOTP(formData.email);
      if (result.success) {
        setResendTimer(60);
        toast({ title: "Email Resent! 📧", description: `New verification email sent to ${formData.email}` });
      } else {
        toast({ title: "Failed to Resend", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (login: boolean) => {
    setIsLogin(login);
    setStep('form');
    setErrors({});
    setOtpValue('');
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  const handleBackToForm = () => {
    setStep('form');
    setOtpValue('');
    setErrors({});
  };

  return (
    <AnimatedBackground variant="auth">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <Sprout className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Rural Development</h1>
            <p className="text-white/80">Empowering Rural Communities with AI</p>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-3xl p-8 animate-scale-in" style={{ animationDelay: '200ms' }}>
            {step === 'form' ? (
              <>
                {/* Tab Switcher */}
                <div className="flex bg-muted rounded-xl p-1 mb-6">
                  <button onClick={() => handleTabSwitch(true)} className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${isLogin ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>Login</button>
                  <button onClick={() => handleTabSwitch(false)} className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${!isLogin ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>Register</button>
                </div>

                {errors.general && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-4 text-sm">{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="name" type="text" placeholder="Enter your full name" className={`input-rural pl-12 ${errors.name ? 'border-destructive' : ''}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                    </div>
                  )}

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
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                  </div>

                  {!isLogin && (
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm your password" className={`input-rural pl-12 ${errors.confirmPassword ? 'border-destructive' : ''}`} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                      </div>
                      {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Email verification will be sent to confirm your account</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Please wait...</div>
                    ) : (
                      isLogin ? 'Sign In' : 'Register & Send Verification'
                    )}
                  </Button>
                </form>

                <p className="text-center mt-6 text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => handleTabSwitch(!isLogin)} className="text-primary font-semibold hover:underline">
                    {isLogin ? 'Register' : 'Login'}
                  </button>
                </p>
              </>
            ) : (
              <div className="space-y-6">
                <button onClick={handleBackToForm} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" />Back to form
                </button>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Verify Your Email</h2>
                  <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code sent to<br />
                    <span className="font-medium text-foreground">{formData.email}</span>
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <InputOTP maxLength={6} value={otpValue} onChange={(value) => setOtpValue(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {errors.otp && <p className="text-destructive text-sm">{errors.otp}</p>}
                </div>

                <Button onClick={handleVerifyOTP} className="w-full py-6 text-lg font-semibold rounded-xl" disabled={loading || otpValue.length !== 6}>
                  {loading ? (
                    <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Verifying...</div>
                  ) : 'Verify & Create Account'}
                </Button>

                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Didn't receive the code?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-primary">Resend in {resendTimer}s</span>
                    ) : (
                      <button onClick={handleResendOTP} disabled={loading} className="text-primary font-semibold hover:underline">Resend Email</button>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Auth;
