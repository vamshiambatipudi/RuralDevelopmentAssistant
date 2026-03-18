import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Plus, Edit2, Trash2, Search, Eye, EyeOff, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface HealthTopic {
  id: string;
  symptom_key: string;
  language: string;
  home_remedies: string[];
  medicines: string[];
  warnings: string[];
  is_active: boolean;
  created_at: string;
}

const languageLabels: Record<string, string> = {
  'en-IN': 'English', 'hi-IN': 'हिन्दी (Hindi)', 'te-IN': 'తెలుగు (Telugu)',
  'ta-IN': 'தமிழ் (Tamil)', 'bn-IN': 'বাংলা (Bengali)', 'mr-IN': 'मराठी (Marathi)',
  'gu-IN': 'ગુજરાતી (Gujarati)', 'kn-IN': 'ಕನ್ನಡ (Kannada)', 'ml-IN': 'മലയാളം (Malayalam)', 'pa-IN': 'ਪੰਜਾਬੀ (Punjabi)',
};

const symptomLabels: Record<string, string> = {
  fever: '🌡️ Fever', headache: '🤕 Headache', cold: '🤧 Cold & Cough',
  stomach: '🤢 Stomach Pain', infection: '🩹 Wound/Infection', dehydration: '💧 Dehydration',
};

const AdminTelemedicineManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: authLoading } = useAdminAuth();
  const [topics, setTopics] = useState<HealthTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<HealthTopic | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    symptom_key: '', language: 'en-IN',
    home_remedies: '', medicines: '', warnings: '',
  });

  useEffect(() => { if (!authLoading) fetchTopics(); }, [authLoading]);

  const fetchTopics = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('health_topics').select('*').order('symptom_key').order('language');
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else setTopics(data || []);
    setLoading(false);
  };

  const openAdd = () => {
    setEditingTopic(null);
    setForm({ symptom_key: '', language: 'en-IN', home_remedies: '', medicines: '', warnings: '' });
    setDialogOpen(true);
  };

  const openEdit = (topic: HealthTopic) => {
    setEditingTopic(topic);
    setForm({
      symptom_key: topic.symptom_key, language: topic.language,
      home_remedies: topic.home_remedies.join('\n'), medicines: topic.medicines.join('\n'), warnings: topic.warnings.join('\n'),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.symptom_key || !form.language) { toast({ title: 'Symptom and language required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = {
      symptom_key: form.symptom_key, language: form.language,
      home_remedies: form.home_remedies.split('\n').filter(Boolean),
      medicines: form.medicines.split('\n').filter(Boolean),
      warnings: form.warnings.split('\n').filter(Boolean),
    };
    const { error } = editingTopic
      ? await supabase.from('health_topics').update(payload).eq('id', editingTopic.id)
      : await supabase.from('health_topics').insert(payload);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingTopic ? 'Topic updated' : 'Topic added' }); setDialogOpen(false); fetchTopics(); }
    setSaving(false);
  };

  const toggleActive = async (topic: HealthTopic) => {
    await supabase.from('health_topics').update({ is_active: !topic.is_active }).eq('id', topic.id);
    toast({ title: `Topic ${topic.is_active ? 'hidden' : 'visible'}` });
    fetchTopics();
  };

  const handleDelete = async (topic: HealthTopic) => {
    if (!confirm(`Delete ${topic.symptom_key} (${topic.language})?`)) return;
    await supabase.from('health_topics').delete().eq('id', topic.id);
    toast({ title: 'Topic deleted' });
    fetchTopics();
  };

  // Group topics by symptom
  const grouped = topics.reduce<Record<string, HealthTopic[]>>((acc, t) => {
    if (!acc[t.symptom_key]) acc[t.symptom_key] = [];
    acc[t.symptom_key].push(t);
    return acc;
  }, {});

  const filteredKeys = Object.keys(grouped).filter(key => {
    if (search && !key.includes(search.toLowerCase())) return false;
    if (langFilter !== 'all' && !grouped[key].some(t => t.language === langFilter)) return false;
    return true;
  });

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-sidebar-foreground hover:bg-sidebar-accent"><ArrowLeft className="w-5 h-5" /></Button>
          <Stethoscope className="w-6 h-6" />
          <h1 className="text-lg font-bold">Telemedicine Content Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search symptoms..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={langFilter} onValueChange={setLangFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Languages" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {Object.entries(languageLabels).map(([code, label]) => (
                <SelectItem key={code} value={code}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" />Add Topic</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : filteredKeys.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No health topics found</div>
        ) : (
          <div className="space-y-6">
            {filteredKeys.map(symptomKey => (
              <div key={symptomKey} className="glass-card rounded-xl p-5">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {symptomLabels[symptomKey] || symptomKey}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grouped[symptomKey]
                    .filter(t => langFilter === 'all' || t.language === langFilter)
                    .map(topic => (
                    <div key={topic.id} className={`border rounded-lg p-4 ${!topic.is_active ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary">{languageLabels[topic.language] || topic.language}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleActive(topic)}>
                            {topic.is_active ? <Eye className="w-3 h-3 text-crop" /> : <EyeOff className="w-3 h-3" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(topic)}><Edit2 className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(topic)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>🏠 {topic.home_remedies.length} remedies</p>
                        <p>💊 {topic.medicines.length} medicines</p>
                        <p>⚠️ {topic.warnings.length} warnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingTopic ? 'Edit Health Topic' : 'Add Health Topic'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Symptom *</Label>
                <Select value={form.symptom_key} onValueChange={v => setForm({ ...form, symptom_key: v })} disabled={!!editingTopic}>
                  <SelectTrigger><SelectValue placeholder="Select symptom" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(symptomLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language *</Label>
                <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })} disabled={!!editingTopic}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageLabels).map(([code, label]) => (
                      <SelectItem key={code} value={code}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Home Remedies (one per line)</Label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" value={form.home_remedies} onChange={e => setForm({ ...form, home_remedies: e.target.value })} placeholder="Enter each remedy on a new line..." />
            </div>
            <div>
              <Label>Medicines (one per line)</Label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]" value={form.medicines} onChange={e => setForm({ ...form, medicines: e.target.value })} placeholder="Enter each medicine on a new line..." />
            </div>
            <div>
              <Label>Warning Signs (one per line)</Label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={form.warnings} onChange={e => setForm({ ...form, warnings: e.target.value })} placeholder="Enter each warning sign on a new line..." />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}><X className="w-4 h-4 mr-1" />Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}{editingTopic ? 'Update' : 'Add'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTelemedicineManagement;
