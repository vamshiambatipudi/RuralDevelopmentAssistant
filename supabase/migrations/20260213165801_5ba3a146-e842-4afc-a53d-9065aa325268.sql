
-- Government Schemes table
CREATE TABLE public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'farmers',
  eligibility JSONB NOT NULL DEFAULT '{"criteria":[]}',
  benefits TEXT NOT NULL DEFAULT '',
  application_process TEXT[] NOT NULL DEFAULT '{}',
  documents_required TEXT[] NOT NULL DEFAULT '{}',
  link TEXT NOT NULL DEFAULT '',
  helpline TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

-- Public can read active schemes
CREATE POLICY "Anyone can view active schemes"
ON public.schemes FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage schemes"
ON public.schemes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_schemes_updated_at
BEFORE UPDATE ON public.schemes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  salary TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Full-time',
  category TEXT NOT NULL DEFAULT 'agriculture',
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  apply_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs"
ON public.jobs FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage jobs"
ON public.jobs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trainings table
CREATE TABLE public.trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'agriculture',
  level TEXT NOT NULL DEFAULT 'Beginner',
  free BOOLEAN NOT NULL DEFAULT true,
  description TEXT NOT NULL DEFAULT '',
  syllabus TEXT[] NOT NULL DEFAULT '{}',
  enroll_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active trainings"
ON public.trainings FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage trainings"
ON public.trainings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_trainings_updated_at
BEFORE UPDATE ON public.trainings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
