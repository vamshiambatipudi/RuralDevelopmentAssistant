import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Phone, Calendar, CheckCircle2, FileText, Building2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dbRowToScheme, Scheme } from '@/lib/schemesData';
import { supabase } from '@/integrations/supabase/client';

const SchemeDetails = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      const { data } = await supabase.from('schemes').select('*').eq('id', schemeId).single();
      if (data) setScheme(dbRowToScheme(data));
      setLoading(false);
    };
    if (schemeId) fetchScheme();
  }, [schemeId]);

  if (loading) return null;

  if (!scheme) {
    return (
      <AnimatedBackground variant="scheme">
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card rounded-2xl p-8 text-center max-w-md">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Scheme Not Found</h2>
            <p className="text-muted-foreground mb-4">The scheme you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/schemes')}><ArrowLeft className="w-4 h-4 mr-2" />Back to Schemes</Button>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

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

  return (
    <AnimatedBackground variant="scheme">
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/schemes')} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white truncate max-w-[250px]">{scheme.name}</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-card rounded-2xl p-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={getCategoryColor(scheme.category)}>{scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Updated: {new Date(scheme.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{scheme.name}</h2>
              <p className="text-muted-foreground text-lg">{scheme.description}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><span className="text-2xl">💰</span> Benefits</h3>
              <p className="text-muted-foreground bg-green-500/10 rounded-xl p-4 border border-green-500/20">{scheme.benefits}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-scheme" /> Eligibility Criteria
              </h3>
              <ul className="space-y-3">
                {scheme.eligibility.criteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-scheme mt-1">•</span><span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-scheme" /> Documents Required
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {scheme.documentsRequired.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-scheme" /><span className="text-muted-foreground">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '250ms' }}>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"><span className="text-2xl">📝</span> How to Apply</h3>
              <ol className="space-y-4">
                {scheme.applicationProcess.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-scheme text-white flex items-center justify-center font-semibold">{index + 1}</span>
                    <span className="text-muted-foreground pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1 py-6 text-lg font-semibold bg-scheme hover:bg-scheme/90">
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">Apply Online<ExternalLink className="w-5 h-5 ml-2" /></a>
                </Button>
                {scheme.helpline && (
                  <Button asChild variant="outline" className="flex-1 py-6 text-lg font-semibold border-scheme text-scheme hover:bg-scheme/10">
                    <a href={`tel:${scheme.helpline.split('/')[0].trim()}`}><Phone className="w-5 h-5 mr-2" />Helpline: {scheme.helpline}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedBackground>
  );
};

export default SchemeDetails;
