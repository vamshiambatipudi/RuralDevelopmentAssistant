// Multilingual Medical Responses for Telemedicine Module

import { SupportedLanguage } from '@/hooks/useSpeech';

export interface MedicalResponse {
  homeRemedies: string[];
  medicines: string[];
  warnings: string[];
}

export interface MultilingualMedicalData {
  [symptom: string]: {
    [lang in SupportedLanguage]?: MedicalResponse;
  };
}

// Symptom keywords in different languages
export const symptomKeywords: Record<string, string[]> = {
  fever: ['fever', 'temperature', 'bukhar', 'बुखार', 'జ్వరం', 'காய்ச்சல்', 'ज्वर', 'তাপ', 'ಜ್ವರ', 'പനി', 'ਬੁਖਾਰ'],
  headache: ['headache', 'head pain', 'sir dard', 'सिरदर्द', 'तलकळी', 'తలనొప్పి', 'தலைவலி', 'মাথা ব্যথা', 'ತಲೆನೋವು', 'തലവേദന', 'ਸਿਰ ਦਰਦ'],
  cold: ['cold', 'cough', 'sardi', 'khansi', 'सर्दी', 'खांसी', 'జలుబు', 'దగ్గు', 'சளி', 'இருமல்', 'সর্দি', 'কাশি', 'ಶೀತ', 'ಕೆಮ್ಮು', 'ജലദോഷം', 'ചുമ', 'ਜ਼ੁਕਾਮ', 'ਖੰਘ'],
  stomach: ['stomach', 'pain', 'pet dard', 'पेट दर्द', 'कब्ज', 'diarrhea', 'उल्टी', 'vomiting', 'పొట్ట నొప్పి', 'வயிற்று வலி', 'পেট ব্যথা', 'ಹೊಟ್ಟೆ ನೋವು', 'വയറുവേദന', 'ਪੇਟ ਦਰਦ'],
  infection: ['infection', 'wound', 'cut', 'घाव', 'संक్రమణం', 'संसर्ग', 'తెగిన', 'காயம்', 'সংক্রমণ', 'ಸೋಂಕು', 'അണുബാധ', 'ਸੰਕਰਮਣ'],
  dehydration: ['dehydration', 'thirst', 'weakness', 'पानी की कमी', 'कमज़ोरी', 'నిర్జలీకరణం', 'నీరసం', 'நீர்ச்சத்து குறைபாடு', 'জলশূন্যতা', 'ನಿರ್ಜಲೀಕರಣ', 'നിർജ്ജലീകരണം', 'ਪਾਣੀ ਦੀ ਕਮੀ'],
};

