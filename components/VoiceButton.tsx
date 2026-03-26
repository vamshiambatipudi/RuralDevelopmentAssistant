import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking?: boolean;
  onToggleListening: () => void;
  onStopSpeaking?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const VoiceButton = ({
  isListening,
  isSpeaking = false,
  onToggleListening,
  onStopSpeaking,
  disabled = false,
  className = '',
  size = 'icon',
}: VoiceButtonProps) => {
  // If speaking, show stop speaking button
  if (isSpeaking && onStopSpeaking) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={onStopSpeaking}
        disabled={disabled}
        className={cn(
          'rounded-xl bg-primary text-primary-foreground border-primary hover:bg-primary/90 animate-pulse',
          className
        )}
        title="Stop speaking"
      >
        <VolumeX className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={onToggleListening}
      disabled={disabled}
      className={cn(
        'rounded-xl transition-all duration-300',
        isListening 
          ? 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 animate-pulse' 
          : 'bg-white/20 text-white border-white/30 hover:bg-white/30',
        className
      )}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};
