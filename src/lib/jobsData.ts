// Jobs and Training Data with Application Management

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  posted: string;
  description: string;
  requirements: string[];
  eligibility: string[];
  applyLink?: string;
}

export interface Training {
  id: string;
  title: string;
  provider: string;
  duration: string;
  category: string;
  level: string;
  free: boolean;
  description: string;
  syllabus: string[];
  enrollLink?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: Date;
  status: 'applied' | 'under_review' | 'shortlisted' | 'rejected';
  resumeName?: string;
  notes?: string;
}

export interface Enrollment {
  id: string;
  trainingId: string;
  trainingTitle: string;
  provider: string;
  enrolledAt: Date;
  status: 'enrolled' | 'in_progress' | 'completed';
  progress: number;
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Farm Manager',
    company: 'Krishi Vikas Trust',
    location: 'Varanasi, UP',
    salary: '₹15,000 - ₹25,000/month',
    type: 'Full-time',
    category: 'agriculture',
    posted: '2 days ago',
    description: 'Manage daily farm operations, supervise workers, and ensure crop health. Responsible for planning crop cycles and managing resources efficiently.',
    requirements: ['2+ years farming experience', 'Knowledge of crop cycles', 'Team management skills'],
    eligibility: ['Age: 21-45 years', 'Education: 10th pass or higher', 'Must have farming background', 'Valid ID proof required'],
    applyLink: 'https://krishi.gov.in/jobs',
  },
  {
    id: '2',
    title: 'Agricultural Field Officer',
    company: 'State Agriculture Dept.',
    location: 'Lucknow, UP',
    salary: '₹35,000/month',
    type: 'Government',
    category: 'agriculture',
    posted: '1 week ago',
    description: 'Assist farmers with modern techniques and government scheme implementation. Conduct field visits and training programs.',
    requirements: ['B.Sc Agriculture', 'Valid driving license', 'Fluent in Hindi'],
    eligibility: ['Age: 21-35 years', 'Education: B.Sc Agriculture', 'State domicile required', 'No criminal record'],
    applyLink: 'https://upagripardarshi.gov.in',
  },
  {
    id: '3',
    title: 'Handicraft Artisan',
    company: 'Rural Craft Co-op',
    location: 'Jaipur, Rajasthan',
    salary: '₹12,000 - ₹18,000/month',
    type: 'Full-time',
    category: 'handicraft',
    posted: '3 days ago',
    description: 'Create traditional handicraft items for export and domestic markets. Work with local artisan groups.',
    requirements: ['Handicraft skills', 'Creative mindset', 'Quality consciousness'],
    eligibility: ['Age: 18-50 years', 'Must have handicraft skills', 'Training certificate preferred', 'Women candidates encouraged'],
    applyLink: 'https://handicrafts.nic.in',
  },
  {
    id: '4',
    title: 'Computer Operator',
    company: 'CSC Village Center',
    location: 'Multiple Locations',
    salary: '₹10,000 - ₹15,000/month',
    type: 'Part-time',
    category: 'digital',
    posted: '1 day ago',
    description: 'Operate CSC center, help villagers access digital services including Aadhaar, PAN, and government schemes.',
    requirements: ['Basic computer skills', 'Internet knowledge', 'Good communication'],
    eligibility: ['Age: 18-40 years', 'Education: 12th pass', 'Computer certification required', 'Local resident preferred'],
    applyLink: 'https://csc.gov.in/register',
  },
  {
    id: '5',
    title: 'Dairy Farm Assistant',
    company: 'Amul Cooperative',
    location: 'Anand, Gujarat',
    salary: '₹18,000/month',
    type: 'Full-time',
    category: 'agriculture',
    posted: '5 days ago',
    description: 'Assist in daily dairy operations, cattle care, and milk collection. Maintain hygiene standards.',
    requirements: ['Experience with cattle', 'Early morning availability', 'Physical fitness'],
    eligibility: ['Age: 18-40 years', 'Experience with dairy farming', 'Must be available for early morning shifts', 'Health certificate required'],
    applyLink: 'https://amul.com/careers',
  },
  {
    id: '6',
    title: 'Weaving Trainer',
    company: 'Khadi Board',
    location: 'Chennai, TN',
    salary: '₹20,000/month',
    type: 'Contract',
    category: 'handicraft',
    posted: '1 week ago',
    description: 'Train rural women in traditional weaving techniques. Develop training curriculum and conduct workshops.',
    requirements: ['Master weaver certificate', '5+ years experience', 'Teaching ability'],
    eligibility: ['Age: 25-55 years', 'Master weaver certification', 'Teaching experience preferred', 'Fluency in local language'],
    applyLink: 'https://kvic.gov.in',
  },
  {
    id: '7',
    title: 'Solar Panel Technician',
    company: 'MNRE Project',
    location: 'Rajasthan',
    salary: '₹22,000/month',
    type: 'Full-time',
    category: 'digital',
    posted: '4 days ago',
    description: 'Install and maintain solar panels in rural areas under PM-KUSUM scheme. Provide technical support to farmers.',
    requirements: ['ITI Electrical', 'Solar training certificate', 'Willingness to travel'],
    eligibility: ['Age: 18-35 years', 'ITI Electrical diploma', 'Solar installation training', 'Valid driving license'],
    applyLink: 'https://mnre.gov.in/pm-kusum',
  },
];

