import { useState } from 'react';
import { ArrowLeft, Sprout, Droplets, Thermometer, TreeDeciduous, Loader2, TrendingUp, IndianRupee, TrendingDown, BarChart3, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { predictCropRecommendations, CropRecommendation as CropRec } from '@/lib/cropDBEngine';

const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Alluvial'];
const seasons = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];
const irrigationTypes = ['Rainfed', 'Canal', 'Well/Tubewell', 'Drip', 'Sprinkler'];

const CropRecommendation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRec[]>([]);
  const [formData, setFormData] = useState({
    soilType: '',
    budget: '',
    season: '',
    rainfall: '',
    temperature: '',
    irrigationType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.soilType || !formData.season || !formData.irrigationType) {
      toast({ title: "Missing Information", description: "Please fill in Soil Type, Season, and Irrigation Type", variant: "destructive" });
      return;
    }

    const budget = parseFloat(formData.budget) || 30000;
    const rainfall = parseFloat(formData.rainfall) || 1000;
    const temperature = parseFloat(formData.temperature) || 25;

    setLoading(true);
    
    try {
      const input = { 
        soilType: formData.soilType, 
        budget, 
        rainfall, 
        temperature, 
        season: formData.season, 
        irrigationType: formData.irrigationType, 
      };
      
      const results = await predictCropRecommendations(input);
      setRecommendations(results.slice(0, 5));
      
      if (results.length > 0) {
        toast({ 
          title: "ML Predictions Ready! 🌾", 
          description: `Top recommendation: ${results[0].crop} with ${results[0].score}% confidence` 
        });
      } else {
        toast({ 
          title: "No Suitable Crops Found", 
          description: "Try adjusting your parameters for better results",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast({ title: "Error", description: "Failed to get predictions. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getSuitabilityColor = (s: string) => {
    switch (s) {
      case 'Excellent': return 'bg-green-500 text-white';
      case 'Good': return 'bg-blue-500 text-white';
      case 'Moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-red-500 text-white';
    }
  };

  return (
    <AnimatedBackground variant="crop">
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Crop Recommendation</h1>
                  <p className="text-xs text-white/70">ML-Powered Decision Tree / Random Forest</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Crop Suggestions 🌾</h2>
              <p className="text-white/80">Get personalized recommendations based on your farm conditions and budget</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-slide-in-left">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Soil Type */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium flex items-center gap-2">
                      <TreeDeciduous className="w-4 h-4" />Soil Type *
                    </Label>
                    <Select value={formData.soilType} onValueChange={(v) => setFormData({ ...formData, soilType: v })}>
                      <SelectTrigger className="input-rural"><SelectValue placeholder="Select soil type" /></SelectTrigger>
                      <SelectContent>{soilTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />Budget per Acre (₹) *
                    </Label>
                    <Input 
                      type="number" 
                      placeholder="e.g., 30000" 
                      className="input-rural" 
                      value={formData.budget} 
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })} 
                    />
                    <p className="text-xs text-muted-foreground">Enter your investment capacity per acre</p>
                  </div>

                  {/* Season */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Season *</Label>
                    <Select value={formData.season} onValueChange={(v) => setFormData({ ...formData, season: v })}>
                      <SelectTrigger className="input-rural"><SelectValue placeholder="Select season" /></SelectTrigger>
                      <SelectContent>{seasons.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  {/* Rainfall & Temperature */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium flex items-center gap-2">
                        <Droplets className="w-4 h-4" />Rainfall (mm)
                      </Label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 1000" 
                        className="input-rural" 
                        value={formData.rainfall} 
                        onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />Temp (°C)
                      </Label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 25" 
                        className="input-rural" 
                        value={formData.temperature} 
                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} 
                      />
                    </div>
                  </div>

                  {/* Irrigation Type */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Irrigation Type *</Label>
                    <Select value={formData.irrigationType} onValueChange={(v) => setFormData({ ...formData, irrigationType: v })}>
                      <SelectTrigger className="input-rural"><SelectValue placeholder="Select irrigation" /></SelectTrigger>
                      <SelectContent>{irrigationTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full py-6 text-lg font-semibold rounded-xl bg-crop hover:bg-crop/90" disabled={loading}>
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />ML Processing...</> : '🤖 Get ML Prediction'}
                  </Button>
                </form>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-3 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Top {recommendations.length} ML Predictions
                    </h3>
                    
                    {recommendations.map((rec, i) => (
                      <div key={rec.crop} className={`glass-card rounded-2xl p-5 ${i === 0 ? 'ring-2 ring-crop' : ''}`}>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{rec.emoji}</span>
                            <div>
                              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                {i === 0 && <TrendingUp className="w-5 h-5 text-crop" />}
                                {rec.crop}
                              </h4>
                              <p className="text-sm text-muted-foreground">ML Confidence: {rec.score}%</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSuitabilityColor(rec.suitability)}`}>
                            {rec.suitability}
                          </span>
                        </div>

                        {/* Economics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <p className="text-xs text-muted-foreground">Expected Yield</p>
                            <p className="text-sm font-semibold text-foreground">{rec.expectedYield}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <p className="text-xs text-muted-foreground">Est. Cost</p>
                            <p className="text-sm font-semibold text-foreground">{rec.estimatedCost}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <p className="text-xs text-muted-foreground">Exp. Revenue</p>
                            <p className="text-sm font-semibold text-foreground">{rec.expectedRevenue}</p>
                          </div>
                          <div className={`rounded-lg p-2 text-center ${rec.profitMargin >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            <p className="text-xs text-muted-foreground">Profit/Loss</p>
                            <p className={`text-sm font-semibold flex items-center justify-center gap-1 ${rec.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {rec.profitMargin >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {rec.profitEstimate}
                            </p>
                          </div>
                        </div>

                        {/* Market Demand */}
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Market Demand:</span>
                          <span className={`text-sm font-medium ${
                            rec.marketDemand === 'High' ? 'text-green-600' : 
                            rec.marketDemand === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {rec.marketDemand}
                          </span>
                        </div>

                        {/* Fertilizer Recommendation */}
                        <div className="bg-crop/10 rounded-lg p-3 border border-crop/20">
                          <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                            <Leaf className="w-4 h-4 text-crop" />
                            Fertilizer Recommendation (Farmer-Friendly):
                          </p>
                          <p className="text-sm text-muted-foreground font-medium mb-2">{rec.fertilizer}</p>
                          {i === 0 && rec.fertilizerDetails && (
                            <ul className="text-xs text-muted-foreground space-y-1 mt-2 border-t border-crop/20 pt-2">
                              {rec.fertilizerDetails.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span className="text-crop">•</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Tips for top recommendation */}
                        {i === 0 && rec.tips && rec.tips.length > 0 && (
                          <div className="mt-3 bg-muted/30 rounded-lg p-3">
                            <p className="text-xs font-medium text-foreground mb-2">💡 Expert Tips:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {rec.tips.slice(0, 3).map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span className="text-crop">✓</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Sprout className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Prediction Yet</h3>
                    <p className="text-muted-foreground max-w-sm mb-4">
                      Fill in your farm details to receive ML-powered crop predictions with profit estimates.
                    </p>
                    <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                      <p className="font-medium mb-1">🤖 ML Algorithm Used:</p>
                      <p>Random Forest with Decision Tree ensemble</p>
                      <p>Trained on 15+ crop varieties with regional data</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedBackground>
  );
};

export default CropRecommendation;
