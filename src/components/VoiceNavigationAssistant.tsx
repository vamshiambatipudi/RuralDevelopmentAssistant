import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, VolumeX, HelpCircle, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSpeech, SupportedLanguage as SpeechLanguage } from '@/hooks/useSpeech';
import { processVoiceCommand, getWelcomeMessage, getHelpMessage, SupportedLanguage as NavLanguage } from '@/lib/voiceNavigationEngine';
import { cn } from '@/lib/utils';

interface VoiceNavigationAssistantProps {
  className?: string;
  variant?: 'button' | 'full';
}

// Use navigation language type for this component
type AssistantLanguage = 'en-IN' | 'hi-IN' | 'te-IN';

const LANGUAGE_OPTIONS: { code: AssistantLanguage; name: string; nativeName: string }[] = [
  { code: 'en-IN', name: 'English', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
];

export function VoiceNavigationAssistant({ className, variant = 'button' }: VoiceNavigationAssistantProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<AssistantLanguage>('en-IN');
  
  const handleResult = useCallback((transcript: string) => {
    // Add user message
    setMessages(prev => [...prev, { text: transcript, isUser: true }]);
    
    // Process command - cast to NavLanguage which is compatible
    const result = processVoiceCommand(transcript, selectedLanguage as NavLanguage);
    
    // Add assistant response
    setMessages(prev => [...prev, { text: result.message, isUser: false }]);
    
    // Speak the response
    speak(result.message);
    
    // Navigate if needed
    if (result.type === 'navigate' && result.route) {
      setTimeout(() => {
        setIsOpen(false);
        navigate(result.route!);
      }, 1500);
    }
  }, [selectedLanguage, navigate]);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSpeaking,
    speak,
    stopSpeaking,
    setLanguage,
    isSupported
  } = useSpeech({
    language: selectedLanguage as SpeechLanguage,
    onResult: handleResult
  });
  
  // Update language in speech hook when selection changes
  useEffect(() => {
    setLanguage(selectedLanguage as SpeechLanguage);
  }, [selectedLanguage, setLanguage]);
  
  // Welcome message when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = getWelcomeMessage(selectedLanguage as NavLanguage);
      setMessages([{ text: welcome, isUser: false }]);
      speak(welcome);
    }
  }, [isOpen, selectedLanguage, speak, messages.length]);
  
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleShowHelp = () => {
    const helpMsg = getHelpMessage(selectedLanguage as NavLanguage);
    setMessages(prev => [...prev, { text: helpMsg, isUser: false }]);
    speak(helpMsg);
  };
  
  const handleClose = () => {
    stopListening();
    stopSpeaking();
    setIsOpen(false);
    setMessages([]);
  };
  
  const handleLanguageChange = (lang: string) => {
    const newLang = lang as AssistantLanguage;
    setSelectedLanguage(newLang);
    setMessages([]);
    
    // Speak welcome in new language after a brief delay
    setTimeout(() => {
      const welcome = getWelcomeMessage(newLang as NavLanguage);
      setMessages([{ text: welcome, isUser: false }]);
      speak(welcome);
    }, 100);
  };
  
  if (variant === 'button') {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className={cn("gap-2", className)}
          variant="secondary"
        >
          <Mic className="w-4 h-4" />
          Try Voice Assistant
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Voice Navigation Assistant
              </DialogTitle>
            </DialogHeader>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm text-muted-foreground">Language:</span>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[300px] p-2 bg-muted/30 rounded-lg">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-3 rounded-lg max-w-[85%] whitespace-pre-line",
                    msg.isUser 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {msg.text}
                </div>
              ))}
              
              {/* Live transcript */}
              {isListening && transcript && (
                <div className="p-3 rounded-lg bg-blue-100 text-blue-800 ml-auto max-w-[85%] animate-pulse">
                  {transcript}...
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowHelp}
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Help
              </Button>
              
              <div className="flex gap-2">
                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={stopSpeaking}
                    className="animate-pulse"
                  >
                    <VolumeX className="w-5 h-5" />
                  </Button>
                )}
                
                <Button
                  size="lg"
                  onClick={handleToggleListening}
                  disabled={!isSupported}
                  className={cn(
                    "rounded-full w-14 h-14",
                    isListening 
                      ? "bg-destructive hover:bg-destructive/90 animate-pulse" 
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {isListening ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <X className="w-4 h-4 mr-1" />
                Close
              </Button>
            </div>
            
            {!isSupported && (
              <p className="text-xs text-destructive text-center">
                Voice recognition not supported in this browser
              </p>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // Full variant - inline component
  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-4xl">🤝</span>
        </div>
        <div className="text-center md:text-left flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Need Help Using This App?
          </h3>
          <p className="text-muted-foreground mb-4">
            Our AI assistant supports voice commands in Hindi, Telugu, and English.
            Just speak to navigate to any section!
          </p>
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => setIsOpen(true)}
            >
              <Mic className="w-4 h-4 mr-2" />
              Try Voice Assistant
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dialog for full variant */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Voice Navigation Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-2 py-2">
            <span className="text-sm text-muted-foreground">Language:</span>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[300px] p-2 bg-muted/30 rounded-lg">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg max-w-[85%] whitespace-pre-line",
                  msg.isUser 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {msg.text}
              </div>
            ))}
            
            {isListening && transcript && (
              <div className="p-3 rounded-lg bg-blue-100 text-blue-800 ml-auto max-w-[85%] animate-pulse">
                {transcript}...
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" size="sm" onClick={handleShowHelp}>
              <HelpCircle className="w-4 h-4 mr-1" />
              Help
            </Button>
            
            <div className="flex gap-2">
              {isSpeaking && (
                <Button variant="outline" size="icon" onClick={stopSpeaking} className="animate-pulse">
                  <VolumeX className="w-5 h-5" />
                </Button>
              )}
              
              <Button
                size="lg"
                onClick={handleToggleListening}
                disabled={!isSupported}
                className={cn(
                  "rounded-full w-14 h-14",
                  isListening 
                    ? "bg-destructive hover:bg-destructive/90 animate-pulse" 
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