export const trainings: Training[] = [
  {
    id: '1',
    title: 'Modern Farming Techniques',
    provider: 'ICAR Training Center',
    duration: '3 months',
    category: 'agriculture',
    level: 'Beginner',
    free: true,
    description: 'Learn modern farming methods, soil management, and pest control. Get hands-on experience in demonstration farms.',
    syllabus: ['Soil health and testing', 'Crop rotation techniques', 'Integrated pest management', 'Water conservation methods', 'Organic farming basics'],
    enrollLink: 'https://icar.org.in/training',
  },
  {
    id: '2',
    title: 'Organic Farming Certification',
    provider: 'National Centre of Organic Farming',
    duration: '6 weeks',
    category: 'agriculture',
    level: 'Intermediate',
    free: true,
    description: 'Get certified in organic farming practices and standards. Learn to convert conventional farms to organic.',
    syllabus: ['Organic certification process', 'Natural fertilizer preparation', 'Pest control without chemicals', 'Record keeping for certification', 'Marketing organic produce'],
    enrollLink: 'https://ncof.dacnet.nic.in',
  },
  {
    id: '3',
    title: 'Traditional Handicraft Making',
    provider: 'State Handicraft Board',
    duration: '2 months',
    category: 'handicraft',
    level: 'Beginner',
    free: true,
    description: 'Master traditional crafts like pottery, weaving, and embroidery. Get connected with markets for selling.',
    syllabus: ['Traditional design patterns', 'Material selection', 'Quality standards', 'Packaging and presentation', 'Online selling basics'],
    enrollLink: 'https://handicrafts.nic.in/training',
  },
  {
    id: '4',
    title: 'Basic Computer Skills',
    provider: 'PMGDISHA',
    duration: '20 hours',
    category: 'digital',
    level: 'Beginner',
    free: true,
    description: 'Learn computer basics, internet usage, and digital payments. Get government-certified digital literacy.',
    syllabus: ['Computer basics', 'Internet browsing', 'Email and messaging', 'Digital payments (UPI)', 'Government portals usage'],
    enrollLink: 'https://pmgdisha.in',
  },
  {
    id: '5',
    title: 'Mobile Repair Course',
    provider: 'NSDC Skill Center',
    duration: '45 days',
    category: 'digital',
    level: 'Beginner',
    free: false,
    description: 'Learn mobile phone repair and start your own business. Includes software and hardware troubleshooting.',
    syllabus: ['Mobile hardware components', 'Software troubleshooting', 'Screen replacement', 'Battery and charging issues', 'Business setup guidance'],
    enrollLink: 'https://nsdcindia.org',
  },
  {
    id: '6',
    title: 'Tractor Operation & Maintenance',
    provider: 'Farmer Training Institute',
    duration: '2 weeks',
    category: 'agriculture',
    level: 'Beginner',
    free: true,
    description: 'Learn safe tractor operation and basic maintenance. Get driving license assistance.',
    syllabus: ['Tractor controls and operation', 'Daily maintenance routine', 'Common problem diagnosis', 'Safety protocols', 'Attachment usage'],
    enrollLink: 'https://farmer.gov.in/training',
  },
  {
    id: '7',
    title: 'Beekeeping Training',
    provider: 'National Bee Board',
    duration: '1 week',
    category: 'agriculture',
    level: 'Beginner',
    free: true,
    description: 'Start beekeeping as additional income source with honey production. Learn hive management and honey extraction.',
    syllabus: ['Bee biology and behavior', 'Hive setup and management', 'Disease prevention', 'Honey extraction and storage', 'Marketing honey products'],
    enrollLink: 'https://nbb.gov.in',
  },
];

