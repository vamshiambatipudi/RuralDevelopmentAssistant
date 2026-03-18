import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Search, Filter, ExternalLink, Users, UserCircle, GraduationCap, Heart, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { filterSchemes, dbRowToScheme, UserProfile, Scheme } from '@/lib/schemesData';
import { supabase } from '@/integrations/supabase/client';

const categories = [
  { value: 'all', label: 'All Schemes', icon: Building2 },
  { value: 'farmers', label: 'Farmers', icon: Users },
  { value: 'rural', label: 'Rural Citizens', icon: UserCircle },
  { value: 'women', label: 'Women', icon: Heart },
  { value: 'students', label: 'Students', icon: GraduationCap },
  { value: 'elderly', label: 'Senior Citizens', icon: Users },
];

const farmerTypes = ['Small', 'Marginal', 'Medium', 'Large', 'Tenant', 'Landless'];
const states = [
  'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other'
];

const GovernmentSchemes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase.from('schemes').select('*').eq('is_active', true);
      if (data) setSchemes(data.map(dbRowToScheme));
      setLoading(false);
    };
    fetchSchemes();
  }, []);

  const filteredSchemes = filterSchemes(schemes, category, search, userProfile);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      farmers: 'bg-crop text-white',
      rural: 'bg-primary text-primary-foreground',
      women: 'bg-pink-500 text-white',
      students: 'bg-blue-500 text-white',
      elderly: 'bg-purple-500 text-white',
    };
    return colors[cat] || 'bg-muted text-muted-foreground';
  };

  const handleViewDetails = (schemeId: string) => {
    navigate(`/schemes/${schemeId}`);
  };

  const hasActiveFilters = Object.values(userProfile).some(v => v !== undefined && v !== '');

  return (
    <AnimatedBackground variant="scheme">
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Government Schemes</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Search & Filter */}
          <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search schemes by name or description..." className="pl-12 input-rural" />
              </div>
              <Button variant={showFilters ? 'default' : 'outline'} onClick={() => setShowFilters(!showFilters)} className={showFilters ? 'bg-scheme' : 'border-white/30 text-foreground'}>
                <Filter className="w-4 h-4 mr-2" />
                Eligibility Check
                {hasActiveFilters && <span className="ml-2 w-2 h-2 rounded-full bg-green-400" />}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <Button key={cat.value} variant={category === cat.value ? 'default' : 'outline'} size="sm" onClick={() => setCategory(cat.value)}
                  className={`rounded-full ${category === cat.value ? 'bg-white text-scheme' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'}`}>
                  <cat.icon className="w-4 h-4 mr-1" />{cat.label}
                </Button>
              ))}
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-white/20 grid md:grid-cols-4 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Farmer Type</Label>
                  <Select value={userProfile.farmerType || ''} onValueChange={(value) => setUserProfile({ ...userProfile, farmerType: value || undefined })}>
                    <SelectTrigger className="input-rural"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      {farmerTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Land Size (acres)</Label>
                  <Input type="number" placeholder="e.g., 5" className="input-rural" value={userProfile.landSize || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, landSize: e.target.value ? parseFloat(e.target.value) : undefined })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Age</Label>
                  <Input type="number" placeholder="e.g., 35" className="input-rural" value={userProfile.age || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value ? parseInt(e.target.value) : undefined })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Gender</Label>
                  <Select value={userProfile.gender || ''} onValueChange={(value) => setUserProfile({ ...userProfile, gender: value || undefined })}>
                    <SelectTrigger className="input-rural"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">State</Label>
                  <Select value={userProfile.state || ''} onValueChange={(value) => setUserProfile({ ...userProfile, state: value || undefined })}>
                    <SelectTrigger className="input-rural"><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      {states.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Annual Income (₹)</Label>
                  <Input type="number" placeholder="e.g., 100000" className="input-rural" value={userProfile.annualIncome || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, annualIncome: e.target.value ? parseInt(e.target.value) : undefined })} />
                </div>
                <div className="md:col-span-2 flex items-end">
                  <Button variant="outline" onClick={() => setUserProfile({})} className="border-white/30 text-foreground hover:bg-white/20">Clear Filters</Button>
                </div>
              </div>
            )}
          </div>

          <p className="text-white mb-4">
            {loading ? 'Loading...' : `Showing ${filteredSchemes.length} scheme${filteredSchemes.length !== 1 ? 's' : ''}`}
            {hasActiveFilters && ' (filtered by eligibility)'}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme, index) => {
              const schemeWithEligibility = scheme as Scheme & { eligibilityResult?: { eligible: boolean; matchScore: number; reasons: string[] } };
              const eligibility = schemeWithEligibility.eligibilityResult;

              return (
                <div key={scheme.id} className="glass-card rounded-2xl p-6 hover-lift animate-fade-in cursor-pointer group" style={{ animationDelay: `${index * 50}ms` }} onClick={() => handleViewDetails(scheme.id)}>
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getCategoryColor(scheme.category)}>{scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}</Badge>
                    {eligibility && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${eligibility.eligible ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-500'}`}>
                        {eligibility.eligible ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {eligibility.matchScore}% match
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-scheme transition-colors">{scheme.name}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{scheme.description}</p>
                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">Key Benefits:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{scheme.benefits}</p>
                    </div>
                    {eligibility && !eligibility.eligible && eligibility.reasons.length > 0 && (
                      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                        <p className="text-xs text-red-500">{eligibility.reasons[0]}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-scheme text-scheme hover:bg-scheme/10" onClick={(e) => { e.stopPropagation(); handleViewDetails(scheme.id); }}>
                      View Details<ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button asChild className="flex-1 bg-scheme hover:bg-scheme/90 text-white" onClick={(e) => e.stopPropagation()}>
                      <a href={scheme.link} target="_blank" rel="noopener noreferrer">Apply Now<ExternalLink className="w-4 h-4 ml-2" /></a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && filteredSchemes.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Schemes Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find relevant schemes</p>
            </div>
          )}
        </main>
      </div>
    </AnimatedBackground>
  );
};

export default GovernmentSchemes;