// Full multilingual responses
export const multilingualResponses: MultilingualMedicalData = {
  fever: {
    'en-IN': {
      homeRemedies: [
        'Rest and stay hydrated (drink plenty of water, ORS, coconut water)',
        'Apply a cold compress on forehead',
        'Take light, easily digestible food',
        'Wear loose, comfortable clothing',
      ],
      medicines: [
        'Paracetamol 500mg - Take 1 tablet every 6-8 hours if needed (for adults)',
      ],
      warnings: [
        'Fever persists for more than 3 days',
        'Temperature exceeds 103°F (39.4°C)',
        'You experience severe headache or confusion',
        'Rash appears on body',
      ],
    },
    'hi-IN': {
      homeRemedies: [
        'आराम करें और पर्याप्त पानी पिएं (पानी, ORS, नारियल पानी)',
        'माथे पर ठंडी पट्टी रखें',
        'हल्का, आसानी से पचने वाला खाना खाएं',
        'ढीले, आरामदायक कपड़े पहनें',
      ],
      medicines: [
        'पैरासिटामोल 500mg - हर 6-8 घंटे में 1 गोली लें (वयस्कों के लिए)',
      ],
      warnings: [
        'बुखार 3 दिनों से अधिक समय तक रहे',
        'तापमान 103°F (39.4°C) से अधिक हो',
        'गंभीर सिरदर्द या भ्रम हो',
        'शरीर पर दाने दिखाई दें',
      ],
    },
    'te-IN': {
      homeRemedies: [
        'విశ్రాంతి తీసుకోండి మరియు పుష్కలంగా నీరు త్రాగండి (నీరు, ORS, కొబ్బరి నీరు)',
        'నుదుటిపై చల్లని కంప్రెస్ పెట్టండి',
        'తేలికగా జీర్ణమయ్యే ఆహారం తినండి',
        'వదులుగా, సౌకర్యవంతమైన దుస్తులు ధరించండి',
      ],
      medicines: [
        'పారాసెటమాల్ 500mg - అవసరమైతే ప్రతి 6-8 గంటలకు 1 టాబ్లెట్ తీసుకోండి (పెద్దవారికి)',
      ],
      warnings: [
        'జ్వరం 3 రోజులకు మించి ఉంటే',
        'ఉష్ణోగ్రత 103°F (39.4°C) దాటితే',
        'తీవ్రమైన తలనొప్పి లేదా గందరగోళం ఉంటే',
        'శరీరంపై దద్దుర్లు కనిపిస్తే',
      ],
    },
    'ta-IN': {
      homeRemedies: [
        'ஓய்வெடுத்து நிறைய தண்ணீர் குடியுங்கள் (தண்ணீர், ORS, தேங்காய் தண்ணீர்)',
        'நெற்றியில் குளிர்ந்த ஒத்தடம் கொடுங்கள்',
        'எளிதில் செரிக்கக்கூடிய உணவை சாப்பிடுங்கள்',
        'தளர்வான, வசதியான ஆடைகளை அணியுங்கள்',
      ],
      medicines: [
        'பாராசிட்டமால் 500mg - தேவைப்பட்டால் ஒவ்வொரு 6-8 மணி நேரத்திற்கும் 1 மாத்திரை எடுக்கவும் (பெரியவர்களுக்கு)',
      ],
      warnings: [
        'காய்ச்சல் 3 நாட்களுக்கு மேல் நீடித்தால்',
        'வெப்பநிலை 103°F (39.4°C) தாண்டினால்',
        'கடுமையான தலைவலி அல்லது குழப்பம் இருந்தால்',
        'உடலில் சொறி தோன்றினால்',
      ],
    },
  },
  headache: {
    'en-IN': {
      homeRemedies: [
        'Rest in a quiet, dark room',
        'Apply a cold or warm compress',
        'Stay hydrated - drink water',
        'Gentle massage of temples',
        'Practice deep breathing',
      ],
      medicines: [
        'Paracetamol 500mg - Take 1 tablet if pain is severe (for adults)',
      ],
      warnings: [
        'Headache is sudden and severe ("worst headache of your life")',
        'Accompanied by fever, stiff neck, or confusion',
        'Vision changes or difficulty speaking',
        'Headache after a head injury',
      ],
    },
    'hi-IN': {
      homeRemedies: [
        'एक शांत, अंधेरे कमरे में आराम करें',
        'ठंडी या गर्म सिकाई करें',
        'पानी पीकर हाइड्रेटेड रहें',
        'कनपटियों की हल्की मालिश करें',
        'गहरी सांस लें',
      ],
      medicines: [
        'पैरासिटामोल 500mg - दर्द ज्यादा हो तो 1 गोली लें (वयस्कों के लिए)',
      ],
      warnings: [
        'सिरदर्द अचानक और गंभीर हो',
        'बुखार, गर्दन में अकड़न, या भ्रम के साथ हो',
        'दृष्टि में बदलाव या बोलने में कठिनाई हो',
        'सिर में चोट के बाद सिरदर्द हो',
      ],
    },
    'te-IN': {
      homeRemedies: [
        'నిశ్శబ్దంగా, చీకటి గదిలో విశ్రాంతి తీసుకోండి',
        'చల్లని లేదా వెచ్చని కంప్రెస్ పెట్టండి',
        'నీరు త్రాగండి - హైడ్రేటెడ్‌గా ఉండండి',
        'కణతల మృదువైన మసాజ్ చేయండి',
        'లోతైన శ్వాసను అభ్యసించండి',
      ],
      medicines: [
        'పారాసెటమాల్ 500mg - నొప్పి తీవ్రంగా ఉంటే 1 టాబ్లెట్ తీసుకోండి (పెద్దవారికి)',
      ],
      warnings: [
        'తలనొప్పి అకస్మాత్తుగా మరియు తీవ్రంగా ఉంటే',
        'జ్వరం, మెడ దృఢత్వం లేదా గందరగోళంతో కూడి ఉంటే',
        'దృష్టిలో మార్పులు లేదా మాట్లాడటంలో ఇబ్బంది ఉంటే',
        'తల గాయం తర్వాత తలనొప్పి ఉంటే',
      ],
    },
    'ta-IN': {
      homeRemedies: [
        'அமைதியான, இருண்ட அறையில் ஓய்வெடுங்கள்',
        'குளிர்ந்த அல்லது சூடான ஒத்தடம் கொடுங்கள்',
        'தண்ணீர் குடித்து நீரேற்றமாக இருங்கள்',
        'கோவில்களை மென்மையாக மசாஜ் செய்யுங்கள்',
        'ஆழ்ந்த சுவாசத்தை பயிற்சி செய்யுங்கள்',
      ],
      medicines: [
        'பாராசிட்டமால் 500mg - வலி கடுமையாக இருந்தால் 1 மாத்திரை எடுக்கவும் (பெரியவர்களுக்கு)',
      ],
      warnings: [
        'தலைவலி திடீரென்றும் கடுமையானதாகவும் இருந்தால்',
        'காய்ச்சல், கழுத்து விறைப்பு அல்லது குழப்பத்துடன் இருந்தால்',
        'பார்வை மாற்றங்கள் அல்லது பேசுவதில் சிரமம் இருந்தால்',
        'தலையில் காயத்திற்குப் பிறகு தலைவலி இருந்தால்',
      ],
    },
  },
  cold: {
    'en-IN': {
      homeRemedies: [
        'Drink warm liquids (ginger tea, honey-lemon water, turmeric milk)',
        'Steam inhalation 2-3 times daily',
        'Gargle with warm salt water',
        'Rest well and stay warm',
        'Eat light, nutritious food',
      ],
      medicines: [
        'For runny nose: Cetirizine 10mg once daily',
        'For sore throat: Strepsils lozenges',
        'For congestion: Steam with eucalyptus oil',
      ],
      warnings: [
        'Symptoms last more than 10 days',
        'High fever develops (above 102°F)',
        'Difficulty breathing or chest pain',
        'Symptoms improve then worsen again',
      ],
    },
    'hi-IN': {
      homeRemedies: [
        'गर्म पेय पिएं (अदरक की चाय, शहद-नींबू पानी, हल्दी वाला दूध)',
        'दिन में 2-3 बार भाप लें',
        'गर्म नमक के पानी से गरारे करें',
        'अच्छी तरह आराम करें और गर्म रहें',
        'हल्का, पौष्टिक भोजन खाएं',
      ],
      medicines: [
        'बहती नाक के लिए: सेटिरिज़िन 10mg दिन में एक बार',
        'गले में खराश के लिए: स्ट्रेप्सिल्स लोज़ेंज',
        'कंजेशन के लिए: नीलगिरी तेल के साथ भाप लें',
      ],
      warnings: [
        'लक्षण 10 दिनों से अधिक समय तक रहें',
        'तेज बुखार आए (102°F से ऊपर)',
        'सांस लेने में कठिनाई या सीने में दर्द हो',
        'लक्षण सुधरें फिर फिर से बिगड़ें',
      ],
    },
    'te-IN': {
      homeRemedies: [
        'వెచ్చని పానీయాలు త్రాగండి (అల్లం టీ, తేనే-నిమ్మ నీరు, పసుపు పాలు)',
        'రోజుకు 2-3 సార్లు ఆవిరి పీల్చండి',
        'వెచ్చని ఉప్పు నీటితో గార్గిల్ చేయండి',
        'బాగా విశ్రాంతి తీసుకోండి మరియు వెచ్చగా ఉండండి',
        'తేలికపాటి, పోషకమైన ఆహారం తినండి',
      ],
      medicines: [
        'ముక్కు కారడానికి: సెటిరిజిన్ 10mg రోజుకు ఒకసారి',
        'గొంతు నొప్పికి: స్ట్రెప్సిల్స్ లోజెంజెస్',
        'రద్దీకి: యూకలిప్టస్ ఆయిల్‌తో ఆవిరి',
      ],
      warnings: [
        'లక్షణాలు 10 రోజులకు మించి ఉంటే',
        'అధిక జ్వరం వస్తే (102°F పైన)',
        'శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా ఛాతీ నొప్పి ఉంటే',
        'లక్షణాలు మెరుగుపడి మళ్ళీ దిగజారితే',
      ],
    },
    'ta-IN': {
      homeRemedies: [
        'சூடான பானங்கள் குடியுங்கள் (இஞ்சி தேநீர், தேன்-எலுமிச்சை நீர், மஞ்சள் பால்)',
        'தினமும் 2-3 முறை நீராவி பிடியுங்கள்',
        'வெதுவெதுப்பான உப்பு நீரில் வாய் கொப்புளியுங்கள்',
        'நன்றாக ஓய்வெடுத்து சூடாக இருங்கள்',
        'இலேசான, சத்தான உணவு சாப்பிடுங்கள்',
      ],
      medicines: [
        'மூக்கு ஒழுகலுக்கு: செட்டிரிசின் 10mg தினமும் ஒரு முறை',
        'தொண்டை வலிக்கு: ஸ்ட்ரெப்சில்ஸ் லோசெஞ்ச்',
        'நெரிசலுக்கு: யூகலிப்டஸ் எண்ணெயுடன் நீராவி',
      ],
      warnings: [
        'அறிகுறிகள் 10 நாட்களுக்கு மேல் நீடித்தால்',
        'அதிக காய்ச்சல் வந்தால் (102°F க்கு மேல்)',
        'சுவாசிப்பதில் சிரமம் அல்லது மார்பு வலி இருந்தால்',
        'அறிகுறிகள் சரியாகி மீண்டும் மோசமானால்',
      ],
    },
  },
  stomach: {
    'en-IN': {
      homeRemedies: [
        'Drink ORS or lemon water with salt to prevent dehydration',
        'Eat light food like khichdi, rice water, or bananas',
        'Avoid spicy, oily, and heavy foods',
        'Take rest and avoid physical exertion',
        'Drink ginger or cumin tea for digestion',
      ],
      medicines: [
        'For mild pain: Antacid tablets',
        'For loose motions: ORS sachets',
      ],
      warnings: [
        'Blood in stool or vomit',
        'Severe abdominal pain that doesn\'t go away',
        'High fever with stomach pain',
        'Unable to keep any fluids down for 24 hours',
      ],
    },
    'hi-IN': {
      homeRemedies: [
        'निर्जलीकरण रोकने के लिए ORS या नमक वाला नींबू पानी पिएं',
        'खिचड़ी, चावल का पानी, या केले जैसा हल्का भोजन खाएं',
        'मसालेदार, तैलीय और भारी खाने से बचें',
        'आराम करें और शारीरिक परिश्रम से बचें',
        'पाचन के लिए अदरक या जीरे की चाय पिएं',
      ],
      medicines: [
        'हल्के दर्द के लिए: एंटासिड गोलियां',
        'दस्त के लिए: ORS सैशे',
      ],
      warnings: [
        'मल या उल्टी में खून',
        'गंभीर पेट दर्द जो कम न हो',
        'पेट दर्द के साथ तेज बुखार',
        '24 घंटे तक कोई तरल पदार्थ न रख पाना',
      ],
    },
    'te-IN': {
      homeRemedies: [
        'నిర్జలీకరణాన్ని నివారించడానికి ORS లేదా ఉప్పు వేసిన నిమ్మ నీరు త్రాగండి',
        'కిచిడీ, అన్నం నీరు లేదా అరటిపండ్లు వంటి తేలికపాటి ఆహారం తినండి',
        'మసాలా, నూనె మరియు భారీ ఆహారాలను నివారించండి',
        'విశ్రాంతి తీసుకోండి మరియు శారీరక శ్రమను నివారించండి',
        'జీర్ణక్రియ కోసం అల్లం లేదా జీలకర్ర టీ త్రాగండి',
      ],
      medicines: [
        'తేలికపాటి నొప్పికి: యాంటాసిడ్ టాబ్లెట్లు',
        'విరేచనాలకు: ORS ప్యాకెట్లు',
      ],
      warnings: [
        'మలం లేదా వాంతిలో రక్తం',
        'తీవ్రమైన పొట్ట నొప్పి తగ్గకపోతే',
        'పొట్ట నొప్పితో పాటు అధిక జ్వరం',
        '24 గంటలు ఏ ద్రవాలను కూడా ఉంచుకోలేకపోతే',
      ],
    },
    'ta-IN': {
      homeRemedies: [
        'நீர்ச்சத்து குறைபாட்டைத் தடுக்க ORS அல்லது உப்பு சேர்த்த எலுமிச்சை நீர் குடியுங்கள்',
        'கிச்சடி, அரிசி தண்ணீர் அல்லது வாழைப்பழம் போன்ற இலேசான உணவு சாப்பிடுங்கள்',
        'காரமான, எண்ணெய் மற்றும் கனமான உணவுகளைத் தவிர்க்கவும்',
        'ஓய்வெடுத்து உடல் உழைப்பைத் தவிர்க்கவும்',
        'செரிமானத்திற்கு இஞ்சி அல்லது சீரக தேநீர் குடியுங்கள்',
      ],
      medicines: [
        'லேசான வலிக்கு: ஆன்டாசிட் மாத்திரைகள்',
        'வயிற்றுப்போக்குக்கு: ORS பாக்கெட்டுகள்',
      ],
      warnings: [
        'மலம் அல்லது வாந்தியில் இரத்தம்',
        'கடுமையான வயிற்று வலி குறையவில்லை என்றால்',
        'வயிற்று வலியுடன் அதிக காய்ச்சல்',
        '24 மணி நேரம் எந்த திரவத்தையும் வைத்திருக்க முடியவில்லை என்றால்',
      ],
    },
  },
  default: {
    'en-IN': {
      homeRemedies: [
        'Rest well and stay hydrated',
        'Eat nutritious, light food',
        'Monitor your symptoms',
      ],
      medicines: [],
      warnings: [
        'Symptoms worsen or persist for more than a few days',
        'You develop high fever',
        'You experience severe pain or difficulty breathing',
      ],
    },
    'hi-IN': {
      homeRemedies: [
        'अच्छी तरह आराम करें और पानी पीते रहें',
        'पौष्टिक, हल्का भोजन खाएं',
        'अपने लक्षणों पर नज़र रखें',
      ],
      medicines: [],
      warnings: [
        'लक्षण बिगड़ें या कुछ दिनों से अधिक समय तक रहें',
        'तेज बुखार आए',
        'गंभीर दर्द या सांस लेने में कठिनाई हो',
      ],
    },
    'te-IN': {
      homeRemedies: [
        'బాగా విశ్రాంతి తీసుకోండి మరియు నీరు త్రాగండి',
        'పోషకమైన, తేలికపాటి ఆహారం తినండి',
        'మీ లక్షణాలను పర్యవేక్షించండి',
      ],
      medicines: [],
      warnings: [
        'లక్షణాలు మరింత దిగజారితే లేదా కొన్ని రోజులకు మించి ఉంటే',
        'అధిక జ్వరం వస్తే',
        'తీవ్రమైన నొప్పి లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది ఉంటే',
      ],
    },
    'ta-IN': {
      homeRemedies: [
        'நன்றாக ஓய்வெடுத்து நீரேற்றமாக இருங்கள்',
        'சத்தான, இலேசான உணவு சாப்பிடுங்கள்',
        'உங்கள் அறிகுறிகளைக் கண்காணியுங்கள்',
      ],
      medicines: [],
      warnings: [
        'அறிகுறிகள் மோசமடைந்தால் அல்லது சில நாட்களுக்கு மேல் நீடித்தால்',
        'அதிக காய்ச்சல் வந்தால்',
        'கடுமையான வலி அல்லது சுவாசிப்பதில் சிரமம் இருந்தால்',
      ],
    },
  },
};

