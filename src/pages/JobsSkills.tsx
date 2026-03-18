import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Briefcase, Search, MapPin, Clock, IndianRupee, GraduationCap, Hammer, Laptop, Tractor, ExternalLink, CheckCircle2, FileText, Trash2, Eye, BookOpen, Award, Upload, Edit, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Job, Training, Application, Enrollment,
  saveApplication, getApplications, deleteApplication, hasApplied, updateApplication,
  saveEnrollment, getEnrollments, deleteEnrollment, hasEnrolled, updateEnrollmentProgress
} from '@/lib/jobsData';
import { supabase } from '@/integrations/supabase/client';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'agriculture': return Tractor;
    case 'handicraft': return Hammer;
    case 'digital': return Laptop;
    default: return Briefcase;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'agriculture': return 'bg-crop text-white';
    case 'handicraft': return 'bg-accent text-white';
    case 'digital': return 'bg-blue-500 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

const JobsSkills = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showTrainingDetails, setShowTrainingDetails] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [enrolledTrainings, setEnrolledTrainings] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<Application[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [showApplications, setShowApplications] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [confirmEnroll, setConfirmEnroll] = useState(false);
  
  // Application form state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const [dbJobs, setDbJobs] = useState<Job[]>([]);
  const [dbTrainings, setDbTrainings] = useState<Training[]>([]);

  useEffect(() => {
    // Load applications/enrollments from localStorage
    const apps = getApplications();
    setApplications(apps);
    setAppliedJobs(new Set(apps.map(a => a.jobId)));

    const enrolls = getEnrollments();
    setEnrollments(enrolls);
    setEnrolledTrainings(new Set(enrolls.map(e => e.trainingId)));

    // Load jobs and trainings from database
    const fetchData = async () => {
      const [{ data: jobsData }, { data: trainingsData }] = await Promise.all([
        supabase.from('jobs').select('*').eq('is_active', true),
        supabase.from('trainings').select('*').eq('is_active', true),
      ]);
      if (jobsData) setDbJobs(jobsData.map((j: any) => ({
        id: j.id, title: j.title, company: j.company, location: j.location,
        salary: j.salary, type: j.type, category: j.category, posted: 'Active',
        description: j.description, requirements: j.requirements || [],
        eligibility: j.eligibility || [], applyLink: j.apply_link,
      })));
      if (trainingsData) setDbTrainings(trainingsData.map((t: any) => ({
        id: t.id, title: t.title, provider: t.provider, duration: t.duration,
        category: t.category, level: t.level, free: t.free,
        description: t.description, syllabus: t.syllabus || [],
        enrollLink: t.enroll_link,
      })));
    };
    fetchData();
  }, []);

  const filteredJobs = dbJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTrainings = dbTrainings.filter(
    (training) =>
      training.title.toLowerCase().includes(search.toLowerCase()) ||
      training.provider.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleProceedToApply = () => {
    if (!selectedJob) return;
    setShowJobDetails(false);
    setResumeFile(null);
    setApplicationNotes('');
    setShowApplicationForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleApply = () => {
    if (!selectedJob) return;

    const app = saveApplication(selectedJob, resumeFile?.name, applicationNotes);
    setAppliedJobs(prev => new Set([...prev, selectedJob.id]));
    setApplications(prev => [...prev, app]);
    setShowApplicationForm(false);
    setResumeFile(null);
    setApplicationNotes('');
    
    toast({
      title: "Application Submitted! ✅",
      description: `You have applied for ${selectedJob.title} at ${selectedJob.company}`,
    });

    // Open external link if available
    if (selectedJob.applyLink) {
      window.open(selectedJob.applyLink, '_blank');
    }
  };

  const handleEditApplication = (app: Application) => {
    setEditingApplication(app);
    setApplicationNotes(app.notes || '');
  };

  const handleSaveEdit = () => {
    if (!editingApplication) return;
    
    updateApplication(editingApplication.id, { notes: applicationNotes });
    setApplications(getApplications());
    setEditingApplication(null);
    setApplicationNotes('');
    
    toast({
      title: "Application Updated",
      description: "Your application has been updated successfully",
    });
  };

  const handleDeleteApplication = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (app && deleteApplication(appId)) {
      setApplications(prev => prev.filter(a => a.id !== appId));
      setAppliedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(app.jobId);
        return newSet;
      });
      toast({
        title: "Application Withdrawn",
        description: "Your application has been removed",
      });
    }
  };

  const handleViewTrainingDetails = (training: Training) => {
    setSelectedTraining(training);
    setShowTrainingDetails(true);
  };

  const handleConfirmEnroll = () => {
    if (!selectedTraining) return;
    setConfirmEnroll(true);
  };

  const handleEnroll = () => {
    if (!selectedTraining) return;

    const enrollment = saveEnrollment(selectedTraining);
    setEnrolledTrainings(prev => new Set([...prev, selectedTraining.id]));
    setEnrollments(prev => [...prev, enrollment]);
    setConfirmEnroll(false);
    setShowTrainingDetails(false);
    
    toast({
      title: "Enrollment Successful! 📚",
      description: `You are now enrolled in ${selectedTraining.title}`,
    });

    // Open external link if available
    if (selectedTraining.enrollLink) {
      window.open(selectedTraining.enrollLink, '_blank');
    }
  };

  const handleDeleteEnrollment = (enrollmentId: string) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (enrollment && deleteEnrollment(enrollmentId)) {
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      setEnrolledTrainings(prev => {
        const newSet = new Set(prev);
        newSet.delete(enrollment.trainingId);
        return newSet;
      });
      toast({
        title: "Enrollment Cancelled",
        description: "Your enrollment has been removed",
      });
    }
  };

  const handleUpdateProgress = (enrollmentId: string, progress: number) => {
    if (updateEnrollmentProgress(enrollmentId, progress)) {
      setEnrollments(getEnrollments());
      if (progress >= 100) {
        toast({
          title: "Congratulations! 🎉",
          description: "You have completed the training!",
        });
      }
    }
  };

  return (
    <AnimatedBackground variant="job">
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">Jobs & Skills</h1>
                </div>
              </div>
              
              <div className="flex gap-2">
                {applications.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowApplications(true)}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    My Applications ({applications.length})
                  </Button>
                )}
                {enrollments.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowEnrollments(true)}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    My Trainings ({enrollments.length})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Search */}
          <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or training programs..."
                className="pl-12 input-rural"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="jobs" className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <TabsList className="grid w-full grid-cols-2 bg-white/20 rounded-xl p-1 mb-6">
              <TabsTrigger
                value="jobs"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-job text-white"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Job Opportunities
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-job text-white"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Skill Training
              </TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-4">
              {filteredJobs.map((job, index) => {
                const Icon = getCategoryIcon(job.category);
                const isApplied = appliedJobs.has(job.id);
                
                return (
                  <div
                    key={job.id}
                    className="glass-card rounded-2xl p-6 hover-lift animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleViewJobDetails(job)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-job/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-job" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                          <Badge className={getCategoryColor(job.category)}>
                            {job.category}
                          </Badge>
                          <Badge variant="outline">{job.type}</Badge>
                          {isApplied && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Applied
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground font-medium">{job.company}</p>

                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.posted}
                          </span>
                        </div>
                      </div>

                      <Button 
                        className={isApplied ? "bg-green-500 hover:bg-green-600 text-white" : "bg-job hover:bg-job/90 text-white"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isApplied) {
                            handleViewJobDetails(job);
                          }
                        }}
                        disabled={isApplied}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            View & Apply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="space-y-4">
              {filteredTrainings.map((training, index) => {
                const Icon = getCategoryIcon(training.category);
                const isEnrolled = enrolledTrainings.has(training.id);
                
                return (
                  <div
                    key={training.id}
                    className="glass-card rounded-2xl p-6 hover-lift animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleViewTrainingDetails(training)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-secondary-foreground" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{training.title}</h3>
                          <Badge className={getCategoryColor(training.category)}>
                            {training.category}
                          </Badge>
                          {training.free && (
                            <Badge className="bg-green-500 text-white">Free</Badge>
                          )}
                          {isEnrolled && (
                            <Badge className="bg-blue-500 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Enrolled
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground font-medium">{training.provider}</p>

                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {training.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {training.level}
                          </span>
                        </div>
                      </div>

                      <Button 
                        className={isEnrolled ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isEnrolled) {
                            handleViewTrainingDetails(training);
                          }
                        }}
                        disabled={isEnrolled}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Enrolled
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            View & Enroll
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </main>

        {/* Job Details Dialog */}
        <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                  <DialogDescription className="text-base font-medium">
                    {selectedJob.company} • {selectedJob.location}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoryColor(selectedJob.category)}>{selectedJob.category}</Badge>
                    <Badge variant="outline">{selectedJob.type}</Badge>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <p className="font-medium text-foreground mb-1">Salary</p>
                    <p className="text-muted-foreground">{selectedJob.salary}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-foreground mb-2">Description</p>
                    <p className="text-muted-foreground">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-foreground mb-2">Requirements</p>
                    <ul className="space-y-1">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-job">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <p className="font-medium text-foreground mb-2">Eligibility Criteria</p>
                    <ul className="space-y-1">
                      {selectedJob.eligibility.map((elig, i) => (
                        <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          {elig}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowJobDetails(false)}>
                    Close
                  </Button>
                  <Button 
                    className="bg-job hover:bg-job/90 text-white"
                    onClick={handleProceedToApply}
                    disabled={appliedJobs.has(selectedJob.id)}
                  >
                    {appliedJobs.has(selectedJob.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Already Applied
                      </>
                    ) : (
                      'Proceed to Apply'
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Application Form Dialog */}
        <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Complete your application for {selectedJob?.company}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Job Summary */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-job" />
                  <div>
                    <p className="font-medium text-foreground">{selectedJob?.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedJob?.company} • {selectedJob?.salary}</p>
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-2">
                <Label htmlFor="resume">Resume (Optional)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="resume"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {resumeFile ? resumeFile.name : 'Upload Resume'}
                  </Button>
                  {resumeFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setResumeFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information about your application..."
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Eligibility Reminder */}
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                <p className="text-sm text-muted-foreground">
                  By submitting, you confirm that you meet the eligibility criteria. Your application will be recorded locally and you may be redirected to the official portal.
                </p>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-job hover:bg-job/90 text-white"
                onClick={handleApply}
              >
                Submit Application
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Training Details Dialog */}
        <Dialog open={showTrainingDetails} onOpenChange={setShowTrainingDetails}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedTraining && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedTraining.title}</DialogTitle>
                  <DialogDescription className="text-base font-medium">
                    {selectedTraining.provider}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoryColor(selectedTraining.category)}>{selectedTraining.category}</Badge>
                    <Badge variant="outline">{selectedTraining.level}</Badge>
                    {selectedTraining.free && <Badge className="bg-green-500 text-white">Free</Badge>}
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <p className="font-medium text-foreground mb-1">Duration</p>
                    <p className="text-muted-foreground">{selectedTraining.duration}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-foreground mb-2">Description</p>
                    <p className="text-muted-foreground">{selectedTraining.description}</p>
                  </div>

                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <p className="font-medium text-foreground mb-2">What You'll Learn</p>
                    <ul className="space-y-1">
                      {selectedTraining.syllabus.map((item, i) => (
                        <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                          <BookOpen className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowTrainingDetails(false)}>
                    Close
                  </Button>
                  <Button 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    onClick={handleConfirmEnroll}
                    disabled={enrolledTrainings.has(selectedTraining.id)}
                  >
                    {enrolledTrainings.has(selectedTraining.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Already Enrolled
                      </>
                    ) : (
                      'Proceed to Enroll'
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Enrollment Dialog */}
        <Dialog open={confirmEnroll} onOpenChange={setConfirmEnroll}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Enrollment</DialogTitle>
              <DialogDescription>
                You are about to enroll in <strong>{selectedTraining?.title}</strong> by <strong>{selectedTraining?.provider}</strong>.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <p className="text-sm text-muted-foreground">
                {selectedTraining?.free 
                  ? "This is a free training program. You may be redirected to the official portal to complete registration."
                  : "This training has associated fees. You will be redirected to the official portal to complete registration and payment."
                }
              </p>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setConfirmEnroll(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={handleEnroll}
              >
                Confirm Enrollment
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* My Applications Dialog */}
        <Dialog open={showApplications} onOpenChange={setShowApplications}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>My Applications</DialogTitle>
              <DialogDescription>
                Track and manage your job applications
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No applications yet. Start applying for jobs!
                </p>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="bg-muted rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{app.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied: {app.appliedAt.toLocaleDateString()}
                        </p>
                        {app.resumeName && (
                          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {app.resumeName}
                          </p>
                        )}
                        {app.notes && (
                          <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                            "{app.notes}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-green-500 text-white capitalize">
                          {app.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:bg-blue-500/10"
                            onClick={() => handleEditApplication(app)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteApplication(app.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowApplications(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Application Dialog */}
        <Dialog open={!!editingApplication} onOpenChange={() => setEditingApplication(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Application</DialogTitle>
              <DialogDescription>
                Update your application for {editingApplication?.jobTitle}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add notes about your application..."
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setEditingApplication(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* My Trainings Dialog */}
        <Dialog open={showEnrollments} onOpenChange={setShowEnrollments}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>My Trainings</DialogTitle>
              <DialogDescription>
                Track your enrolled training programs
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              {enrollments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No enrollments yet. Start learning new skills!
                </p>
              ) : (
                enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="bg-muted rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{enrollment.trainingTitle}</h4>
                        <p className="text-sm text-muted-foreground">{enrollment.provider}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enrolled: {enrollment.enrolledAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          enrollment.status === 'completed' ? 'bg-green-500 text-white' :
                          enrollment.status === 'in_progress' ? 'bg-blue-500 text-white' :
                          'bg-yellow-500 text-black'
                        }>
                          {enrollment.status === 'completed' && <Award className="w-3 h-3 mr-1" />}
                          {enrollment.status.replace('_', ' ')}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                      {enrollment.status !== 'completed' && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(enrollment.id, Math.min(enrollment.progress + 25, 100))}
                          >
                            Update Progress
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowEnrollments(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedBackground>
  );
};

export default JobsSkills;
