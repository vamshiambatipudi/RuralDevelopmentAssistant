import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SchemeRow {
  id: string;
  name: string;
  description: string;
  category: string;
  eligibility: any;
  benefits: string;
  application_process: string[];
  documents_required: string[];
  link: string;
  helpline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const emptyScheme = {
  name: '',
  description: '',
  category: 'farmers',
  eligibility: { criteria: [] as string[] },
  benefits: '',
  application_process: [] as string[],
  documents_required: [] as string[],
  link: '',
  helpline: '',
  is_active: true,
};

const categories = ['farmers', 'rural', 'women', 'students', 'elderly'];

const AdminSchemeManagement = () => {
  const navigate = useNavigate();
  const { loading } = useAdminAuth();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<SchemeRow[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingScheme, setEditingScheme] = useState<typeof emptyScheme & { id?: string }>(emptyScheme);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Temp fields for array inputs
  const [criteriaInput, setCriteriaInput] = useState('');
  const [processInput, setProcessInput] = useState('');
  const [docsInput, setDocsInput] = useState('');

  const fetchSchemes = async () => {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSchemes(data as SchemeRow[]);
  };

  useEffect(() => {
    if (!loading) fetchSchemes();
  }, [loading]);

  const filtered = schemes.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  const openCreate = () => {
    setEditingScheme({ ...emptyScheme });
    setCriteriaInput('');
    setProcessInput('');
    setDocsInput('');
    setIsEditing(false);
    setShowDialog(true);
  };

  const openEdit = (scheme: SchemeRow) => {
    setEditingScheme({
      id: scheme.id,
      name: scheme.name,
      description: scheme.description,
      category: scheme.category,
      eligibility: scheme.eligibility || { criteria: [] },
      benefits: scheme.benefits,
      application_process: scheme.application_process || [],
      documents_required: scheme.documents_required || [],
      link: scheme.link,
      helpline: scheme.helpline || '',
      is_active: scheme.is_active,
    });
    setCriteriaInput((scheme.eligibility?.criteria || []).join('\n'));
    setProcessInput((scheme.application_process || []).join('\n'));
    setDocsInput((scheme.documents_required || []).join('\n'));
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleSave = async () => {
    const payload = {
      name: editingScheme.name,
      description: editingScheme.description,
      category: editingScheme.category,
      eligibility: { ...editingScheme.eligibility, criteria: criteriaInput.split('\n').filter(Boolean) },
      benefits: editingScheme.benefits,
      application_process: processInput.split('\n').filter(Boolean),
      documents_required: docsInput.split('\n').filter(Boolean),
      link: editingScheme.link,
      helpline: editingScheme.helpline || null,
      is_active: editingScheme.is_active,
    };

    let error;
    if (isEditing && editingScheme.id) {
      ({ error } = await supabase.from('schemes').update(payload).eq('id', editingScheme.id));
    } else {
      ({ error } = await supabase.from('schemes').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: isEditing ? 'Scheme Updated' : 'Scheme Created', description: `${payload.name} has been ${isEditing ? 'updated' : 'created'}.` });
      setShowDialog(false);
      fetchSchemes();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('schemes').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Scheme Deleted' });
      fetchSchemes();
    }
    setDeleting(null);
  };

  const handleToggleActive = async (scheme: SchemeRow) => {
    await supabase.from('schemes').update({ is_active: !scheme.is_active }).eq('id', scheme.id);
    fetchSchemes();
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-sidebar-foreground hover:bg-sidebar-accent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Building2 className="w-6 h-6" />
            <h1 className="text-xl font-bold">Government Schemes Management</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemes..." className="pl-10" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Add Scheme</Button>
        </div>

        <div className="text-sm text-muted-foreground mb-4">{filtered.length} scheme(s)</div>

        <div className="space-y-3">
          {filtered.map(scheme => (
            <div key={scheme.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{scheme.name}</h3>
                  <Badge variant={scheme.is_active ? 'default' : 'secondary'}>{scheme.is_active ? 'Active' : 'Inactive'}</Badge>
                  <Badge variant="outline">{scheme.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{scheme.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => handleToggleActive(scheme)}>
                  {scheme.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(scheme)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleting(scheme.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Scheme' : 'Add New Scheme'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheme Name *</Label>
                  <Input value={editingScheme.name} onChange={e => setEditingScheme({ ...editingScheme, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={editingScheme.category} onValueChange={v => setEditingScheme({ ...editingScheme, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea value={editingScheme.description} onChange={e => setEditingScheme({ ...editingScheme, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Benefits *</Label>
                <Textarea value={editingScheme.benefits} onChange={e => setEditingScheme({ ...editingScheme, benefits: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Eligibility Criteria (one per line)</Label>
                <Textarea value={criteriaInput} onChange={e => setCriteriaInput(e.target.value)} rows={4} placeholder="Enter each criterion on a new line" />
              </div>
              <div className="space-y-2">
                <Label>Application Process (one step per line)</Label>
                <Textarea value={processInput} onChange={e => setProcessInput(e.target.value)} rows={4} placeholder="Enter each step on a new line" />
              </div>
              <div className="space-y-2">
                <Label>Documents Required (one per line)</Label>
                <Textarea value={docsInput} onChange={e => setDocsInput(e.target.value)} rows={4} placeholder="Enter each document on a new line" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Application Link</Label>
                  <Input value={editingScheme.link} onChange={e => setEditingScheme({ ...editingScheme, link: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Helpline</Label>
                  <Input value={editingScheme.helpline} onChange={e => setEditingScheme({ ...editingScheme, helpline: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!editingScheme.name || !editingScheme.description}>{isEditing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Delete Scheme?</DialogTitle></DialogHeader>
            <p className="text-muted-foreground">This action cannot be undone. The scheme will be permanently removed.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleting && handleDelete(deleting)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminSchemeManagement;