// Get the UI text in the selected language
export const getUIText = (language: SupportedLanguage) => {
  const texts: Record<SupportedLanguage, { homeRemedies: string; medicines: string; warnings: string; disclaimer: string }> = {
    'en-IN': {
      homeRemedies: 'Home Remedies',
      medicines: 'Safe Medicine (for adults)',
      warnings: 'See a doctor immediately if',
      disclaimer: 'Medical Disclaimer: This AI provides general health information only and is not a substitute for professional medical advice.',
    },
    'hi-IN': {
      homeRemedies: 'घरेलू उपचार',
      medicines: 'सुरक्षित दवा (वयस्कों के लिए)',
      warnings: 'तुरंत डॉक्टर से मिलें अगर',
      disclaimer: 'चिकित्सा अस्वीकरण: यह AI केवल सामान्य स्वास्थ्य जानकारी प्रदान करता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
    },
    'te-IN': {
      homeRemedies: 'ఇంటి నివారణలు',
      medicines: 'సురక్షితమైన మందు (పెద్దవారికి)',
      warnings: 'వెంటనే వైద్యుడిని సంప్రదించండి',
      disclaimer: 'వైద్య నిరాకరణ: ఈ AI సాధారణ ఆరోగ్య సమాచారాన్ని మాత్రమే అందిస్తుంది మరియు ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.',
    },
    'ta-IN': {
      homeRemedies: 'வீட்டு வைத்தியம்',
      medicines: 'பாதுகாப்பான மருந்து (பெரியவர்களுக்கு)',
      warnings: 'உடனடியாக மருத்துவரை அணுகவும்',
      disclaimer: 'மருத்துவ மறுப்பு: இந்த AI பொதுவான சுகாதார தகவல்களை மட்டுமே வழங்குகிறது, தொழில்முறை மருத்துவ ஆலோசனைக்கு மாற்றாக இல்லை.',
    },
    'bn-IN': {
      homeRemedies: 'ঘরোয়া প্রতিকার',
      medicines: 'নিরাপদ ওষুধ (প্রাপ্তবয়স্কদের জন্য)',
      warnings: 'অবিলম্বে ডাক্তার দেখান',
      disclaimer: 'চিকিৎসা দাবিত্যাগ: এই AI শুধুমাত্র সাধারণ স্বাস্থ্য তথ্য প্রদান করে।',
    },
    'mr-IN': {
      homeRemedies: 'घरगुती उपाय',
      medicines: 'सुरक्षित औषध (प्रौढांसाठी)',
      warnings: 'ताबडतोब डॉक्टरांना भेटा',
      disclaimer: 'वैद्यकीय अस्वीकरण: हे AI फक्त सामान्य आरोग्य माहिती प्रदान करते।',
    },
    'gu-IN': {
      homeRemedies: 'ઘરેલું ઉપચાર',
      medicines: 'સલામત દવા (પુખ્ત વયના લોકો માટે)',
      warnings: 'તાત્કાલિક ડૉક્ટરને મળો',
      disclaimer: 'તબીબી અસ્વીકરણ: આ AI માત્ર સામાન્ય સ્વાસ્થ્ય માહિતી પ્રદાન કરે છે।',
    },
    'kn-IN': {
      homeRemedies: 'ಮನೆ ಮದ್ದು',
      medicines: 'ಸುರಕ್ಷಿತ ಔಷಧಿ (ವಯಸ್ಕರಿಗೆ)',
      warnings: 'ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ',
      disclaimer: 'ವೈದ್ಯಕೀಯ ಹಕ್ಕುತ್ಯಾಗ: ಈ AI ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಒದಗಿಸುತ್ತದೆ.',
    },
    'ml-IN': {
      homeRemedies: 'വീട്ടുവൈദ്യം',
      medicines: 'സുരക്ഷിതമായ മരുന്ന് (മുതിർന്നവർക്ക്)',
      warnings: 'ഉടൻ ഡോക്ടറെ കാണുക',
      disclaimer: 'മെഡിക്കൽ നിരാകരണം: ഈ AI സാധാരണ ആരോഗ്യ വിവരങ്ങൾ മാത്രം നൽകുന്നു.',
    },
    'pa-IN': {
      homeRemedies: 'ਘਰੇਲੂ ਇਲਾਜ',
      medicines: 'ਸੁਰੱਖਿਅਤ ਦਵਾਈ (ਬਾਲਗਾਂ ਲਈ)',
      warnings: 'ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ',
      disclaimer: 'ਮੈਡੀਕਲ ਬੇਦਾਅਵਾ: ਇਹ AI ਸਿਰਫ਼ ਆਮ ਸਿਹਤ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।',
    },
  };
  return texts[language] || texts['en-IN'];
};

