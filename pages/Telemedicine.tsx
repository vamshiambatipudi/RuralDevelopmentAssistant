import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Stethoscope, Send, AlertTriangle, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceButton } from '@/components/VoiceButton';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useSpeech, SupportedLanguage } from '@/hooks/useSpeech';
import { useToast } from '@/hooks/use-toast';
import { detectSymptom, formatMedicalResponse, getUIText } from '@/lib/multilingualMedicalResponses';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const getGreeting = (language: SupportedLanguage): string => {
  const greetings: Record<SupportedLanguage, string> = {
    'en-IN': `Hello! I'm your AI Health Assistant. 👋

I can help you with:
• Basic symptom assessment
• Home remedies and first-aid tips
• General health guidance

**Disclaimer:** This is not a substitute for professional medical advice. For emergencies, please contact your nearest hospital or call 108.

How can I help you today? You can type or use voice input.`,
    'hi-IN': `नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। 👋

मैं इनमें आपकी मदद कर सकता हूं:
• बुनियादी लक्षण मूल्यांकन
• घरेलू उपचार और प्राथमिक चिकित्सा
• सामान्य स्वास्थ्य मार्गदर्शन

**अस्वीकरण:** यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। आपातकाल के लिए 108 पर कॉल करें।

आज मैं आपकी कैसे मदद कर सकता हूं? आप टाइप कर सकते हैं या आवाज़ का उपयोग कर सकते हैं।`,
    'ta-IN': `வணக்கம்! நான் உங்கள் AI சுகாதார உதவியாளர். 👋

நான் உங்களுக்கு உதவ முடியும்:
• அடிப்படை அறிகுறி மதிப்பீடு
• வீட்டு வைத்தியம் மற்றும் முதலுதவி
• பொது சுகாதார வழிகாட்டுதல்

**மறுப்பு:** இது தொழில்முறை மருத்துவ ஆலோசனைக்கு மாற்றாக இல்லை। அவசரநிலைக்கு 108 அழைக்கவும்.

இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? நீங்கள் தட்டச்சு செய்யலாம் அல்லது குரல் உள்ளீடு பயன்படுத்தலாம்.`,
    'te-IN': `నమస్కారం! నేను మీ AI ఆరోగ్య సహాయకుడిని. 👋

నేను మీకు సహాయం చేయగలను:
• ప్రాథమిక లక్షణ అంచనా
• ఇంటి నివారణలు మరియు ప్రథమ చికిత్స
• సాధారణ ఆరోగ్య మార్గదర్శకత్వం

**నిరాకరణ:** ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు। అత్యవసర పరిస్థితుల్లో 108కు కాల్ చేయండి.

ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను? మీరు టైప్ చేయవచ్చు లేదా వాయిస్ ఇన్‌పుట్ ఉపయోగించవచ్చు.`,
    'bn-IN': `নমস্কার! আমি আপনার AI স্বাস্থ্য সহকারী। 👋

আমি আপনাকে সাহায্য করতে পারি:
• মৌলিক উপসর্গ মূল্যায়ন
• ঘরোয়া প্রতিকার এবং প্রাথমিক চিকিৎসা
• সাধারণ স্বাস্থ্য নির্দেশনা

**দাবিত্যাগ:** এটি পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়। জরুরি অবস্থায় 108-এ কল করুন।

আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?`,
    'mr-IN': `नमस्कार! मी तुमचा AI आरोग्य सहाय्यक आहे। 👋

मी तुम्हाला मदत करू शकतो:
• मूलभूत लक्षणे मूल्यांकन
• घरगुती उपाय आणि प्रथमोपचार
• सामान्य आरोग्य मार्गदर्शन

**अस्वीकरण:** हे व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही। आपत्कालीन परिस्थितीत 108 वर कॉल करा.

आज मी तुम्हाला कशी मदत करू शकतो?`,
    'gu-IN': `નમસ્તે! હું તમારો AI સ્વાસ્થ્ય સહાયક છું। 👋

હું તમને મદદ કરી શકું છું:
• મૂળભૂત લક્ષણોનું મૂલ્યાંકન
• ઘરેલું ઉપચાર અને પ્રાથમિક સારવાર
• સામાન્ય સ્વાસ્થ્ય માર્ગદર્શન

**અસ્વીકરણ:** આ વ્યાવસાયિક તબીબી સલાહનો વિકલ્પ નથી। કટોકટીમાં 108 પર કૉલ કરો.

આજે હું તમને કેવી રીતે મદદ કરી શકું?`,
    'kn-IN': `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. 👋

ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:
• ಮೂಲ ರೋಗಲಕ್ಷಣ ಮೌಲ್ಯಮಾಪನ
• ಮನೆ ಮದ್ದು ಮತ್ತು ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ
• ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ

**ಹಕ್ಕುತ್ಯಾಗ:** ಇದು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 108 ಕರೆ ಮಾಡಿ.

ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
    'ml-IN': `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI ആരോഗ്യ സഹായിയാണ്. 👋

എനിക്ക് നിങ്ങളെ സഹായിക്കാം:
• അടിസ്ഥാന ലക്ഷണ വിലയിരുത്തൽ
• വീട്ടുവൈദ്യവും പ്രഥമശുശ്രൂഷയും
• പൊതു ആരോഗ്യ മാർഗ്ഗനിർദ്ദേശം

**നിരാകരണം:** ഇത് പ്രൊഫഷണൽ മെഡിക്കൽ ഉപദേശത്തിന് പകരമല്ല. അടിയന്തിര സാഹചര്യത്തിൽ 108-ൽ വിളിക്കുക.

ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?`,
    'pa-IN': `ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। 👋

ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:
• ਮੁੱਢਲੇ ਲੱਛਣਾਂ ਦਾ ਮੁਲਾਂਕਣ
• ਘਰੇਲੂ ਇਲਾਜ ਅਤੇ ਪ੍ਰਾਥਮਿਕ ਸਹਾਇਤਾ
• ਆਮ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ

**ਬੇਦਾਅਵਾ:** ਇਹ ਪੇਸ਼ੇਵਰ ਮੈਡੀਕਲ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ। ਐਮਰਜੈਂਸੀ ਵਿੱਚ 108 'ਤੇ ਕਾਲ ਕਰੋ.

ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`,
  };
  return greetings[language] || greetings['en-IN'];
};

const getDefaultResponse = (language: SupportedLanguage): string => {
  const responses: Record<SupportedLanguage, string> = {
    'en-IN': `I understand you're not feeling well. Could you please describe your symptoms more specifically? 

For example:
• What symptoms are you experiencing? (fever, headache, cold, stomach pain, etc.)
• How long have you had these symptoms?
• Is there any pain? Where?

This will help me provide better guidance.`,
    'hi-IN': `मैं समझता हूं कि आप अच्छा महसूस नहीं कर रहे। क्या आप अपने लक्षणों को और विस्तार से बता सकते हैं?

उदाहरण के लिए:
• आपको कौन से लक्षण हैं? (बुखार, सिरदर्द, सर्दी, पेट दर्द, आदि)
• ये लक्षण कितने समय से हैं?
• क्या कहीं दर्द है? कहाँ?

इससे मुझे बेहतर मार्गदर्शन देने में मदद मिलेगी।`,
    'te-IN': `మీకు బాగా లేదని నేను అర్థం చేసుకుంటున్నాను. దయచేసి మీ లక్షణాలను మరింత వివరంగా చెప్పగలరా?

ఉదాహరణకు:
• మీకు ఏ లక్షణాలు ఉన్నాయి? (జ్వరం, తలనొప్పి, జలుబు, పొట్ట నొప్పి, మొదలైనవి)
• ఈ లక్షణాలు ఎంత కాలంగా ఉన్నాయి?
• ఎక్కడైనా నొప్పి ఉందా? ఎక్కడ?

ఇది మెరుగైన మార్గదర్శకత్వం అందించడంలో నాకు సహాయపడుతుంది.`,
    'ta-IN': `நீங்கள் நன்றாக உணரவில்லை என்பதை புரிந்துகொள்கிறேன். உங்கள் அறிகுறிகளை இன்னும் விரிவாக விவரிக்க முடியுமா?

உதாரணமாக:
• உங்களுக்கு என்ன அறிகுறிகள் உள்ளன? (காய்ச்சல், தலைவலி, சளி, வயிற்று வலி, போன்றவை)
• இந்த அறிகுறிகள் எவ்வளவு காலமாக உள்ளன?
• எங்காவது வலி இருக்கிறதா? எங்கே?

இது சிறந்த வழிகாட்டுதலை வழங்க எனக்கு உதவும்.`,
    'bn-IN': `আমি বুঝতে পারছি আপনি ভালো অনুভব করছেন না। আপনি কি আপনার লক্ষণগুলি আরও বিস্তারিতভাবে বলতে পারবেন?`,
    'mr-IN': `मला समजते की तुम्हाला बरे वाटत नाही। तुम्ही तुमच्या लक्षणांचे अधिक तपशीलवार वर्णन करू शकता का?`,
    'gu-IN': `મને સમજાય છે કે તમે સારું અનુભવતા નથી. શું તમે તમારા લક્ષણો વધુ વિગતવાર જણાવી શકો છો?`,
    'kn-IN': `ನಿಮಗೆ ಚೆನ್ನಾಗಿಲ್ಲ ಎಂದು ನನಗೆ ಅರ್ಥವಾಗುತ್ತದೆ. ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಹೆಚ್ಚು ವಿವರವಾಗಿ ವಿವರಿಸಬಹುದೇ?`,
    'ml-IN': `നിങ്ങൾക്ക് സുഖമില്ലെന്ന് എനിക്ക് മനസ്സിലാകുന്നു. നിങ്ങളുടെ ലക്ഷണങ്ങൾ കൂടുതൽ വിശദമായി വിവരിക്കാമോ?`,
    'pa-IN': `ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕਿ ਤੁਸੀਂ ਠੀਕ ਮਹਿਸੂਸ ਨਹੀਂ ਕਰ ਰਹੇ। ਕੀ ਤੁਸੀਂ ਆਪਣੇ ਲੱਛਣਾਂ ਨੂੰ ਹੋਰ ਵਿਸਥਾਰ ਨਾਲ ਦੱਸ ਸਕਦੇ ਹੋ?`,
  };
  return responses[language] || responses['en-IN'];
};

const Telemedicine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSpeechResult = useCallback((transcript: string) => {
    setInput(transcript);
  }, []);

  const handleSpeechError = useCallback((error: string) => {
    toast({
      variant: 'destructive',
      title: 'Voice Input Error',
      description: error,
    });
  }, [toast]);

  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    language,
    setLanguage,
    isSupported,
    isTTSSupported,
  } = useSpeech({
    language: 'hi-IN',
    onResult: handleSpeechResult,
    onError: handleSpeechError,
  });

  // Initialize with greeting based on language
  useEffect(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: getGreeting(language),
        timestamp: new Date(),
      },
    ]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');

    // Process response in the selected language
    setTimeout(() => {
      const symptom = detectSymptom(userInput);
      let response: string;
      
      if (symptom === 'default') {
        response = getDefaultResponse(language);
      } else {
        response = formatMedicalResponse(symptom, language);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  }, [input, language]);

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const handleSpeakMessage = useCallback((text: string) => {
    // Clean up markdown formatting for speech
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .replace(/⚠️/g, 'Warning:')
      .replace(/👋/g, '')
      .replace(/_/g, '');
    speak(cleanText);
  }, [speak]);

  const languageNames: Record<SupportedLanguage, string> = {
    'en-IN': 'English',
    'hi-IN': 'हिन्दी',
    'ta-IN': 'தமிழ்',
    'te-IN': 'తెలుగు',
    'bn-IN': 'বাংলা',
    'mr-IN': 'मराठी',
    'gu-IN': 'ગુજરાતી',
    'kn-IN': 'ಕನ್ನಡ',
    'ml-IN': 'മലയാളം',
    'pa-IN': 'ਪੰਜਾਬੀ',
  };

  const selectedLangName = languageNames[language] || 'English';

  return (
    <AnimatedBackground variant="health">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
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
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Telemedicine Support</h1>
                    <p className="text-sm text-white/70">AI Health Assistant</p>
                  </div>
                </div>
              </div>
              
              {/* Language Selector */}
              <div className="hidden sm:block w-48">
                <LanguageSelector 
                  value={language} 
                  onChange={setLanguage}
                  compact
                />
              </div>
            </div>
          </div>
        </header>

        {/* Disclaimer Banner */}
        <div className="bg-yellow-500/90 text-yellow-900 py-2 px-4">
          <div className="container mx-auto flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              {language === 'hi-IN' 
                ? 'यह AI केवल सामान्य स्वास्थ्य जानकारी प्रदान करता है। आपातकाल के लिए 108 पर कॉल करें।'
                : language === 'te-IN'
                ? 'ఈ AI సాధారణ ఆరోగ్య సమాచారం మాత్రమే అందిస్తుంది। అత్యవసర పరిస్థితుల్లో 108కు కాల్ చేయండి।'
                : language === 'ta-IN'
                ? 'இந்த AI பொதுவான சுகாதார தகவல்களை மட்டுமே வழங்குகிறது। அவசரநிலைக்கு 108 அழைக்கவும்.'
                : 'This AI provides general health information only. For emergencies, call 108 or visit a hospital.'}
            </span>
          </div>
        </div>

        {/* Mobile Language Selector */}
        <div className="sm:hidden px-4 py-2 bg-white/5">
          <LanguageSelector 
            value={language} 
            onChange={setLanguage}
          />
        </div>

        {/* Voice Support Indicator */}
        {(!isSupported || !isTTSSupported) && (
          <div className="bg-orange-500/80 text-white py-2 px-4 text-center text-sm">
            {!isSupported && "Voice input not supported in your browser. "}
            {!isTTSSupported && "Text-to-speech not supported in your browser."}
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-white text-foreground rounded-br-md'
                      : 'bg-white/20 backdrop-blur-sm text-white rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm md:text-base">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('**') ? 'font-semibold mt-2' : ''}>
                        {line.replace(/\*\*/g, '').replace(/_/g, '')}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${message.type === 'user' ? 'text-muted-foreground' : 'text-white/60'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {/* Text-to-Speech button for bot messages */}
                    {message.type === 'bot' && isTTSSupported && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSpeakMessage(message.content)}
                        className="p-1 h-auto text-white/60 hover:text-white hover:bg-white/10"
                        title="Listen to this message"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white/10 backdrop-blur-lg border-t border-white/10 p-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex gap-3">
              <VoiceButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                onToggleListening={handleToggleListening}
                onStopSpeaking={stopSpeaking}
                disabled={!isSupported}
              />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? 'Listening...' : `Describe your symptoms... (${selectedLangName})`}
                className={`flex-1 bg-white/90 border-0 rounded-xl py-6 text-foreground placeholder:text-muted-foreground ${isListening ? 'ring-2 ring-destructive animate-pulse' : ''}`}
              />
              <Button
                onClick={handleSend}
                className="rounded-xl bg-white text-health hover:bg-white/90 px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-center text-white/60 text-xs mt-3">
              Voice input available • Tap mic to speak in {selectedLangName}
            </p>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Telemedicine;
