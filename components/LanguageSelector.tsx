import { Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS, SupportedLanguage } from '@/hooks/useSpeech';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (value: SupportedLanguage) => void;
  className?: string;
  compact?: boolean;
}

export const LanguageSelector = ({ 
  value, 
  onChange, 
  className = '',
  compact = false 
}: LanguageSelectorProps) => {
  const selectedLang = LANGUAGE_OPTIONS.find(l => l.code === value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SupportedLanguage)}>
      <SelectTrigger 
        className={`${compact ? 'w-auto gap-2' : 'w-full'} bg-white/20 border-white/30 text-white hover:bg-white/30 ${className}`}
      >
        <Globe className="w-4 h-4" />
        <SelectValue>
          {compact ? selectedLang?.nativeName : `${selectedLang?.nativeName} (${selectedLang?.name})`}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white/95 backdrop-blur-lg border-white/20">
        {LANGUAGE_OPTIONS.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="cursor-pointer hover:bg-primary/10"
          >
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-muted-foreground ml-2">({lang.name})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
