import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Cloud, Sun, CloudRain, Wind, Droplets, MapPin, RefreshCw, CloudSun, CloudLightning, Loader2, Navigation, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  icon: React.ReactNode;
  tips: string[];
  feelsLike: number;
  description: string;
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: React.ReactNode;
}

const getWeatherIcon = (condition: string, size = 'w-full h-full') => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
    return <CloudLightning className={`${size} text-purple-400`} />;
  }
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return <CloudRain className={`${size} text-blue-400`} />;
  }
  if (lowerCondition.includes('cloud') && lowerCondition.includes('sun')) {
    return <CloudSun className={`${size} text-yellow-300`} />;
  }
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return <Cloud className={`${size} text-gray-400`} />;
  }
  return <Sun className={`${size} text-yellow-400`} />;
};

const getFarmingTips = (weather: { condition: string; temperature: number; humidity: number; rainfall: number }): string[] => {
  const tips: string[] = [];
  const condition = weather.condition.toLowerCase();
  
  if (condition.includes('rain') || weather.rainfall > 50) {
    tips.push('🌧️ Heavy rain expected - avoid pesticide spraying today');
    tips.push('💧 Ensure proper drainage in fields to prevent waterlogging');
    tips.push('🚜 Postpone harvesting if possible to avoid crop damage');
  } else if (condition.includes('sun') || condition.includes('clear')) {
    tips.push('🌾 Good day for harvesting - low humidity expected');
    tips.push('💧 Consider irrigation in the evening hours');
    tips.push('🌱 Ideal conditions for transplanting seedlings');
  } else if (condition.includes('cloud')) {
    tips.push('🌾 Good conditions for field work - moderate temperatures');
    tips.push('💊 Suitable day for pesticide application');
    tips.push('🌱 Consider sowing seeds - soil moisture is optimal');
  }
  
  if (weather.temperature > 35) {
    tips.push('🔥 High temperature alert - ensure cattle have shade and water');
    tips.push('⏰ Avoid field work during peak afternoon hours (12-3 PM)');
  } else if (weather.temperature < 15) {
    tips.push('❄️ Cold conditions - protect sensitive crops with covering');
  }
  
  if (weather.humidity > 80) {
    tips.push('🍄 High humidity - watch for fungal diseases in crops');
  }
  
  return tips.length > 0 ? tips : [
    '🌾 Normal farming conditions today',
    '💧 Regular irrigation schedule recommended',
    '🌱 Good conditions for general field work',
  ];
};

