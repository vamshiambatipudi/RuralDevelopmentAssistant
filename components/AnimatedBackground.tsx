import { useEffect, useState } from 'react';

const backgrounds = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', // Farm field
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80', // Rice paddies
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80', // Wheat field
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&q=80', // Green fields
];

interface AnimatedBackgroundProps {
  variant?: 'auth' | 'dashboard' | 'crop' | 'health' | 'scheme' | 'job' | 'weather';
  children?: React.ReactNode;
}

export const AnimatedBackground = ({ variant = 'auth', children }: AnimatedBackgroundProps) => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    if (variant === 'auth') {
      const interval = setInterval(() => {
        setCurrentBg((prev) => (prev + 1) % backgrounds.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const getOverlayClass = () => {
    switch (variant) {
      case 'crop':
        return 'bg-gradient-to-br from-crop/80 to-primary/80';
      case 'health':
        return 'bg-gradient-to-br from-health/80 to-blue-600/80';
      case 'scheme':
        return 'bg-gradient-to-br from-scheme/80 to-purple-700/80';
      case 'job':
        return 'bg-gradient-to-br from-job/80 to-orange-600/80';
      case 'weather':
        return 'bg-gradient-to-br from-weather/80 to-blue-500/80';
      default:
        return 'bg-gradient-to-br from-primary/70 to-primary/90';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Images */}
      {variant === 'auth' ? (
        backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentBg ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgrounds[0]})` }}
        />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${getOverlayClass()}`} />

      {/* Pattern */}
      <div className="absolute inset-0 bg-pattern-leaves opacity-30" />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};
