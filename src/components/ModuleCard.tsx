import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: string;
  delay?: number;
}

export const ModuleCard = ({ title, description, icon: Icon, path, gradient, delay = 0 }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="group card-module overflow-hidden opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground group-hover:text-white transition-colors duration-300 mb-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground group-hover:text-white/80 transition-colors duration-300 text-sm">
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-primary group-hover:text-white transition-colors duration-300">
          <span className="text-sm font-medium">Explore</span>
          <svg
            className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};