const Weather = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);

  // Mock weather data generator based on location
  const generateWeatherData = useCallback((locationName: string): WeatherData => {
    // Simulate different weather based on location
    const hash = locationName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Thunderstorm'];
    const conditionIndex = hash % conditions.length;
    const condition = conditions[conditionIndex];
    
    const baseTemp = 20 + (hash % 20);
    const humidity = 40 + (hash % 50);
    const windSpeed = 5 + (hash % 25);
    const rainfall = condition.includes('Rain') ? 30 + (hash % 60) : hash % 20;
    
    const weatherData = {
      location: locationName,
      temperature: baseTemp,
      condition,
      humidity,
      windSpeed,
      rainfall,
      icon: getWeatherIcon(condition),
      tips: [],
      feelsLike: baseTemp + (humidity > 70 ? 3 : 0),
      description: `${condition} with ${humidity}% humidity`,
    };
    
    weatherData.tips = getFarmingTips(weatherData);
    
    return weatherData;
  }, []);

  // Generate 7-day forecast
  const generateForecast = useCallback((baseCondition: string): ForecastDay[] => {
    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny', 'Cloudy', 'Partly Cloudy'];
    
    return days.map((day, index) => {
      const condition = index === 0 ? baseCondition : conditions[(index + baseCondition.length) % conditions.length];
      const high = 28 + Math.floor(Math.random() * 10);
      return {
        day,
        high,
        low: high - 6 - Math.floor(Math.random() * 4),
        condition,
        icon: getWeatherIcon(condition),
      };
    });
  }, []);

  // Get user's location using browser geolocation
  const getUserLocation = useCallback(async () => {
    setLocating(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your location manually",
        variant: "destructive",
      });
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding using OpenStreetMap Nominatim (free, no API key)
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const state = data.address.state;
            const locationName = city && state ? `${city}, ${state}` : city || state || 'Your Location';
            
            setLocation(locationName);
            const weatherData = generateWeatherData(locationName);
            setWeather(weatherData);
            setForecast(generateForecast(weatherData.condition));
            
            toast({
              title: "Location detected! 📍",
              description: locationName,
            });
          } else {
            throw new Error('Failed to get location name');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          const fallbackLocation = 'Current Location';
          setLocation(fallbackLocation);
          const weatherData = generateWeatherData(fallbackLocation);
          setWeather(weatherData);
          setForecast(generateForecast(weatherData.condition));
        }
        setLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Could not get your location";
        if (error.code === 1) errorMessage = "Location access denied. Please enable location or enter manually.";
        else if (error.code === 2) errorMessage = "Location unavailable. Please enter manually.";
        else if (error.code === 3) errorMessage = "Location request timed out. Please try again.";
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [generateWeatherData, generateForecast, toast]);

  // Auto-detect location on mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const refreshWeather = () => {
    if (!location.trim()) {
      toast({
        title: "Enter Location",
        description: "Please enter a location or use auto-detect",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const weatherData = generateWeatherData(location);
      setWeather(weatherData);
      setForecast(generateForecast(weatherData.condition));
      setLoading(false);
      
      toast({
        title: "Weather Updated! 🌤️",
        description: `Showing weather for ${location}`,
      });
    }, 1000);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refreshWeather();
  };

  return (
    <AnimatedBackground variant="weather">
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
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
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Weather Forecast</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Location Search */}
          <form onSubmit={handleLocationSubmit} className="glass-card rounded-2xl p-4 mb-6 animate-fade-in">
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={getUserLocation}
                disabled={locating}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                {locating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
              </Button>
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location or use auto-detect..."
                  className="pl-12 input-rural"
                />
              </div>
              <Button
                type="submit"
                className="bg-weather hover:bg-weather/90 text-white px-6"
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </Button>
            </div>
          </form>

          {weather ? (
            <>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Current Weather */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 animate-float">
                      {weather.icon}
                    </div>
                    <div className="text-center md:text-left">
                      <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground">{weather.location}</span>
                      </div>
                      <div className="text-6xl font-bold text-foreground mb-2">
                        {weather.temperature}°C
                      </div>
                      <div className="text-xl text-muted-foreground">{weather.condition}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Feels like {weather.feelsLike}°C
                      </div>
                    </div>
                  </div>

                  {/* Weather Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{weather.humidity}%</div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{weather.windSpeed} km/h</div>
                      <div className="text-sm text-muted-foreground">Wind Speed</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <CloudRain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{weather.rainfall}%</div>
                      <div className="text-sm text-muted-foreground">Rain Chance</div>
                    </div>
                  </div>
                </div>

                {/* Farming Tips */}
                <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌾</span> Farming Tips for Today
                  </h3>
                  <div className="space-y-3">
                    {weather.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="bg-muted/50 rounded-xl p-3 text-sm text-foreground"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div className="glass-card rounded-2xl p-6 mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <h3 className="text-lg font-semibold text-foreground mb-4">7-Day Forecast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {forecast.map((day, index) => (
                    <div
                      key={day.day}
                      className={`text-center p-4 rounded-xl ${
                        index === 0 ? 'bg-weather/20' : 'bg-muted/50'
                      } hover:bg-weather/30 transition-colors`}
                    >
                      <div className="font-medium text-foreground mb-2">{day.day}</div>
                      <div className="w-12 h-12 mx-auto mb-2">
                        {day.icon}
                      </div>
                      <div className="text-sm text-muted-foreground">{day.condition}</div>
                      <div className="mt-2">
                        <span className="font-semibold text-foreground">{day.high}°</span>
                        <span className="text-muted-foreground"> / {day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Alert */}
              {(weather.rainfall > 50 || weather.temperature > 40 || weather.condition.toLowerCase().includes('storm')) && (
                <div className="glass-card rounded-2xl p-6 mt-6 bg-yellow-500/20 border border-yellow-500/30 animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Weather Advisory</h4>
                      <p className="text-muted-foreground">
                        {weather.rainfall > 50 
                          ? 'Heavy rainfall expected. Consider harvesting standing crops and ensure proper drainage in fields to prevent waterlogging.'
                          : weather.temperature > 40
                          ? 'Extreme heat warning. Avoid field work during peak hours. Ensure adequate water for cattle and crops.'
                          : 'Thunderstorm alert. Secure loose items and avoid working in open fields during the storm.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                {locating ? (
                  <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                ) : (
                  <Cloud className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {locating ? 'Detecting Your Location...' : 'Enter Your Location'}
              </h3>
              <p className="text-muted-foreground">
                {locating 
                  ? 'Please allow location access when prompted'
                  : 'Use the auto-detect button or enter your location manually to see weather forecast'}
              </p>
            </div>
          )}
        </main>
      </div>
    </AnimatedBackground>
  );
};

export default Weather;
