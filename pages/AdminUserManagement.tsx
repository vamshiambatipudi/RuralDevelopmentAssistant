import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Shield, UserX, UserCheck, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  age: number | null;
  village: string | null;
  mandal: string | null;
  district: string | null;
  state: string | null;
  pin_code: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (filterStatus === 'active') query = query.eq('is_active', true);
    if (filterStatus === 'inactive') query = query.eq('is_active', false);

    const { data, error } = await query;
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) fetchUsers();
  }, [authLoading, filterStatus]);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      (u.name?.toLowerCase().includes(q)) ||
      (u.email?.toLowerCase().includes(q)) ||
      (u.district?.toLowerCase().includes(q)) ||
      (u.state?.toLowerCase().includes(q));
    const matchesState = !filterState || (u.state?.toLowerCase().includes(filterState.toLowerCase()));
    return matchesSearch && matchesState;
  });

  const toggleActive = async (user: UserProfile) => {
    setActionLoading(user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: user.is_active ? 'User Deactivated' : 'User Activated', description: `${user.name || user.email} has been ${user.is_active ? 'deactivated' : 'activated'}.` });
      fetchUsers();
    }
    setActionLoading(null);
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);

    // Call edge function for admin user deletion (requires service role)
    const { data: { session } } = await supabase.auth.getSession();
    const response = await supabase.functions.invoke('admin-manage-user', {
      body: { action: 'delete', userId: deleteTarget.id },
    });

    if (response.error) {
      toast({ title: 'Error', description: response.error.message, variant: 'destructive' });
    } else {
      toast({ title: 'User Deleted', description: `${deleteTarget.name || deleteTarget.email} has been permanently deleted.` });
      fetchUsers();
    }
    setDeleteTarget(null);
    setActionLoading(null);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Shield className="w-6 h-6" />
          <h1 className="text-xl font-bold">User Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, district, state..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Input placeholder="Filter by state" className="sm:w-40" value={filterState} onChange={(e) => setFilterState(e.target.value)} />
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filteredUsers.length} user(s) found</p>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="glass-card rounded-xl overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${user.is_active ? 'bg-crop' : 'bg-destructive'}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{user.name || 'Unnamed'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.is_active ? 'bg-crop/20 text-crop' : 'bg-destructive/20 text-destructive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {expandedUser === user.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {expandedUser === user.id && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      {[
                        ['Age', user.age],
                        ['Phone', user.phone],
                        ['Village', user.village],
                        ['Mandal', user.mandal],
                        ['District', user.district],
                        ['State', user.state],
                        ['Pin Code', user.pin_code],
                        ['Joined', new Date(user.created_at).toLocaleDateString()],
                      ].map(([label, value]) => (
                        <div key={label as string}>
                          <p className="text-muted-foreground text-xs">{label as string}</p>
                          <p className="text-foreground font-medium">{(value as any) || '—'}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant={user.is_active ? 'destructive' : 'default'}
                        className="gap-1"
                        disabled={actionLoading === user.id}
                        onClick={() => toggleActive(user)}
                      >
                        {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteTarget(user)}>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No users found matching your filters.</div>
            )}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name || deleteTarget?.email}</strong> and all their data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUserManagement;
