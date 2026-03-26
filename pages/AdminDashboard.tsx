import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Building2, Sprout, Stethoscope, Cloud, LogOut, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalSchemes: number;
  totalJobs: number;
  totalTrainings: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { loading, userName } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0, totalSchemes: 0, totalJobs: 0, totalTrainings: 0 });

  useEffect(() => {
    if (loading) return;
    const fetchStats = async () => {
      const [{ count: total }, { count: active }, { count: schemes }, { count: jobs }, { count: trainings }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('schemes').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('trainings').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        totalUsers: total || 0,
        activeUsers: active || 0,
        inactiveUsers: (total || 0) - (active || 0),
        totalSchemes: schemes || 0,
        totalJobs: jobs || 0,
        totalTrainings: trainings || 0,
      });
    };
    fetchStats();
  }, [loading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) return null;

  const modules = [
    { title: 'User Management', description: 'View, search, activate/deactivate, and manage all users', icon: Users, path: '/admin/users', color: 'bg-primary' },
    { title: 'Government Schemes', description: 'Add, edit, delete government schemes', icon: Building2, path: '/admin/schemes', color: 'bg-scheme' },
    { title: 'Job Listings', description: 'Manage job postings and training programs', icon: Briefcase, path: '/admin/jobs', color: 'bg-job' },
    { title: 'Crop Model', description: 'Manage crop profiles, ML parameters, and agricultural data', icon: Sprout, path: '/admin/crops', color: 'bg-crop' },
    { title: 'Telemedicine', description: 'Manage health topics and multilingual medical content', icon: Stethoscope, path: '/admin/telemedicine', color: 'bg-health' },
    { title: 'Weather Config', description: 'Configure alert thresholds and weather module settings', icon: Cloud, path: '/admin/weather', color: 'bg-weather' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sidebar-primary flex items-center justify-center">
                <Shield className="w-7 h-7 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Portal</h1>
                <p className="text-sm opacity-80">Rural Development Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80 hidden sm:inline">{userName}</span>
              <Button variant="outline" size="sm" className="gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: 'Total Users', value: stats.totalUsers, color: 'text-primary' },
            { label: 'Active Users', value: stats.activeUsers, color: 'text-crop' },
            { label: 'Inactive Users', value: stats.inactiveUsers, color: 'text-destructive' },
            { label: 'Schemes', value: stats.totalSchemes, color: 'text-scheme' },
            { label: 'Jobs', value: stats.totalJobs, color: 'text-job' },
            { label: 'Trainings', value: stats.totalTrainings, color: 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-6 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <button
              key={mod.title}
              onClick={() => navigate(mod.path)}
              className="glass-card rounded-xl p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${mod.color} flex items-center justify-center mb-4`}>
                  <mod.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{mod.title}</h3>
              <p className="text-sm text-muted-foreground">{mod.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
