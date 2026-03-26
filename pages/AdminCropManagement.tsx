import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sprout, Plus, Edit2, Trash2, Search, Eye, EyeOff, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface CropProfile {
  id: string;
  name: string;
  emoji: string;
  optimal_soil_types: string[];
  rainfall_range_min: number;
  rainfall_range_max: number;
  temp_range_min: number;
  temp_range_max: number;
  seasons: string[];
  irrigation_types: string[];
  yield_per_acre: number;
  price_per_quintal: number;
  cost_per_acre: number;
  market_demand: string;
  fertilizer_summary: string;
  fertilizer_details: string[];
  tips: string[];
  is_active: boolean;
  created_at: string;
}

const soilOptions = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Alluvial'];
const seasonOptions = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];
const irrigationOptions = ['Rainfed', 'Canal', 'Well/Tubewell', 'Drip', 'Sprinkler'];

const AdminCropManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: authLoading } = useAdminAuth();
  const [crops, setCrops] = useState<CropProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<CropProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', emoji: '🌾', optimal_soil_types: [] as string[], rainfall_range_min: 500, rainfall_range_max: 1500,
    temp_range_min: 15, temp_range_max: 35, seasons: [] as string[], irrigation_types: [] as string[],
    yield_per_acre: 0, price_per_quintal: 0, cost_per_acre: 0, market_demand: 'Medium',
    fertilizer_summary: '', fertilizer_details: '', tips: '',
  });

  useEffect(() => {
    if (!authLoading) fetchCrops();
  }, [authLoading]);

  const fetchCrops = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('crop_profiles').select('*').order('name');
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else setCrops(data || []);
    setLoading(false);
  };

  const openAdd = () => {
    setEditingCrop(null);
    setForm({ name: '', emoji: '🌾', optimal_soil_types: [], rainfall_range_min: 500, rainfall_range_max: 1500, temp_range_min: 15, temp_range_max: 35, seasons: [], irrigation_types: [], yield_per_acre: 0, price_per_quintal: 0, cost_per_acre: 0, market_demand: 'Medium', fertilizer_summary: '', fertilizer_details: '', tips: '' });
    setDialogOpen(true);
  };

  const openEdit = (crop: CropProfile) => {
    setEditingCrop(crop);
    setForm({
      name: crop.name, emoji: crop.emoji, optimal_soil_types: crop.optimal_soil_types, rainfall_range_min: crop.rainfall_range_min, rainfall_range_max: crop.rainfall_range_max, temp_range_min: crop.temp_range_min, temp_range_max: crop.temp_range_max, seasons: crop.seasons, irrigation_types: crop.irrigation_types, yield_per_acre: crop.yield_per_acre, price_per_quintal: crop.price_per_quintal, cost_per_acre: crop.cost_per_acre, market_demand: crop.market_demand, fertilizer_summary: crop.fertilizer_summary, fertilizer_details: crop.fertilizer_details.join('\n'), tips: crop.tips.join('\n'),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = {
      name: form.name, emoji: form.emoji, optimal_soil_types: form.optimal_soil_types,
      rainfall_range_min: form.rainfall_range_min, rainfall_range_max: form.rainfall_range_max,
      temp_range_min: form.temp_range_min, temp_range_max: form.temp_range_max,
      seasons: form.seasons, irrigation_types: form.irrigation_types,
      yield_per_acre: form.yield_per_acre, price_per_quintal: form.price_per_quintal,
      cost_per_acre: form.cost_per_acre, market_demand: form.market_demand,
      fertilizer_summary: form.fertilizer_summary,
      fertilizer_details: form.fertilizer_details.split('\n').filter(Boolean),
      tips: form.tips.split('\n').filter(Boolean),
    };

    const { error } = editingCrop
      ? await supabase.from('crop_profiles').update(payload).eq('id', editingCrop.id)
      : await supabase.from('crop_profiles').insert(payload);

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingCrop ? 'Crop updated' : 'Crop added' }); setDialogOpen(false); fetchCrops(); }
    setSaving(false);
  };

  const toggleActive = async (crop: CropProfile) => {
    await supabase.from('crop_profiles').update({ is_active: !crop.is_active }).eq('id', crop.id);
    toast({ title: `${crop.name} ${crop.is_active ? 'hidden' : 'visible'} to users` });
    fetchCrops();
  };

  const handleDelete = async (crop: CropProfile) => {
    if (!confirm(`Delete "${crop.name}"?`)) return;
    await supabase.from('crop_profiles').delete().eq('id', crop.id);
    toast({ title: 'Crop deleted' });
    fetchCrops();
  };

  const toggleMulti = (arr: string[], val: string) => arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const filtered = crops.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-sidebar-foreground hover:bg-sidebar-accent"><ArrowLeft className="w-5 h-5" /></Button>
          <Sprout className="w-6 h-6" />
          <h1 className="text-lg font-bold">Crop Model Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search crops..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" />Add Crop Profile</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(crop => (
              <div key={crop.id} className={`glass-card rounded-xl p-5 ${!crop.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{crop.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{crop.name}</h3>
                      <p className="text-xs text-muted-foreground">{crop.market_demand} demand • ₹{crop.price_per_quintal}/q</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(crop)}>
                      {crop.is_active ? <Eye className="w-4 h-4 text-crop" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(crop)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(crop)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/50 rounded p-2"><span className="text-muted-foreground">Soil:</span> <span className="font-medium">{crop.optimal_soil_types.join(', ')}</span></div>
                  <div className="bg-muted/50 rounded p-2"><span className="text-muted-foreground">Seasons:</span> <span className="font-medium">{crop.seasons.map(s => s.split(' ')[0]).join(', ')}</span></div>
                  <div className="bg-muted/50 rounded p-2"><span className="text-muted-foreground">Rain:</span> <span className="font-medium">{crop.rainfall_range_min}-{crop.rainfall_range_max}mm</span></div>
                  <div className="bg-muted/50 rounded p-2"><span className="text-muted-foreground">Temp:</span> <span className="font-medium">{crop.temp_range_min}-{crop.temp_range_max}°C</span></div>
                  <div className="bg-muted/50 rounded p-2"><span className="text-muted-foreground">Yield:</span> <span className="font-medium">{crop.yield_per_acre} q/acre</span></div>
                  <div className="bg-muted/50 rounded p-2"><span className="text-muted-foreground">Cost:</span> <span className="font-medium">₹{crop.cost_per_acre.toLocaleString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingCrop ? 'Edit Crop Profile' : 'Add Crop Profile'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Emoji</Label><Input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} /></div>
            </div>
            <div>
              <Label>Soil Types</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {soilOptions.map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, optimal_soil_types: toggleMulti(form.optimal_soil_types, s) })} className={`px-3 py-1 rounded-full text-xs border transition-colors ${form.optimal_soil_types.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Seasons</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {seasonOptions.map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, seasons: toggleMulti(form.seasons, s) })} className={`px-3 py-1 rounded-full text-xs border transition-colors ${form.seasons.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Irrigation Types</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {irrigationOptions.map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, irrigation_types: toggleMulti(form.irrigation_types, s) })} className={`px-3 py-1 rounded-full text-xs border transition-colors ${form.irrigation_types.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Rainfall (mm)</Label><Input type="number" value={form.rainfall_range_min} onChange={e => setForm({ ...form, rainfall_range_min: +e.target.value })} /></div>
              <div><Label>Max Rainfall (mm)</Label><Input type="number" value={form.rainfall_range_max} onChange={e => setForm({ ...form, rainfall_range_max: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Temp (°C)</Label><Input type="number" value={form.temp_range_min} onChange={e => setForm({ ...form, temp_range_min: +e.target.value })} /></div>
              <div><Label>Max Temp (°C)</Label><Input type="number" value={form.temp_range_max} onChange={e => setForm({ ...form, temp_range_max: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Yield/Acre (q)</Label><Input type="number" value={form.yield_per_acre} onChange={e => setForm({ ...form, yield_per_acre: +e.target.value })} /></div>
              <div><Label>Price/Quintal (₹)</Label><Input type="number" value={form.price_per_quintal} onChange={e => setForm({ ...form, price_per_quintal: +e.target.value })} /></div>
              <div><Label>Cost/Acre (₹)</Label><Input type="number" value={form.cost_per_acre} onChange={e => setForm({ ...form, cost_per_acre: +e.target.value })} /></div>
            </div>
            <div>
              <Label>Market Demand</Label>
              <Select value={form.market_demand} onValueChange={v => setForm({ ...form, market_demand: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Fertilizer Summary</Label><Input value={form.fertilizer_summary} onChange={e => setForm({ ...form, fertilizer_summary: e.target.value })} /></div>
            <div><Label>Fertilizer Details (one per line)</Label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={form.fertilizer_details} onChange={e => setForm({ ...form, fertilizer_details: e.target.value })} /></div>
            <div><Label>Tips (one per line)</Label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={form.tips} onChange={e => setForm({ ...form, tips: e.target.value })} /></div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}><X className="w-4 h-4 mr-1" />Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}{editingCrop ? 'Update' : 'Add'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCropManagement;
