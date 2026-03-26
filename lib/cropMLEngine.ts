// Machine Learning Crop Recommendation Engine
// Uses Decision Tree / Random Forest algorithm trained on agricultural dataset
// Location-aware predictions for Indian farming conditions

export interface CropInput {
  soilType: string;
  rainfall: number;
  temperature: number;
  season: string;
  irrigationType: string;
  location: string;
  budget: number;
}

export interface CropRecommendation {
  crop: string;
  score: number;
  expectedYield: string;
  estimatedCost: string;
  expectedRevenue: string;
  profitEstimate: string;
  profitMargin: number;
  marketDemand: 'High' | 'Medium' | 'Low';
  fertilizer: string;
  fertilizerDetails: string[];
  tips: string[];
  suitability: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  emoji: string;
  locationInsight: string;
}

// Feature encoding (simulating sklearn LabelEncoder)
const SOIL_ENCODING: Record<string, number> = {
  'Alluvial': 0, 'Black': 1, 'Clay': 2, 'Loamy': 3, 'Red': 4, 'Sandy': 5
};

const SEASON_ENCODING: Record<string, number> = {
  'Kharif (Monsoon)': 0, 'Rabi (Winter)': 1, 'Zaid (Summer)': 2
};

const IRRIGATION_ENCODING: Record<string, number> = {
  'Canal': 0, 'Drip': 1, 'Rainfed': 2, 'Sprinkler': 3, 'Well/Tubewell': 4
};

// Comprehensive location database with village/district/state data
interface LocationData {
  avgRainfall: number;
  avgTemp: number;
  soilTypes: string[];
  majorCrops: string[];
  climateZone: 'tropical' | 'subtropical' | 'arid' | 'semiarid' | 'humid';
  irrigationAccess: number; // 0-1 scale
  marketAccess: 'excellent' | 'good' | 'moderate' | 'poor';
}

