import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Save, Loader2, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface WeatherConfigItem {
  id: string;
  config_key: string;
  config_value: string;
  description: string;
}

const configMeta: Record<string, { label: string; type: 'number' | 'boolean'; unit?: string; icon: string }> = {
  high_temp_threshold: { label: 'High Temperature Threshold', type: 'number', unit: '°C', icon: '🔥' },
  low_temp_threshold: { label: 'Low Temperature Threshold', type: 'number', unit: '°C', icon: '❄️' },
  heavy_rain_threshold: { label: 'Heavy Rain Threshold', type: 'number', unit: 'mm', icon: '🌧️' },
  high_humidity_threshold: { label: 'High Humidity Threshold', type: 'number', unit: '%', icon: '💧' },
  wind_speed_threshold: { label: 'Wind Speed Threshold', type: 'number', unit: 'km/h', icon: '💨' },
  default_forecast_days: { label: 'Forecast Days', type: 'number', unit: 'days', icon: '📅' },
  enable_farming_tips: { label: 'Enable Farming Tips', type: 'boolean', icon: '🌾' },
  enable_weather_alerts: { label: 'Enable Weather Alerts', type: 'boolean', icon: '⚠️' },
};

const AdminWeatherConfig = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: authLoading } = useAdminAuth();
  const [configs, setConfigs] = useState<WeatherConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  useEffect(() => { if (!authLoading) fetchConfig(); }, [authLoading]);

  const fetchConfig = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('weather_config').select('*').order('config_key');
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      setConfigs(data || []);
      const vals: Record<string, string> = {};
      (data || []).forEach(c => { vals[c.config_key] = c.config_value; });
      setEditedValues(vals);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = configs.map(c => ({
      id: c.id,
      config_key: c.config_key,
      config_value: editedValues[c.config_key] ?? c.config_value,
      description: c.description,
    }));

    let hasError = false;
    for (const u of updates) {
      if (u.config_value !== configs.find(c => c.id === u.id)?.config_value) {
        const { error } = await supabase.from('weather_config').update({ config_value: u.config_value }).eq('id', u.id);
        if (error) { hasError = true; toast({ title: 'Error', description: error.message, variant: 'destructive' }); break; }
      }
    }
    if (!hasError) toast({ title: 'Settings saved successfully' });
    setSaving(false);
    fetchConfig();
  };

  const hasChanges = configs.some(c => editedValues[c.config_key] !== c.config_value);

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-sidebar-foreground hover:bg-sidebar-accent"><ArrowLeft className="w-5 h-5" /></Button>
            <Cloud className="w-6 h-6" />
            <h1 className="text-lg font-bold">Weather Module Config</h1>
          </div>
          <Button onClick={handleSave} disabled={saving || !hasChanges} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-6">
            {/* Alert Thresholds */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Alert Thresholds
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Configure when weather advisories are triggered for farmers</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {configs.filter(c => configMeta[c.config_key]?.type === 'number').map(config => {
                  const meta = configMeta[config.config_key];
                  if (!meta) return null;
                  return (
                    <div key={config.id} className="bg-muted/50 rounded-lg p-4">
                      <Label className="flex items-center gap-2 mb-2 text-foreground">
                        <span>{meta.icon}</span> {meta.label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editedValues[config.config_key] || ''}
                          onChange={e => setEditedValues({ ...editedValues, [config.config_key]: e.target.value })}
                          className="w-24"
                        />
                        {meta.unit && <span className="text-sm text-muted-foreground">{meta.unit}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Feature Toggles
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Enable or disable weather module features</p>
              <div className="space-y-4">
                {configs.filter(c => configMeta[c.config_key]?.type === 'boolean').map(config => {
                  const meta = configMeta[config.config_key];
                  if (!meta) return null;
                  const isEnabled = editedValues[config.config_key] === 'true';
                  return (
                    <div key={config.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                      <div>
                        <Label className="flex items-center gap-2 text-foreground">
                          <span>{meta.icon}</span> {meta.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={checked => setEditedValues({ ...editedValues, [config.config_key]: checked ? 'true' : 'false' })}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Card */}
            <div className="glass-card rounded-xl p-6 bg-primary/5 border border-primary/20">
              <h3 className="font-medium text-foreground mb-2">ℹ️ About Weather Configuration</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Alert thresholds determine when weather advisories appear for farmers</li>
                <li>• Farming tips provide crop-specific guidance based on current weather</li>
                <li>• Weather data is sourced via browser geolocation and reverse geocoding</li>
                <li>• Changes take effect immediately for all users</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminWeatherConfig;
