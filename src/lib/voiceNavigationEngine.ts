// Voice Navigation Engine for Dashboard AI Assistant
// Supports Telugu, Hindi, and English navigation commands

export type SupportedLanguage = 'en-IN' | 'hi-IN' | 'te-IN';

interface NavigationCommand {
  patterns: string[];
  route: string;
  description: string;
}

// Navigation command patterns for each language
const NAVIGATION_COMMANDS: Record<SupportedLanguage, NavigationCommand[]> = {
  'en-IN': [
    { patterns: ['crop', 'farming', 'agriculture', 'recommendation', 'what to grow', 'which crop'], route: '/crop-recommendation', description: 'Crop Recommendation' },
    { patterns: ['job', 'jobs', 'employment', 'work', 'career', 'vacancy'], route: '/jobs', description: 'Jobs Portal' },
    { patterns: ['skill', 'training', 'learn', 'course', 'education'], route: '/jobs', description: 'Skill Training' },
    { patterns: ['scheme', 'government', 'subsidy', 'benefit', 'yojana', 'welfare'], route: '/schemes', description: 'Government Schemes' },
    { patterns: ['weather', 'forecast', 'rain', 'climate', 'temperature'], route: '/weather', description: 'Weather Forecast' },
    { patterns: ['health', 'doctor', 'medical', 'medicine', 'telemedicine', 'hospital'], route: '/telemedicine', description: 'Telemedicine' },
    { patterns: ['home', 'dashboard', 'main', 'back'], route: '/dashboard', description: 'Dashboard' },
  ],
  'hi-IN': [
    { patterns: ['फसल', 'खेती', 'कृषि', 'बुवाई', 'क्या उगाएं', 'कौन सी फसल', 'fasal', 'kheti'], route: '/crop-recommendation', description: 'फसल सिफारिश' },
    { patterns: ['नौकरी', 'रोजगार', 'काम', 'जॉब', 'naukri', 'rozgar', 'kaam'], route: '/jobs', description: 'नौकरी पोर्टल' },
    { patterns: ['कौशल', 'प्रशिक्षण', 'सीखना', 'कोर्स', 'शिक्षा', 'skill', 'training'], route: '/jobs', description: 'कौशल प्रशिक्षण' },
    { patterns: ['योजना', 'सरकारी', 'सब्सिडी', 'लाभ', 'कल्याण', 'scheme', 'government', 'yojana'], route: '/schemes', description: 'सरकारी योजनाएं' },
    { patterns: ['मौसम', 'बारिश', 'तापमान', 'जलवायु', 'weather', 'mausam'], route: '/weather', description: 'मौसम पूर्वानुमान' },
    { patterns: ['स्वास्थ्य', 'डॉक्टर', 'चिकित्सा', 'अस्पताल', 'health', 'doctor'], route: '/telemedicine', description: 'टेलीमेडिसिन' },
    { patterns: ['होम', 'डैशबोर्ड', 'मुख्य', 'वापस', 'home', 'dashboard'], route: '/dashboard', description: 'डैशबोर्ड' },
  ],
  'te-IN': [
    { patterns: ['పంట', 'వ్యవసాయం', 'సేద్యం', 'ఏమి పండించాలి', 'panta', 'vyavasayam'], route: '/crop-recommendation', description: 'పంట సిఫార్సు' },
    { patterns: ['ఉద్యోగం', 'పని', 'కెరీర్', 'job', 'udyogam', 'pani'], route: '/jobs', description: 'ఉద్యోగ పోర్టల్' },
    { patterns: ['నైపుణ్యం', 'శిక్షణ', 'కోర్సు', 'నేర్చుకోవడం', 'skill', 'training'], route: '/jobs', description: 'నైపుణ్య శిక్షణ' },
    { patterns: ['పథకం', 'ప్రభుత్వ', 'సబ్సిడీ', 'scheme', 'government', 'pathakam'], route: '/schemes', description: 'ప్రభుత్వ పథకాలు' },
    { patterns: ['వాతావరణం', 'వర్షం', 'ఉష్ణోగ్రత', 'weather', 'varsham'], route: '/weather', description: 'వాతావరణ సమాచారం' },
    { patterns: ['ఆరోగ్యం', 'డాక్టర్', 'వైద్యం', 'health', 'doctor', 'aarogyam'], route: '/telemedicine', description: 'టెలిమెడిసిన్' },
    { patterns: ['హోమ్', 'డాష్‌బోర్డ్', 'వెనక్కి', 'home', 'dashboard'], route: '/dashboard', description: 'డాష్‌బోర్డ్' },
  ]
};