// Detect symptom from user input
export function detectSymptom(input: string): string {
  const lowerInput = input.toLowerCase();
  
  for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
    if (keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))) {
      return symptom;
    }
  }
  return 'default';
}

// Format response in the selected language
export function formatMedicalResponse(symptom: string, language: SupportedLanguage): string {
  const data = multilingualResponses[symptom]?.[language] || 
               multilingualResponses[symptom]?.['en-IN'] ||
               multilingualResponses.default[language] ||
               multilingualResponses.default['en-IN'];
  
  const ui = getUIText(language);
  
  if (!data) {
    return ui.disclaimer;
  }

  let response = '';
  
  if (data.homeRemedies.length > 0) {
    response += `**${ui.homeRemedies}:**\n`;
    data.homeRemedies.forEach(remedy => {
      response += `• ${remedy}\n`;
    });
  }
  
  if (data.medicines.length > 0) {
    response += `\n**${ui.medicines}:**\n`;
    data.medicines.forEach(medicine => {
      response += `• ${medicine}\n`;
    });
  }
  
  if (data.warnings.length > 0) {
    response += `\n⚠️ **${ui.warnings}:**\n`;
    data.warnings.forEach(warning => {
      response += `• ${warning}\n`;
    });
  }
  
  response += `\n_${ui.disclaimer}_`;
  
  return response;
}
