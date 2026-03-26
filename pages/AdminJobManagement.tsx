import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, Briefcase, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobRow {
  id: string; title: string; company: string; location: string; salary: string;
  type: string; category: string; description: string; requirements: string[];
  eligibility: string[]; apply_link: string | null; is_active: boolean;
  created_at: string; updated_at: string;
}

interface TrainingRow {
  id: string; title: string; provider: string; duration: string; category: string;
  level: string; free: boolean; description: string; syllabus: string[];
  enroll_link: string | null; is_active: boolean; created_at: string; updated_at: string;
}

const jobCategories = ['agriculture', 'handicraft', 'digital'];
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Government'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

const AdminJobManagement = () => {
  const navigate = useNavigate();
  const { loading } = useAdminAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [search, setSearch] = useState('');
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [deleting, setDeleting] = useState<{ type: 'job' | 'training'; id: string } | null>(null);

  // Job form
  const [jobForm, setJobForm] = useState({ id: '', title: '', company: '', location: '', salary: '', type: 'Full-time', category: 'agriculture', description: '', apply_link: '', is_active: true });
  const [jobReqInput, setJobReqInput] = useState('');
  const [jobEligInput, setJobEligInput] = useState('');
  const [isEditingJob, setIsEditingJob] = useState(false);

  // Training form
  const [trainingForm, setTrainingForm] = useState({ id: '', title: '', provider: '', duration: '', category: 'agriculture', level: 'Beginner', free: true, description: '', enroll_link: '', is_active: true });
  const [syllabusInput, setSyllabusInput] = useState('');
  const [isEditingTraining, setIsEditingTraining] = useState(false);

  const fetchData = async () => {
    const [{ data: j }, { data: t }] = await Promise.all([
      supabase.from('jobs').select('*').order('created_at', { ascending: false }),
      supabase.from('trainings').select('*').order('created_at', { ascending: false }),
    ]);
    if (j) setJobs(j as JobRow[]);
    if (t) setTrainings(t as TrainingRow[]);
  };

  useEffect(() => { if (!loading) fetchData(); }, [loading]);

  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()));
  const filteredTrainings = trainings.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.provider.toLowerCase().includes(search.toLowerCase()));

  // Job CRUD
  const openCreateJob = () => {
    setJobForm({ id: '', title: '', company: '', location: '', salary: '', type: 'Full-time', category: 'agriculture', description: '', apply_link: '', is_active: true });
    setJobReqInput(''); setJobEligInput(''); setIsEditingJob(false); setShowJobDialog(true);
  };

  const openEditJob = (job: JobRow) => {
    setJobForm({ id: job.id, title: job.title, company: job.company, location: job.location, salary: job.salary, type: job.type, category: job.category, description: job.description, apply_link: job.apply_link || '', is_active: job.is_active });
    setJobReqInput((job.requirements || []).join('\n'));
    setJobEligInput((job.eligibility || []).join('\n'));
    setIsEditingJob(true); setShowJobDialog(true);
  };

  const saveJob = async () => {
    const payload = {
      title: jobForm.title, company: jobForm.company, location: jobForm.location,
      salary: jobForm.salary, type: jobForm.type, category: jobForm.category,
      description: jobForm.description, requirements: jobReqInput.split('\n').filter(Boolean),
      eligibility: jobEligInput.split('\n').filter(Boolean), apply_link: jobForm.apply_link || null,
      is_active: jobForm.is_active,
    };
    let error;
    if (isEditingJob) {
      ({ error } = await supabase.from('jobs').update(payload).eq('id', jobForm.id));
    } else {
      ({ error } = await supabase.from('jobs').insert(payload));
    }
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: isEditingJob ? 'Job Updated' : 'Job Created' });
    setShowJobDialog(false); fetchData();
  };

  // Training CRUD
  const openCreateTraining = () => {
    setTrainingForm({ id: '', title: '', provider: '', duration: '', category: 'agriculture', level: 'Beginner', free: true, description: '', enroll_link: '', is_active: true });
    setSyllabusInput(''); setIsEditingTraining(false); setShowTrainingDialog(true);
  };

  const openEditTraining = (t: TrainingRow) => {
    setTrainingForm({ id: t.id, title: t.title, provider: t.provider, duration: t.duration, category: t.category, level: t.level, free: t.free, description: t.description, enroll_link: t.enroll_link || '', is_active: t.is_active });
    setSyllabusInput((t.syllabus || []).join('\n'));
    setIsEditingTraining(true); setShowTrainingDialog(true);
  };

  const saveTraining = async () => {
    const payload = {
      title: trainingForm.title, provider: trainingForm.provider, duration: trainingForm.duration,
      category: trainingForm.category, level: trainingForm.level, free: trainingForm.free,
      description: trainingForm.description, syllabus: syllabusInput.split('\n').filter(Boolean),
      enroll_link: trainingForm.enroll_link || null, is_active: trainingForm.is_active,
    };
    let error;
    if (isEditingTraining) {
      ({ error } = await supabase.from('trainings').update(payload).eq('id', trainingForm.id));
    } else {
      ({ error } = await supabase.from('trainings').insert(payload));
    }
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: isEditingTraining ? 'Training Updated' : 'Training Created' });
    setShowTrainingDialog(false); fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const table = deleting.type === 'job' ? 'jobs' : 'trainings';
    await supabase.from(table).delete().eq('id', deleting.id);
    toast({ title: `${deleting.type === 'job' ? 'Job' : 'Training'} Deleted` });
    setDeleting(null); fetchData();
  };

  const toggleActive = async (type: 'job' | 'training', id: string, current: boolean) => {
    const table = type === 'job' ? 'jobs' : 'trainings';
    await supabase.from(table).update({ is_active: !current }).eq('id', id);
    fetchData();
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
            <Briefcase className="w-6 h-6" />
            <h1 className="text-xl font-bold">Jobs & Trainings Management</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or trainings..." className="pl-10" />
        </div>

        <Tabs defaultValue="jobs">
          <TabsList className="mb-6">
            <TabsTrigger value="jobs"><Briefcase className="w-4 h-4 mr-2" />Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="trainings"><GraduationCap className="w-4 h-4 mr-2" />Trainings ({trainings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">{filteredJobs.length} job(s)</span>
              <Button onClick={openCreateJob} className="gap-2"><Plus className="w-4 h-4" />Add Job</Button>
            </div>
            <div className="space-y-3">
              {filteredJobs.map(job => (
                <div key={job.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                      <Badge variant={job.is_active ? 'default' : 'secondary'}>{job.is_active ? 'Active' : 'Inactive'}</Badge>
                      <Badge variant="outline">{job.category}</Badge>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.company} • {job.location} • {job.salary}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => toggleActive('job', job.id, job.is_active)}>
                      {job.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditJob(job)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleting({ type: 'job', id: job.id })}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trainings">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">{filteredTrainings.length} training(s)</span>
              <Button onClick={openCreateTraining} className="gap-2"><Plus className="w-4 h-4" />Add Training</Button>
            </div>
            <div className="space-y-3">
              {filteredTrainings.map(t => (
                <div key={t.id} className="glass-card rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{t.title}</h3>
                      <Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Active' : 'Inactive'}</Badge>
                      <Badge variant="outline">{t.category}</Badge>
                      {t.free && <Badge className="bg-green-600 text-white">Free</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{t.provider} • {t.duration} • {t.level}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => toggleActive('training', t.id, t.is_active)}>
                      {t.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditTraining(t)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleting({ type: 'training', id: t.id })}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Dialog */}
        <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{isEditingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Job Title *</Label><Input value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} /></div>
                <div className="space-y-2"><Label>Company *</Label><Input value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Location</Label><Input value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} /></div>
                <div className="space-y-2"><Label>Salary</Label><Input value={jobForm.salary} onChange={e => setJobForm({ ...jobForm, salary: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={jobForm.type} onValueChange={v => setJobForm({ ...jobForm, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{jobTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={jobForm.category} onValueChange={v => setJobForm({ ...jobForm, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{jobCategories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>Requirements (one per line)</Label><Textarea value={jobReqInput} onChange={e => setJobReqInput(e.target.value)} rows={3} /></div>
              <div className="space-y-2"><Label>Eligibility (one per line)</Label><Textarea value={jobEligInput} onChange={e => setJobEligInput(e.target.value)} rows={3} /></div>
              <div className="space-y-2"><Label>Apply Link</Label><Input value={jobForm.apply_link} onChange={e => setJobForm({ ...jobForm, apply_link: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowJobDialog(false)}>Cancel</Button>
              <Button onClick={saveJob} disabled={!jobForm.title || !jobForm.company}>{isEditingJob ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Training Dialog */}
        <Dialog open={showTrainingDialog} onOpenChange={setShowTrainingDialog}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{isEditingTraining ? 'Edit Training' : 'Add New Training'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={trainingForm.title} onChange={e => setTrainingForm({ ...trainingForm, title: e.target.value })} /></div>
                <div className="space-y-2"><Label>Provider *</Label><Input value={trainingForm.provider} onChange={e => setTrainingForm({ ...trainingForm, provider: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Duration</Label><Input value={trainingForm.duration} onChange={e => setTrainingForm({ ...trainingForm, duration: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={trainingForm.category} onValueChange={v => setTrainingForm({ ...trainingForm, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{jobCategories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={trainingForm.level} onValueChange={v => setTrainingForm({ ...trainingForm, level: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={trainingForm.free} onCheckedChange={v => setTrainingForm({ ...trainingForm, free: v })} />
                <Label>Free Course</Label>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={trainingForm.description} onChange={e => setTrainingForm({ ...trainingForm, description: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>Syllabus (one topic per line)</Label><Textarea value={syllabusInput} onChange={e => setSyllabusInput(e.target.value)} rows={4} /></div>
              <div className="space-y-2"><Label>Enroll Link</Label><Input value={trainingForm.enroll_link} onChange={e => setTrainingForm({ ...trainingForm, enroll_link: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTrainingDialog(false)}>Cancel</Button>
              <Button onClick={saveTraining} disabled={!trainingForm.title || !trainingForm.provider}>{isEditingTraining ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Delete {deleting?.type === 'job' ? 'Job' : 'Training'}?</DialogTitle></DialogHeader>
            <p className="text-muted-foreground">This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminJobManagement;