// General help responses for each language
const HELP_RESPONSES: Record<SupportedLanguage, string[]> = {
  'en-IN': [
    'I can help you navigate this app. Try saying:',
    '"Open crop recommendation" - Get farming suggestions',
    '"Go to job portal" - Find employment',
    '"Show government schemes" - View benefits',
    '"Open weather" - Check forecast',
    '"Health advice" - Medical consultation'
  ],
  'hi-IN': [
    'मैं इस ऐप में नेविगेट करने में आपकी मदद कर सकता हूं। कहें:',
    '"फसल सिफारिश खोलें" - खेती के सुझाव',
    '"नौकरी पोर्टल जाएं" - रोजगार खोजें',
    '"सरकारी योजनाएं दिखाएं" - लाभ देखें',
    '"मौसम खोलें" - पूर्वानुमान देखें',
    '"स्वास्थ्य सलाह" - चिकित्सा परामर्श'
  ],
  'te-IN': [
    'నేను ఈ యాప్‌లో నావిగేట్ చేయడంలో సహాయపడగలను. చెప్పండి:',
    '"పంట సిఫార్సు తెరవండి" - వ్యవసాయ సలహాలు',
    '"ఉద్యోగ పోర్టల్ వెళ్ళండి" - ఉపాధి కనుగొనండి',
    '"ప్రభుత్వ పథకాలు చూపించు" - ప్రయోజనాలు చూడండి',
    '"వాతావరణం తెరవండి" - అంచనా చూడండి',
    '"ఆరోగ్య సలహా" - వైద్య సంప్రదింపు'
  ]
};

// Welcome messages
const WELCOME_MESSAGES: Record<SupportedLanguage, string> = {
  'en-IN': 'Hello! I am your navigation assistant. How can I help you today? You can ask me to open any section like crop recommendations, jobs, schemes, or weather.',
  'hi-IN': 'नमस्ते! मैं आपका नेविगेशन सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं? आप मुझसे फसल सिफारिश, नौकरी, योजनाएं या मौसम जैसे किसी भी सेक्शन को खोलने के लिए कह सकते हैं।',
  'te-IN': 'నమస్కారం! నేను మీ నావిగేషన్ అసిస్టెంట్. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను? మీరు పంట సిఫార్సులు, ఉద్యోగాలు, పథకాలు లేదా వాతావరణం వంటి ఏదైనా విభాగాన్ని తెరవమని నన్ను అడగవచ్చు.'
};

// Not understood messages
const NOT_UNDERSTOOD: Record<SupportedLanguage, string> = {
  'en-IN': "I didn't understand that. Try saying 'Open crop recommendation' or 'Go to jobs' or 'Show schemes'.",
  'hi-IN': "मुझे समझ नहीं आया। 'फसल सिफारिश खोलें' या 'नौकरी पोर्टल जाएं' या 'योजनाएं दिखाएं' कहने की कोशिश करें।",
  'te-IN': "నాకు అర్థం కాలేదు. 'పంట సిఫార్సు తెరవండి' లేదా 'ఉద్యోగాలకు వెళ్ళండి' లేదా 'పథకాలు చూపించు' అని చెప్పడానికి ప్రయత్నించండి."
};

// Navigation confirmation messages
const NAVIGATION_CONFIRM: Record<SupportedLanguage, (destination: string) => string> = {
  'en-IN': (dest) => `Taking you to ${dest}. Please wait...`,
  'hi-IN': (dest) => `${dest} पर ले जा रहा हूं। कृपया प्रतीक्षा करें...`,
  'te-IN': (dest) => `${dest} కి తీసుకెళ్తున్నాను. దయచేసి వేచి ఉండండి...`
};

export interface NavigationResult {
  type: 'navigate' | 'help' | 'unknown' | 'welcome';
  route?: string;
  message: string;
  description?: string;
}

// Process voice command and return navigation result
export function processVoiceCommand(
  transcript: string,
  language: SupportedLanguage
): NavigationResult {
  const normalizedText = transcript.toLowerCase().trim();
  
  // Check for help/greeting commands
  const helpPatterns = ['help', 'मदद', 'सहायता', 'సహాయం', 'hello', 'hi', 'नमस्ते', 'హలో', 'what can you do', 'क्या कर सकते', 'ఏమి చేయగలవు'];
  if (helpPatterns.some(p => normalizedText.includes(p))) {
    return {
      type: 'help',
      message: HELP_RESPONSES[language].join('\n')
    };
  }
  
  // Check navigation commands for the language
  const commands = NAVIGATION_COMMANDS[language];
  
  for (const command of commands) {
    for (const pattern of command.patterns) {
      if (normalizedText.includes(pattern.toLowerCase())) {
        return {
          type: 'navigate',
          route: command.route,
          message: NAVIGATION_CONFIRM[language](command.description),
          description: command.description
        };
      }
    }
  }
  
  // Also check English patterns as fallback for all languages
  if (language !== 'en-IN') {
    const englishCommands = NAVIGATION_COMMANDS['en-IN'];
    for (const command of englishCommands) {
      for (const pattern of command.patterns) {
        if (normalizedText.includes(pattern.toLowerCase())) {
          return {
            type: 'navigate',
            route: command.route,
            message: NAVIGATION_CONFIRM[language](command.description),
            description: command.description
          };
        }
      }
    }
  }
  
  // Not understood
  return {
    type: 'unknown',
    message: NOT_UNDERSTOOD[language]
  };
}

export function getWelcomeMessage(language: SupportedLanguage): string {
  return WELCOME_MESSAGES[language];
}

export function getHelpMessage(language: SupportedLanguage): string {
  return HELP_RESPONSES[language].join('\n');
}
