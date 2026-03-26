
-- Health topics table for telemedicine content management
CREATE TABLE public.health_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symptom_key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en-IN',
  home_remedies TEXT[] NOT NULL DEFAULT '{}',
  medicines TEXT[] NOT NULL DEFAULT '{}',
  warnings TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symptom_key, language)
);

ALTER TABLE public.health_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active health topics"
ON public.health_topics FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage health topics"
ON public.health_topics FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_health_topics_updated_at
BEFORE UPDATE ON public.health_topics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crop profiles table for ML model management
CREATE TABLE public.crop_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🌾',
  optimal_soil_types TEXT[] NOT NULL DEFAULT '{}',
  rainfall_range_min INTEGER NOT NULL DEFAULT 500,
  rainfall_range_max INTEGER NOT NULL DEFAULT 1500,
  temp_range_min INTEGER NOT NULL DEFAULT 15,
  temp_range_max INTEGER NOT NULL DEFAULT 35,
  seasons TEXT[] NOT NULL DEFAULT '{}',
  irrigation_types TEXT[] NOT NULL DEFAULT '{}',
  yield_per_acre NUMERIC NOT NULL DEFAULT 0,
  price_per_quintal NUMERIC NOT NULL DEFAULT 0,
  cost_per_acre NUMERIC NOT NULL DEFAULT 0,
  market_demand TEXT NOT NULL DEFAULT 'Medium',
  fertilizer_summary TEXT NOT NULL DEFAULT '',
  fertilizer_details TEXT[] NOT NULL DEFAULT '{}',
  tips TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active crop profiles"
ON public.crop_profiles FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage crop profiles"
ON public.crop_profiles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_crop_profiles_updated_at
BEFORE UPDATE ON public.crop_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Weather config table for weather module settings
CREATE TABLE public.weather_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.weather_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weather config"
ON public.weather_config FOR SELECT
USING (true);

CREATE POLICY "Admins can manage weather config"
ON public.weather_config FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_weather_config_updated_at
BEFORE UPDATE ON public.weather_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