// Local storage keys
const APPLICATIONS_KEY = 'rda_job_applications';
const ENROLLMENTS_KEY = 'rda_training_enrollments';

// Get all applications from localStorage
export function getApplications(): Application[] {
  const stored = localStorage.getItem(APPLICATIONS_KEY);
  if (!stored) return [];
  try {
    const apps = JSON.parse(stored);
    return apps.map((app: Application) => ({
      ...app,
      appliedAt: new Date(app.appliedAt),
    }));
  } catch {
    return [];
  }
}

// Save application with optional resume and notes
export function saveApplication(job: Job, resumeName?: string, notes?: string): Application {
  const applications = getApplications();
  
  const existing = applications.find(a => a.jobId === job.id);
  if (existing) return existing;
  
  const newApp: Application = {
    id: Date.now().toString(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    appliedAt: new Date(),
    status: 'applied',
    resumeName,
    notes,
  };
  
  applications.push(newApp);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  
  return newApp;
}

// Update application
export function updateApplication(applicationId: string, updates: Partial<Application>): boolean {
  const applications = getApplications();
  const app = applications.find(a => a.id === applicationId);
  
  if (app) {
    Object.assign(app, updates);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    return true;
  }
  return false;
}

// Delete application
export function deleteApplication(applicationId: string): boolean {
  const applications = getApplications();
  const filtered = applications.filter(a => a.id !== applicationId);
  
  if (filtered.length !== applications.length) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

// Update application status
export function updateApplicationStatus(applicationId: string, status: Application['status']): boolean {
  const applications = getApplications();
  const app = applications.find(a => a.id === applicationId);
  
  if (app) {
    app.status = status;
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    return true;
  }
  return false;
}

// Check if user has applied to a job
export function hasApplied(jobId: string): boolean {
  const applications = getApplications();
  return applications.some(a => a.jobId === jobId);
}

// Get application status for a job
export function getApplicationStatus(jobId: string): Application | undefined {
  const applications = getApplications();
  return applications.find(a => a.jobId === jobId);
}

// Get all enrollments
export function getEnrollments(): Enrollment[] {
  const stored = localStorage.getItem(ENROLLMENTS_KEY);
  if (!stored) return [];
  try {
    const enrollments = JSON.parse(stored);
    return enrollments.map((e: Enrollment) => ({
      ...e,
      enrolledAt: new Date(e.enrolledAt),
    }));
  } catch {
    return [];
  }
}

// Save enrollment
export function saveEnrollment(training: Training): Enrollment {
  const enrollments = getEnrollments();
  
  const existing = enrollments.find(e => e.trainingId === training.id);
  if (existing) return existing;
  
  const newEnrollment: Enrollment = {
    id: Date.now().toString(),
    trainingId: training.id,
    trainingTitle: training.title,
    provider: training.provider,
    enrolledAt: new Date(),
    status: 'enrolled',
    progress: 0,
  };
  
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  
  return newEnrollment;
}

// Delete enrollment
export function deleteEnrollment(enrollmentId: string): boolean {
  const enrollments = getEnrollments();
  const filtered = enrollments.filter(e => e.id !== enrollmentId);
  
  if (filtered.length !== enrollments.length) {
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

// Check if user has enrolled in a training
export function hasEnrolled(trainingId: string): boolean {
  const enrollments = getEnrollments();
  return enrollments.some(e => e.trainingId === trainingId);
}

// Get enrollment for a training
export function getEnrollmentStatus(trainingId: string): Enrollment | undefined {
  const enrollments = getEnrollments();
  return enrollments.find(e => e.trainingId === trainingId);
}

// Update enrollment progress
export function updateEnrollmentProgress(enrollmentId: string, progress: number, status?: Enrollment['status']): boolean {
  const enrollments = getEnrollments();
  const enrollment = enrollments.find(e => e.id === enrollmentId);
  
  if (enrollment) {
    enrollment.progress = progress;
    if (status) enrollment.status = status;
    if (progress >= 100) enrollment.status = 'completed';
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return true;
  }
  return false;
}