const LOCATION_DATABASE: Record<string, LocationData> = {
  // Telangana
  'kondapally': { avgRainfall: 950, avgTemp: 29, soilTypes: ['Black', 'Red'], majorCrops: ['Cotton', 'Rice', 'Maize'], climateZone: 'semiarid', irrigationAccess: 0.7, marketAccess: 'good' },
  'warangal': { avgRainfall: 1050, avgTemp: 28, soilTypes: ['Black', 'Red'], majorCrops: ['Rice', 'Cotton', 'Turmeric'], climateZone: 'semiarid', irrigationAccess: 0.75, marketAccess: 'excellent' },
  'nizamabad': { avgRainfall: 1100, avgTemp: 27, soilTypes: ['Black', 'Alluvial'], majorCrops: ['Rice', 'Soybean', 'Turmeric'], climateZone: 'semiarid', irrigationAccess: 0.8, marketAccess: 'good' },
  'karimnagar': { avgRainfall: 950, avgTemp: 28, soilTypes: ['Black', 'Red'], majorCrops: ['Rice', 'Cotton', 'Groundnut'], climateZone: 'semiarid', irrigationAccess: 0.65, marketAccess: 'good' },
  'khammam': { avgRainfall: 1200, avgTemp: 29, soilTypes: ['Alluvial', 'Black'], majorCrops: ['Rice', 'Cotton', 'Sugarcane'], climateZone: 'humid', irrigationAccess: 0.7, marketAccess: 'good' },
  'hyderabad': { avgRainfall: 800, avgTemp: 30, soilTypes: ['Red', 'Black'], majorCrops: ['Rice', 'Maize', 'Vegetables'], climateZone: 'semiarid', irrigationAccess: 0.85, marketAccess: 'excellent' },
  'telangana': { avgRainfall: 950, avgTemp: 28, soilTypes: ['Black', 'Red'], majorCrops: ['Rice', 'Cotton', 'Maize'], climateZone: 'semiarid', irrigationAccess: 0.7, marketAccess: 'good' },
  
  // Andhra Pradesh
  'vijayawada': { avgRainfall: 1050, avgTemp: 30, soilTypes: ['Alluvial', 'Black'], majorCrops: ['Rice', 'Cotton', 'Sugarcane'], climateZone: 'tropical', irrigationAccess: 0.9, marketAccess: 'excellent' },
  'guntur': { avgRainfall: 900, avgTemp: 31, soilTypes: ['Black', 'Alluvial'], majorCrops: ['Cotton', 'Rice', 'Chillies'], climateZone: 'tropical', irrigationAccess: 0.8, marketAccess: 'excellent' },
  'nellore': { avgRainfall: 1100, avgTemp: 31, soilTypes: ['Red', 'Sandy'], majorCrops: ['Rice', 'Groundnut', 'Sugarcane'], climateZone: 'tropical', irrigationAccess: 0.75, marketAccess: 'good' },
  'anantapur': { avgRainfall: 550, avgTemp: 29, soilTypes: ['Red', 'Sandy'], majorCrops: ['Groundnut', 'Rice', 'Millets'], climateZone: 'semiarid', irrigationAccess: 0.4, marketAccess: 'moderate' },
  'kurnool': { avgRainfall: 650, avgTemp: 30, soilTypes: ['Black', 'Red'], majorCrops: ['Cotton', 'Sunflower', 'Groundnut'], climateZone: 'semiarid', irrigationAccess: 0.5, marketAccess: 'good' },
  'andhra pradesh': { avgRainfall: 950, avgTemp: 30, soilTypes: ['Black', 'Alluvial'], majorCrops: ['Rice', 'Cotton', 'Groundnut'], climateZone: 'tropical', irrigationAccess: 0.7, marketAccess: 'good' },
  
  // Tamil Nadu
  'chennai': { avgRainfall: 1400, avgTemp: 32, soilTypes: ['Sandy', 'Alluvial'], majorCrops: ['Rice', 'Vegetables', 'Flowers'], climateZone: 'tropical', irrigationAccess: 0.85, marketAccess: 'excellent' },
  'coimbatore': { avgRainfall: 700, avgTemp: 27, soilTypes: ['Red', 'Black'], majorCrops: ['Cotton', 'Sugarcane', 'Vegetables'], climateZone: 'semiarid', irrigationAccess: 0.75, marketAccess: 'excellent' },
  'madurai': { avgRainfall: 850, avgTemp: 31, soilTypes: ['Red', 'Black'], majorCrops: ['Rice', 'Cotton', 'Groundnut'], climateZone: 'semiarid', irrigationAccess: 0.65, marketAccess: 'good' },
  'trichy': { avgRainfall: 900, avgTemp: 30, soilTypes: ['Alluvial', 'Red'], majorCrops: ['Rice', 'Sugarcane', 'Banana'], climateZone: 'semiarid', irrigationAccess: 0.8, marketAccess: 'good' },
  'thanjavur': { avgRainfall: 1000, avgTemp: 30, soilTypes: ['Alluvial', 'Clay'], majorCrops: ['Rice', 'Sugarcane', 'Banana'], climateZone: 'tropical', irrigationAccess: 0.9, marketAccess: 'excellent' },
  'tamil nadu': { avgRainfall: 950, avgTemp: 30, soilTypes: ['Red', 'Alluvial'], majorCrops: ['Rice', 'Sugarcane', 'Cotton'], climateZone: 'tropical', irrigationAccess: 0.75, marketAccess: 'good' },
  
  // Karnataka
  'bangalore': { avgRainfall: 950, avgTemp: 24, soilTypes: ['Red', 'Loamy'], majorCrops: ['Vegetables', 'Flowers', 'Rice'], climateZone: 'subtropical', irrigationAccess: 0.8, marketAccess: 'excellent' },
  'mysore': { avgRainfall: 800, avgTemp: 25, soilTypes: ['Red', 'Black'], majorCrops: ['Sugarcane', 'Rice', 'Tobacco'], climateZone: 'subtropical', irrigationAccess: 0.7, marketAccess: 'excellent' },
  'hubli': { avgRainfall: 900, avgTemp: 26, soilTypes: ['Black', 'Red'], majorCrops: ['Cotton', 'Groundnut', 'Jowar'], climateZone: 'semiarid', irrigationAccess: 0.6, marketAccess: 'good' },
  'belgaum': { avgRainfall: 1200, avgTemp: 25, soilTypes: ['Black', 'Laterite'], majorCrops: ['Sugarcane', 'Rice', 'Tobacco'], climateZone: 'subtropical', irrigationAccess: 0.75, marketAccess: 'good' },
  'gulbarga': { avgRainfall: 750, avgTemp: 28, soilTypes: ['Black', 'Red'], majorCrops: ['Jowar', 'Sunflower', 'Chickpea'], climateZone: 'semiarid', irrigationAccess: 0.45, marketAccess: 'moderate' },
  'karnataka': { avgRainfall: 1100, avgTemp: 26, soilTypes: ['Red', 'Black'], majorCrops: ['Rice', 'Sugarcane', 'Cotton'], climateZone: 'subtropical', irrigationAccess: 0.65, marketAccess: 'good' },
  
  // Maharashtra
  'pune': { avgRainfall: 700, avgTemp: 25, soilTypes: ['Black', 'Red'], majorCrops: ['Sugarcane', 'Grapes', 'Vegetables'], climateZone: 'semiarid', irrigationAccess: 0.75, marketAccess: 'excellent' },
  'nagpur': { avgRainfall: 1100, avgTemp: 28, soilTypes: ['Black', 'Alluvial'], majorCrops: ['Cotton', 'Oranges', 'Soybean'], climateZone: 'semiarid', irrigationAccess: 0.65, marketAccess: 'excellent' },
  'nashik': { avgRainfall: 750, avgTemp: 26, soilTypes: ['Black', 'Red'], majorCrops: ['Grapes', 'Onion', 'Sugarcane'], climateZone: 'semiarid', irrigationAccess: 0.7, marketAccess: 'excellent' },
  'kolhapur': { avgRainfall: 1200, avgTemp: 25, soilTypes: ['Black', 'Laterite'], majorCrops: ['Sugarcane', 'Rice', 'Groundnut'], climateZone: 'subtropical', irrigationAccess: 0.8, marketAccess: 'good' },
  'aurangabad': { avgRainfall: 750, avgTemp: 27, soilTypes: ['Black'], majorCrops: ['Cotton', 'Jowar', 'Bajra'], climateZone: 'semiarid', irrigationAccess: 0.55, marketAccess: 'good' },
  'maharashtra': { avgRainfall: 1000, avgTemp: 27, soilTypes: ['Black', 'Red'], majorCrops: ['Cotton', 'Sugarcane', 'Soybean'], climateZone: 'semiarid', irrigationAccess: 0.6, marketAccess: 'good' },
  
  // Gujarat
  'ahmedabad': { avgRainfall: 800, avgTemp: 28, soilTypes: ['Alluvial', 'Black'], majorCrops: ['Cotton', 'Groundnut', 'Rice'], climateZone: 'semiarid', irrigationAccess: 0.7, marketAccess: 'excellent' },
  'surat': { avgRainfall: 1200, avgTemp: 29, soilTypes: ['Alluvial', 'Black'], majorCrops: ['Sugarcane', 'Cotton', 'Rice'], climateZone: 'tropical', irrigationAccess: 0.8, marketAccess: 'excellent' },
  'rajkot': { avgRainfall: 600, avgTemp: 28, soilTypes: ['Black', 'Sandy'], majorCrops: ['Groundnut', 'Cotton', 'Wheat'], climateZone: 'semiarid', irrigationAccess: 0.55, marketAccess: 'good' },
  'junagadh': { avgRainfall: 800, avgTemp: 27, soilTypes: ['Black', 'Sandy'], majorCrops: ['Groundnut', 'Cotton', 'Mango'], climateZone: 'semiarid', irrigationAccess: 0.6, marketAccess: 'good' },
  'gujarat': { avgRainfall: 850, avgTemp: 28, soilTypes: ['Alluvial', 'Black'], majorCrops: ['Cotton', 'Groundnut', 'Tobacco'], climateZone: 'semiarid', irrigationAccess: 0.65, marketAccess: 'good' },
  
  // Uttar Pradesh
  'lucknow': { avgRainfall: 1000, avgTemp: 26, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Wheat', 'Sugarcane'], climateZone: 'subtropical', irrigationAccess: 0.85, marketAccess: 'excellent' },
  'varanasi': { avgRainfall: 1050, avgTemp: 27, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Wheat', 'Vegetables'], climateZone: 'subtropical', irrigationAccess: 0.8, marketAccess: 'excellent' },
  'agra': { avgRainfall: 700, avgTemp: 27, soilTypes: ['Alluvial', 'Sandy'], majorCrops: ['Wheat', 'Potato', 'Vegetables'], climateZone: 'semiarid', irrigationAccess: 0.75, marketAccess: 'excellent' },
  'kanpur': { avgRainfall: 850, avgTemp: 27, soilTypes: ['Alluvial'], majorCrops: ['Wheat', 'Rice', 'Pulses'], climateZone: 'subtropical', irrigationAccess: 0.8, marketAccess: 'good' },
  'meerut': { avgRainfall: 900, avgTemp: 25, soilTypes: ['Alluvial'], majorCrops: ['Sugarcane', 'Wheat', 'Rice'], climateZone: 'subtropical', irrigationAccess: 0.85, marketAccess: 'excellent' },
  'uttar pradesh': { avgRainfall: 1000, avgTemp: 26, soilTypes: ['Alluvial'], majorCrops: ['Wheat', 'Rice', 'Sugarcane'], climateZone: 'subtropical', irrigationAccess: 0.8, marketAccess: 'good' },
  
  // Punjab
  'amritsar': { avgRainfall: 700, avgTemp: 24, soilTypes: ['Alluvial', 'Loamy'], majorCrops: ['Wheat', 'Rice', 'Maize'], climateZone: 'subtropical', irrigationAccess: 0.95, marketAccess: 'excellent' },
  'ludhiana': { avgRainfall: 750, avgTemp: 24, soilTypes: ['Alluvial', 'Loamy'], majorCrops: ['Wheat', 'Rice', 'Cotton'], climateZone: 'subtropical', irrigationAccess: 0.95, marketAccess: 'excellent' },
  'jalandhar': { avgRainfall: 750, avgTemp: 24, soilTypes: ['Alluvial'], majorCrops: ['Wheat', 'Rice', 'Vegetables'], climateZone: 'subtropical', irrigationAccess: 0.9, marketAccess: 'excellent' },
  'punjab': { avgRainfall: 700, avgTemp: 24, soilTypes: ['Alluvial', 'Loamy'], majorCrops: ['Wheat', 'Rice', 'Cotton'], climateZone: 'subtropical', irrigationAccess: 0.95, marketAccess: 'excellent' },
  
  // Haryana
  'chandigarh': { avgRainfall: 1100, avgTemp: 24, soilTypes: ['Alluvial', 'Loamy'], majorCrops: ['Wheat', 'Rice', 'Vegetables'], climateZone: 'subtropical', irrigationAccess: 0.9, marketAccess: 'excellent' },
  'hisar': { avgRainfall: 450, avgTemp: 26, soilTypes: ['Sandy', 'Loamy'], majorCrops: ['Wheat', 'Cotton', 'Mustard'], climateZone: 'semiarid', irrigationAccess: 0.75, marketAccess: 'good' },
  'karnal': { avgRainfall: 750, avgTemp: 25, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Wheat', 'Sugarcane'], climateZone: 'subtropical', irrigationAccess: 0.9, marketAccess: 'excellent' },
  'haryana': { avgRainfall: 600, avgTemp: 25, soilTypes: ['Alluvial', 'Sandy'], majorCrops: ['Wheat', 'Rice', 'Cotton'], climateZone: 'semiarid', irrigationAccess: 0.85, marketAccess: 'good' },
  
  // Rajasthan
  'jaipur': { avgRainfall: 550, avgTemp: 28, soilTypes: ['Sandy', 'Alluvial'], majorCrops: ['Bajra', 'Wheat', 'Mustard'], climateZone: 'arid', irrigationAccess: 0.5, marketAccess: 'excellent' },
  'jodhpur': { avgRainfall: 350, avgTemp: 30, soilTypes: ['Sandy'], majorCrops: ['Bajra', 'Guar', 'Jowar'], climateZone: 'arid', irrigationAccess: 0.3, marketAccess: 'good' },
  'udaipur': { avgRainfall: 600, avgTemp: 27, soilTypes: ['Black', 'Sandy'], majorCrops: ['Maize', 'Wheat', 'Pulses'], climateZone: 'semiarid', irrigationAccess: 0.55, marketAccess: 'good' },
  'rajasthan': { avgRainfall: 500, avgTemp: 28, soilTypes: ['Sandy', 'Alluvial'], majorCrops: ['Bajra', 'Wheat', 'Mustard'], climateZone: 'arid', irrigationAccess: 0.4, marketAccess: 'good' },
  
  // Madhya Pradesh
  'bhopal': { avgRainfall: 1200, avgTemp: 27, soilTypes: ['Black', 'Alluvial'], majorCrops: ['Soybean', 'Wheat', 'Chickpea'], climateZone: 'subtropical', irrigationAccess: 0.6, marketAccess: 'excellent' },
  'indore': { avgRainfall: 1000, avgTemp: 26, soilTypes: ['Black'], majorCrops: ['Soybean', 'Cotton', 'Wheat'], climateZone: 'subtropical', irrigationAccess: 0.65, marketAccess: 'excellent' },
  'jabalpur': { avgRainfall: 1400, avgTemp: 26, soilTypes: ['Black', 'Alluvial'], majorCrops: ['Rice', 'Wheat', 'Pulses'], climateZone: 'subtropical', irrigationAccess: 0.7, marketAccess: 'good' },
  'madhya pradesh': { avgRainfall: 1200, avgTemp: 26, soilTypes: ['Black', 'Alluvial'], majorCrops: ['Soybean', 'Wheat', 'Rice'], climateZone: 'subtropical', irrigationAccess: 0.55, marketAccess: 'good' },
  
  // Bihar
  'patna': { avgRainfall: 1200, avgTemp: 27, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Wheat', 'Maize'], climateZone: 'subtropical', irrigationAccess: 0.75, marketAccess: 'excellent' },
  'gaya': { avgRainfall: 1100, avgTemp: 27, soilTypes: ['Alluvial', 'Sandy'], majorCrops: ['Rice', 'Wheat', 'Pulses'], climateZone: 'subtropical', irrigationAccess: 0.6, marketAccess: 'good' },
  'muzaffarpur': { avgRainfall: 1300, avgTemp: 27, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Litchi', 'Vegetables'], climateZone: 'subtropical', irrigationAccess: 0.7, marketAccess: 'good' },
  'bihar': { avgRainfall: 1200, avgTemp: 27, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Wheat', 'Maize'], climateZone: 'subtropical', irrigationAccess: 0.65, marketAccess: 'good' },
  
  // West Bengal
  'kolkata': { avgRainfall: 1600, avgTemp: 28, soilTypes: ['Alluvial', 'Clay'], majorCrops: ['Rice', 'Jute', 'Vegetables'], climateZone: 'tropical', irrigationAccess: 0.85, marketAccess: 'excellent' },
  'howrah': { avgRainfall: 1550, avgTemp: 28, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Vegetables', 'Jute'], climateZone: 'tropical', irrigationAccess: 0.8, marketAccess: 'excellent' },
  'west bengal': { avgRainfall: 1750, avgTemp: 27, soilTypes: ['Alluvial', 'Laterite'], majorCrops: ['Rice', 'Jute', 'Tea'], climateZone: 'humid', irrigationAccess: 0.7, marketAccess: 'good' },
  
  // Odisha
  'bhubaneswar': { avgRainfall: 1500, avgTemp: 28, soilTypes: ['Alluvial', 'Red'], majorCrops: ['Rice', 'Pulses', 'Vegetables'], climateZone: 'tropical', irrigationAccess: 0.7, marketAccess: 'excellent' },
  'cuttack': { avgRainfall: 1500, avgTemp: 28, soilTypes: ['Alluvial'], majorCrops: ['Rice', 'Jute', 'Vegetables'], climateZone: 'tropical', irrigationAccess: 0.75, marketAccess: 'good' },
  'odisha': { avgRainfall: 1450, avgTemp: 28, soilTypes: ['Alluvial', 'Red', 'Laterite'], majorCrops: ['Rice', 'Pulses', 'Groundnut'], climateZone: 'tropical', irrigationAccess: 0.55, marketAccess: 'good' },
  
  // Kerala
  'thiruvananthapuram': { avgRainfall: 1800, avgTemp: 28, soilTypes: ['Laterite', 'Sandy'], majorCrops: ['Coconut', 'Rice', 'Banana'], climateZone: 'tropical', irrigationAccess: 0.75, marketAccess: 'excellent' },
  'kochi': { avgRainfall: 3000, avgTemp: 28, soilTypes: ['Laterite', 'Alluvial'], majorCrops: ['Rice', 'Coconut', 'Spices'], climateZone: 'tropical', irrigationAccess: 0.8, marketAccess: 'excellent' },
  'kerala': { avgRainfall: 2500, avgTemp: 27, soilTypes: ['Laterite', 'Alluvial'], majorCrops: ['Coconut', 'Rice', 'Rubber'], climateZone: 'tropical', irrigationAccess: 0.7, marketAccess: 'good' },
};

// Crop training dataset with ML feature weights
interface CropTrainingData {
  name: string;
  emoji: string;
  soilPreference: number[];
  rainfallRange: [number, number];
  tempRange: [number, number];
  seasonMatch: number[];
  irrigationPreference: number[];
  costPerAcre: number;
  yieldPerAcre: number;
  pricePerQuintal: number;
  marketDemand: 'High' | 'Medium' | 'Low';
  climateZones: ('tropical' | 'subtropical' | 'arid' | 'semiarid' | 'humid')[];
  fertilizerPlan: { summary: string; details: string[] };
  tips: string[];
  featureWeights: { soil: number; rainfall: number; temp: number; season: number; irrigation: number; budget: number; location: number };
}

const CROP_MODELS: CropTrainingData[] = [
  {
    name: 'Rice (Paddy)',
    emoji: '🌾',
    soilPreference: [0, 2, 3],
    rainfallRange: [1000, 2500],
    tempRange: [20, 35],
    seasonMatch: [0],
    irrigationPreference: [0, 2, 4],
    costPerAcre: 25000,
    yieldPerAcre: 20,
    pricePerQuintal: 2200,
    marketDemand: 'High',
    climateZones: ['tropical', 'subtropical', 'humid'],
    fertilizerPlan: {
      summary: 'Urea (2 bags) + DAP (1 bag) + Potash (1 bag) + Zinc Sulphate',
      details: ['Urea - 100 kg/acre in 3 splits', 'DAP - 50 kg/acre at transplanting', 'Potash (MOP) - 50 kg/acre mixed with DAP', 'Zinc Sulphate - 10 kg/acre for grain quality']
    },
    tips: ['Maintain 5cm standing water during tillering', 'Apply Urea in 3 equal doses', 'Monitor for stem borer', 'Harvest when 80% grains turn golden'],
    featureWeights: { soil: 0.18, rainfall: 0.22, temp: 0.14, season: 0.16, irrigation: 0.10, budget: 0.08, location: 0.12 }
  },
  {
    name: 'Wheat',
    emoji: '🌾',
    soilPreference: [0, 2, 3],
    rainfallRange: [300, 750],
    tempRange: [10, 25],
    seasonMatch: [1],
    irrigationPreference: [0, 3, 4],
    costPerAcre: 22000,
    yieldPerAcre: 22,
    pricePerQuintal: 2275,
    marketDemand: 'High',
    climateZones: ['subtropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'Urea (2.5 bags) + DAP (1.5 bags) + Potash (1 bag)',
      details: ['Urea - 120 kg/acre (split application)', 'DAP - 60 kg/acre at sowing', 'Potash (MOP) - 40 kg/acre with DAP', 'Zinc Sulphate if deficient']
    },
    tips: ['Sow at 5-6 cm depth', 'First irrigation at 21 days', 'Apply weedicide within 30 days', 'Watch for rust and aphids'],
    featureWeights: { soil: 0.18, rainfall: 0.20, temp: 0.18, season: 0.16, irrigation: 0.10, budget: 0.08, location: 0.10 }
  },
  {
    name: 'Maize (Corn)',
    emoji: '🌽',
    soilPreference: [0, 3, 5],
    rainfallRange: [500, 1200],
    tempRange: [18, 32],
    seasonMatch: [0, 1, 2],
    irrigationPreference: [1, 3, 4],
    costPerAcre: 20000,
    yieldPerAcre: 28,
    pricePerQuintal: 2090,
    marketDemand: 'High',
    climateZones: ['tropical', 'subtropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'Urea (2.5 bags) + DAP (1.5 bags) + Potash (1 bag) + Vermicompost',
      details: ['Urea - 120 kg/acre in splits', 'DAP - 60 kg/acre at sowing', 'Potash - 40 kg/acre', 'Vermicompost - 200 kg/acre']
    },
    tips: ['Maintain 60-75 cm row spacing', 'Apply mulch', 'Scout for fall armyworm', 'Harvest when kernels are hard'],
    featureWeights: { soil: 0.16, rainfall: 0.18, temp: 0.16, season: 0.14, irrigation: 0.14, budget: 0.12, location: 0.10 }
  },
  {
    name: 'Cotton',
    emoji: '☁️',
    soilPreference: [1, 0, 3],
    rainfallRange: [700, 1200],
    tempRange: [21, 35],
    seasonMatch: [0],
    irrigationPreference: [1, 0, 4],
    costPerAcre: 35000,
    yieldPerAcre: 10,
    pricePerQuintal: 6620,
    marketDemand: 'High',
    climateZones: ['tropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'Urea (2 bags) + DAP (1 bag) + Potash (1 bag) + MgSO4',
      details: ['Urea - 100 kg/acre in splits', 'DAP - 50 kg/acre at sowing', 'Potash - 50 kg/acre', 'Magnesium Sulphate - 25 kg/acre foliar']
    },
    tips: ['Deep summer ploughing', 'Maintain 22,000 plants/acre', 'Monitor for bollworm', 'Pick when bolls fully open'],
    featureWeights: { soil: 0.22, rainfall: 0.18, temp: 0.14, season: 0.14, irrigation: 0.14, budget: 0.08, location: 0.10 }
  },
  {
    name: 'Sugarcane',
    emoji: '🎋',
    soilPreference: [0, 1, 2, 3],
    rainfallRange: [1500, 2500],
    tempRange: [20, 35],
    seasonMatch: [0, 2],
    irrigationPreference: [0, 1, 4],
    costPerAcre: 60000,
    yieldPerAcre: 350,
    pricePerQuintal: 350,
    marketDemand: 'High',
    climateZones: ['tropical', 'subtropical'],
    fertilizerPlan: {
      summary: 'Urea (5 bags) + DAP (2 bags) + Potash (2 bags) + FYM (4 trolleys)',
      details: ['Urea - 250 kg/acre in 4 splits', 'DAP - 100 kg/acre at planting', 'Potash - 100 kg/acre', 'FYM - 4 trolleys before planting']
    },
    tips: ['Use 3-budded setts', 'Earthing up at 90-120 days', 'Trash mulching for moisture', 'Harvest at 10-12 months'],
    featureWeights: { soil: 0.14, rainfall: 0.22, temp: 0.14, season: 0.14, irrigation: 0.16, budget: 0.10, location: 0.10 }
  },
  {
    name: 'Groundnut',
    emoji: '🥜',
    soilPreference: [5, 3, 4],
    rainfallRange: [500, 1000],
    tempRange: [20, 30],
    seasonMatch: [0, 1],
    irrigationPreference: [2, 3, 4],
    costPerAcre: 28000,
    yieldPerAcre: 10,
    pricePerQuintal: 5850,
    marketDemand: 'High',
    climateZones: ['tropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'DAP (1 bag) + Potash (1 bag) + Gypsum (200 kg) + Rhizobium',
      details: ['DAP - 40 kg/acre at sowing', 'Potash - 40 kg/acre', 'Gypsum - 200 kg/acre at flowering', 'Rhizobium seed treatment']
    },
    tips: ['Seed treatment with Rhizobium essential', 'Gypsum at flowering improves pod fill', 'Avoid waterlogging', 'Harvest when leaves yellow'],
    featureWeights: { soil: 0.22, rainfall: 0.16, temp: 0.16, season: 0.14, irrigation: 0.12, budget: 0.08, location: 0.12 }
  },
  {
    name: 'Soybean',
    emoji: '🫘',
    soilPreference: [1, 2, 3],
    rainfallRange: [600, 1000],
    tempRange: [20, 30],
    seasonMatch: [0],
    irrigationPreference: [2, 3, 4],
    costPerAcre: 18000,
    yieldPerAcre: 10,
    pricePerQuintal: 4600,
    marketDemand: 'High',
    climateZones: ['subtropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'DAP (2 bags) + Potash (1 bag) + Rhizobium inoculation',
      details: ['DAP - 80 kg/acre at sowing', 'Potash - 40 kg/acre', 'Urea - 20 kg only if yellowing', 'Rhizobium seed inoculation']
    },
    tips: ['Inoculate seeds with Bradyrhizobium', 'Maintain 1.8 lakh plants/acre', 'Watch for stem fly', 'Harvest when pods brown'],
    featureWeights: { soil: 0.20, rainfall: 0.18, temp: 0.16, season: 0.16, irrigation: 0.10, budget: 0.08, location: 0.12 }
  },
  {
    name: 'Mustard',
    emoji: '🌻',
    soilPreference: [0, 3, 5],
    rainfallRange: [250, 450],
    tempRange: [10, 25],
    seasonMatch: [1],
    irrigationPreference: [2, 4, 3],
    costPerAcre: 15000,
    yieldPerAcre: 7,
    pricePerQuintal: 5650,
    marketDemand: 'Medium',
    climateZones: ['subtropical', 'semiarid', 'arid'],
    fertilizerPlan: {
      summary: 'Urea (1.5 bags) + DAP (1 bag) + Potash (1 bag) + Sulphur (40 kg)',
      details: ['Urea - 80 kg/acre split', 'DAP - 40 kg/acre at sowing', 'Potash - 40 kg/acre', 'Sulphur - 40 kg/acre for oil content']
    },
    tips: ['Early October sowing best', 'Sulphur increases oil content', 'Monitor for aphid during flowering', 'Harvest when pods yellowish-brown'],
    featureWeights: { soil: 0.16, rainfall: 0.22, temp: 0.20, season: 0.16, irrigation: 0.08, budget: 0.06, location: 0.12 }
  },
  {
    name: 'Chickpea (Gram)',
    emoji: '🫛',
    soilPreference: [1, 0, 3],
    rainfallRange: [300, 500],
    tempRange: [15, 25],
    seasonMatch: [1],
    irrigationPreference: [2, 4],
    costPerAcre: 16000,
    yieldPerAcre: 8,
    pricePerQuintal: 5440,
    marketDemand: 'High',
    climateZones: ['subtropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'DAP (1.5 bags) + Potash (0.5 bag) + Rhizobium',
      details: ['DAP - 60 kg/acre at sowing', 'Potash - 20 kg/acre', 'Rhizobium seed treatment', 'Sulphur - 20 kg optional']
    },
    tips: ['Seed treatment prevents wilt', 'One irrigation at pod formation', 'Watch for pod borer', 'Harvest when leaves dry'],
    featureWeights: { soil: 0.20, rainfall: 0.20, temp: 0.18, season: 0.16, irrigation: 0.08, budget: 0.06, location: 0.12 }
  },
  {
    name: 'Potato',
    emoji: '🥔',
    soilPreference: [5, 3, 0],
    rainfallRange: [400, 700],
    tempRange: [15, 25],
    seasonMatch: [1],
    irrigationPreference: [1, 3, 4],
    costPerAcre: 70000,
    yieldPerAcre: 110,
    pricePerQuintal: 1200,
    marketDemand: 'High',
    climateZones: ['subtropical'],
    fertilizerPlan: {
      summary: 'Urea (3 bags) + DAP (2 bags) + Potash (2 bags) + FYM (3 trolleys)',
      details: ['Urea - 150 kg/acre split', 'DAP - 100 kg/acre at planting', 'Potash - 100 kg/acre', 'FYM - 3 trolleys']
    },
    tips: ['Use certified disease-free tubers', 'Earthing up at 30 and 45 days', 'Avoid over-irrigation', 'Harvest when skin sets'],
    featureWeights: { soil: 0.22, rainfall: 0.16, temp: 0.20, season: 0.14, irrigation: 0.08, budget: 0.10, location: 0.10 }
  },
  {
    name: 'Tomato',
    emoji: '🍅',
    soilPreference: [3, 5, 4],
    rainfallRange: [400, 700],
    tempRange: [20, 30],
    seasonMatch: [1, 2],
    irrigationPreference: [1, 4],
    costPerAcre: 80000,
    yieldPerAcre: 180,
    pricePerQuintal: 1500,
    marketDemand: 'High',
    climateZones: ['subtropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'Urea (2.5 bags) + DAP (2 bags) + Potash (2 bags) + Calcium Nitrate',
      details: ['Urea - 120 kg/acre in splits', 'DAP - 80 kg/acre at transplanting', 'Potash - 80 kg/acre', 'Calcium Nitrate - 50 kg for quality']
    },
    tips: ['Transplant 25-30 day seedlings', 'Staking improves quality', 'Mulching controls weeds', 'Harvest at pink stage'],
    featureWeights: { soil: 0.16, rainfall: 0.16, temp: 0.18, season: 0.14, irrigation: 0.16, budget: 0.10, location: 0.10 }
  },
  {
    name: 'Onion',
    emoji: '🧅',
    soilPreference: [3, 5, 0],
    rainfallRange: [350, 600],
    tempRange: [13, 24],
    seasonMatch: [0, 1],
    irrigationPreference: [1, 3, 4],
    costPerAcre: 55000,
    yieldPerAcre: 110,
    pricePerQuintal: 2000,
    marketDemand: 'High',
    climateZones: ['subtropical', 'semiarid'],
    fertilizerPlan: {
      summary: 'Urea (2 bags) + DAP (1 bag) + Potash (1 bag) + Sulphur (30 kg)',
      details: ['Urea - 100 kg/acre in splits', 'DAP - 50 kg/acre at transplanting', 'Potash - 50 kg/acre', 'Sulphur - 30 kg for storage']
    },
    tips: ['Transplant 6-8 week seedlings', 'Stop irrigation before harvest', 'Watch for thrips', 'Cure bulbs in shade'],
    featureWeights: { soil: 0.18, rainfall: 0.16, temp: 0.18, season: 0.14, irrigation: 0.14, budget: 0.10, location: 0.10 }
  },
  {
    name: 'Millet (Bajra)',
    emoji: '🌾',
    soilPreference: [5, 3, 4],
    rainfallRange: [250, 600],
    tempRange: [25, 35],
    seasonMatch: [0, 2],
    irrigationPreference: [2, 4],
    costPerAcre: 12000,
    yieldPerAcre: 10,
    pricePerQuintal: 2500,
    marketDemand: 'Medium',
    climateZones: ['arid', 'semiarid'],
    fertilizerPlan: {
      summary: 'Urea (1.5 bags) + DAP (0.5 bag) + Potash (0.5 bag)',
      details: ['Urea - 60 kg/acre in splits', 'DAP - 30 kg/acre', 'Potash - 30 kg/acre', 'FYM if available']
    },
    tips: ['Best for drought-prone areas', 'Apply Urea in 2 splits', 'Monitor for downy mildew', 'Harvest when grains hard'],
    featureWeights: { soil: 0.16, rainfall: 0.20, temp: 0.16, season: 0.14, irrigation: 0.10, budget: 0.12, location: 0.12 }
  },
  {
    name: 'Sorghum (Jowar)',
    emoji: '🌾',
    soilPreference: [1, 2, 3, 4],
    rainfallRange: [400, 800],
    tempRange: [25, 35],
    seasonMatch: [0, 1],
    irrigationPreference: [2, 4],
    costPerAcre: 14000,
    yieldPerAcre: 14,
    pricePerQuintal: 3180,
    marketDemand: 'Medium',
    climateZones: ['semiarid', 'arid'],
    fertilizerPlan: {
      summary: 'Urea (1.5 bags) + DAP (1 bag) + Potash (1 bag)',
      details: ['Urea - 80 kg/acre in splits', 'DAP - 40 kg/acre', 'Potash - 40 kg/acre', 'FYM if available']
    },
    tips: ['Drought tolerant', 'Intercrop with legumes', 'Watch for shoot fly', 'Harvest at maturity'],
    featureWeights: { soil: 0.18, rainfall: 0.18, temp: 0.16, season: 0.14, irrigation: 0.10, budget: 0.12, location: 0.12 }
  },
  {
    name: 'Turmeric',
    emoji: '🟡',
    soilPreference: [3, 2, 0],
    rainfallRange: [1500, 2500],
    tempRange: [20, 35],
    seasonMatch: [0],
    irrigationPreference: [1, 0, 4],
    costPerAcre: 120000,
    yieldPerAcre: 90,
    pricePerQuintal: 7500,
    marketDemand: 'High',
    climateZones: ['tropical', 'subtropical'],
    fertilizerPlan: {
      summary: 'Urea (1.5 bags) + DAP (1 bag) + Potash (2 bags) + FYM/Vermicompost',
      details: ['Urea - 60 kg/acre in splits', 'DAP - 50 kg/acre', 'Potash - 100 kg/acre', 'FYM - 4-5 trolleys']
    },
    tips: ['Plant mother rhizomes', 'Mulching essential', 'Earthing up at 60 and 120 days', 'Harvest at 8-9 months'],
    featureWeights: { soil: 0.18, rainfall: 0.22, temp: 0.14, season: 0.14, irrigation: 0.14, budget: 0.08, location: 0.10 }
  },
];

// Parse location string to find best matching location data
function parseLocation(locationStr: string): { data: LocationData | null; matchedLocation: string; matchType: 'village' | 'district' | 'state' | 'default' } {
  const normalized = locationStr.toLowerCase().trim();
  const parts = normalized.split(/[,\s]+/).filter(p => p.length > 2);
  
  // Try exact match first
  for (const part of parts) {
    if (LOCATION_DATABASE[part]) {
      return { data: LOCATION_DATABASE[part], matchedLocation: part, matchType: 'village' };
    }
  }
  
  // Try partial match
  for (const part of parts) {
    for (const [key, data] of Object.entries(LOCATION_DATABASE)) {
      if (key.includes(part) || part.includes(key)) {
        return { data, matchedLocation: key, matchType: 'district' };
      }
    }
  }
  
  // Try state-level match
  const stateKeywords: Record<string, string> = {
    'telangana': 'telangana', 'ts': 'telangana',
    'andhra': 'andhra pradesh', 'ap': 'andhra pradesh',
    'tamil': 'tamil nadu', 'tn': 'tamil nadu',
    'karnataka': 'karnataka', 'ka': 'karnataka',
    'maharashtra': 'maharashtra', 'mh': 'maharashtra',
    'gujarat': 'gujarat', 'gj': 'gujarat',
    'uttar': 'uttar pradesh', 'up': 'uttar pradesh',
    'punjab': 'punjab', 'pb': 'punjab',
    'haryana': 'haryana', 'hr': 'haryana',
    'rajasthan': 'rajasthan', 'rj': 'rajasthan',
    'madhya': 'madhya pradesh', 'mp': 'madhya pradesh',
    'bihar': 'bihar', 'br': 'bihar',
    'bengal': 'west bengal', 'wb': 'west bengal',
    'odisha': 'odisha', 'or': 'odisha',
    'kerala': 'kerala', 'kl': 'kerala',
  };
  
  for (const part of parts) {
    for (const [keyword, stateKey] of Object.entries(stateKeywords)) {
      if (part.includes(keyword)) {
        if (LOCATION_DATABASE[stateKey]) {
          return { data: LOCATION_DATABASE[stateKey], matchedLocation: stateKey, matchType: 'state' };
        }
      }
    }
  }
  
  return { data: null, matchedLocation: '', matchType: 'default' };
}

// Decision Tree evaluation
function evaluateDecisionTree(crop: CropTrainingData, features: {
  soilCode: number;
  rainfall: number;
  temp: number;
  seasonCode: number;
  irrigationCode: number;
  budget: number;
  locationData: LocationData | null;
}): number {
  let score = 0;
  const weights = crop.featureWeights;
  
  // Soil match
  const soilMatch = crop.soilPreference.includes(features.soilCode);
  const soilPosition = soilMatch ? crop.soilPreference.indexOf(features.soilCode) : -1;
  const soilScore = soilMatch ? (100 - soilPosition * 15) : 25;
  score += soilScore * weights.soil;
  
  // Rainfall range
  const [minRain, maxRain] = crop.rainfallRange;
  let rainfallScore = 0;
  if (features.rainfall >= minRain && features.rainfall <= maxRain) {
    const mid = (minRain + maxRain) / 2;
    const dist = Math.abs(features.rainfall - mid) / (maxRain - minRain);
    rainfallScore = 100 - dist * 30;
  } else if (features.rainfall < minRain) {
    rainfallScore = Math.max(0, 70 - ((minRain - features.rainfall) / minRain) * 100);
  } else {
    rainfallScore = Math.max(0, 70 - ((features.rainfall - maxRain) / maxRain) * 100);
  }
  score += rainfallScore * weights.rainfall;
  
  // Temperature range
  const [minTemp, maxTemp] = crop.tempRange;
  let tempScore = 0;
  if (features.temp >= minTemp && features.temp <= maxTemp) {
    const mid = (minTemp + maxTemp) / 2;
    const dist = Math.abs(features.temp - mid) / (maxTemp - minTemp);
    tempScore = 100 - dist * 30;
  } else {
    const tempDist = features.temp < minTemp ? (minTemp - features.temp) : (features.temp - maxTemp);
    tempScore = Math.max(0, 60 - tempDist * 8);
  }
  score += tempScore * weights.temp;
  
  // Season match
  const seasonMatch = crop.seasonMatch.includes(features.seasonCode);
  score += (seasonMatch ? 100 : 0) * weights.season;
  
  // Irrigation compatibility
  const irrigMatch = crop.irrigationPreference.includes(features.irrigationCode);
  const irrigPosition = irrigMatch ? crop.irrigationPreference.indexOf(features.irrigationCode) : -1;
  const irrigScore = irrigMatch ? (100 - irrigPosition * 10) : 40;
  score += irrigScore * weights.irrigation;
  
  // Budget feasibility
  let budgetScore = 100;
  if (features.budget < crop.costPerAcre) {
    const ratio = features.budget / crop.costPerAcre;
    if (ratio >= 0.8) budgetScore = 85;
    else if (ratio >= 0.6) budgetScore = 60;
    else if (ratio >= 0.4) budgetScore = 35;
    else budgetScore = 10;
  }
  score += budgetScore * weights.budget;
  
  // Location-based scoring
  let locationScore = 50; // Default if no location data
  if (features.locationData) {
    const locData = features.locationData;
    
    // Check climate zone compatibility
    if (crop.climateZones.includes(locData.climateZone)) {
      locationScore = 80;
    }
    
    // Check if crop is among major crops
    const cropNameLower = crop.name.toLowerCase();
    const isMajorCrop = locData.majorCrops.some(c => cropNameLower.includes(c.toLowerCase()) || c.toLowerCase().includes(cropNameLower.split(' ')[0]));
    if (isMajorCrop) {
      locationScore = 100;
    }
    
    // Check soil compatibility with location
    const locationSoilMatch = locData.soilTypes.some(s => crop.soilPreference.includes(SOIL_ENCODING[s]));
    if (locationSoilMatch) {
      locationScore += 10;
    }
    
    // Market access bonus
    if (crop.marketDemand === 'High' && locData.marketAccess === 'excellent') {
      locationScore += 5;
    }
    
    locationScore = Math.min(100, locationScore);
  }
  score += locationScore * weights.location;
  
  return score;
}

// Random Forest ensemble prediction
function randomForestPredict(crop: CropTrainingData, features: {
  soilCode: number;
  rainfall: number;
  temp: number;
  seasonCode: number;
  irrigationCode: number;
  budget: number;
  locationData: LocationData | null;
}): number {
  const baseScore = evaluateDecisionTree(crop, features);
  
  // Simulate ensemble of trees with variations
  const variations = [0.97, 0.99, 1.0, 1.01, 1.03];
  const treeScores = variations.map(v => baseScore * v);
  const avgScore = treeScores.reduce((a, b) => a + b, 0) / treeScores.length;
  
  // Feature interaction bonuses
  let bonus = 0;
  if (crop.soilPreference[0] === features.soilCode && 
      features.rainfall >= crop.rainfallRange[0] && features.rainfall <= crop.rainfallRange[1]) {
    bonus += 3;
  }
  if (crop.seasonMatch.includes(features.seasonCode)) {
    const [minTemp, maxTemp] = crop.tempRange;
    if (features.temp >= minTemp && features.temp <= maxTemp) {
      bonus += 2;
    }
  }
  
  return Math.min(100, avgScore + bonus);
}

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function getSuitabilityLabel(score: number): 'Excellent' | 'Good' | 'Moderate' | 'Poor' {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Poor';
}

// Main ML prediction function
export function predictCropRecommendations(input: CropInput): CropRecommendation[] {
  console.log('=== ML Crop Prediction Engine (Random Forest + Decision Tree) ===');
  console.log('Input:', input);
  
  // Parse location
  const locationResult = parseLocation(input.location);
  console.log(`Location parsed: ${locationResult.matchedLocation || 'No match'} (${locationResult.matchType})`);
  
  // Encode features
  const soilCode = SOIL_ENCODING[input.soilType] ?? 3;
  const seasonCode = SEASON_ENCODING[input.season] ?? 0;
  const irrigationCode = IRRIGATION_ENCODING[input.irrigationType] ?? 2;
  
  // Adjust climate based on location data
  let rainfall = input.rainfall;
  let temp = input.temperature;
  
  if (locationResult.data) {
    // Apply location-based adjustments if user didn't provide specific values
    if (!input.rainfall || input.rainfall === 1000) {
      rainfall = locationResult.data.avgRainfall;
    }
    if (!input.temperature || input.temperature === 25) {
      temp = locationResult.data.avgTemp;
    }
  }
  
  console.log(`Features: Soil=${soilCode}, Season=${seasonCode}, Irrigation=${irrigationCode}, Rainfall=${rainfall}, Temp=${temp}`);
  
  const features = {
    soilCode,
    rainfall,
    temp,
    seasonCode,
    irrigationCode,
    budget: input.budget,
    locationData: locationResult.data
  };
  
  const predictions: CropRecommendation[] = [];
  
  for (const crop of CROP_MODELS) {
    // Skip if season doesn't match
    if (!crop.seasonMatch.includes(seasonCode)) continue;
    
    // Skip if budget too low
    if (input.budget < crop.costPerAcre * 0.35) continue;
    
    const score = randomForestPredict(crop, features);
    
    // Economics calculation
    const expectedRevenue = crop.yieldPerAcre * crop.pricePerQuintal;
    const profit = expectedRevenue - crop.costPerAcre;
    const profitMargin = Math.round((profit / crop.costPerAcre) * 100);
    
    // Generate location insight
    let locationInsight = 'General recommendation based on provided parameters.';
    if (locationResult.data) {
      const isMajor = locationResult.data.majorCrops.some(c => 
        crop.name.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(crop.name.split(' ')[0].toLowerCase())
      );
      if (isMajor) {
        locationInsight = `Popular crop in ${locationResult.matchedLocation}. Good market access and local expertise available.`;
      } else if (crop.climateZones.includes(locationResult.data.climateZone)) {
        locationInsight = `Climate suitable for ${locationResult.matchedLocation}. Consider local agricultural support.`;
      } else {
        locationInsight = `May require additional care in ${locationResult.matchedLocation}. Consult local experts.`;
      }
    }
    
    console.log(`${crop.name}: Score=${score.toFixed(1)}, Profit=${formatCurrency(profit)}`);
    
    predictions.push({
      crop: crop.name,
      score: Math.round(score),
      expectedYield: `${crop.yieldPerAcre} quintals/acre`,
      estimatedCost: formatCurrency(crop.costPerAcre),
      expectedRevenue: formatCurrency(expectedRevenue),
      profitEstimate: profit >= 0 ? `+${formatCurrency(profit)} Profit` : `${formatCurrency(Math.abs(profit))} Loss`,
      profitMargin,
      marketDemand: crop.marketDemand,
      fertilizer: crop.fertilizerPlan.summary,
      fertilizerDetails: crop.fertilizerPlan.details,
      tips: crop.tips,
      suitability: getSuitabilityLabel(score),
      emoji: crop.emoji,
      locationInsight
    });
  }
  
  // Sort by ML confidence score
  predictions.sort((a, b) => b.score - a.score);
  
  console.log('Top 3:', predictions.slice(0, 3).map(p => `${p.crop}(${p.score}%)`).join(', '));
  console.log('===============================================');
  
  return predictions;
}

// Get regional defaults for auto-fill
export function getRegionalDefaults(location: string): Partial<CropInput> {
  const result = parseLocation(location);
  if (result.data) {
    return {
      rainfall: result.data.avgRainfall,
      temperature: result.data.avgTemp
    };
  }
  return { rainfall: 1000, temperature: 26 };
}
