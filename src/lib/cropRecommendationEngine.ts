// Comprehensive Crop Recommendation Engine
// Uses weighted scoring algorithm based on agricultural data

export interface CropInput {
  soilType: string;
  budget: number; // Budget in INR per acre
  rainfall: number;
  temperature: number;
  season: string;
  irrigationType: string;
  location?: string;
}

export interface CropRecommendation {
  crop: string;
  score: number;
  expectedYield: string;
  expectedRevenue: string;
  estimatedCost: string;
  profitEstimate: string;
  profitMargin: number;
  marketDemand: 'High' | 'Medium' | 'Low';
  fertilizer: string;
  fertilizerDetails: string[];
  tips: string[];
  suitability: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  emoji: string;
}

interface CropProfile {
  name: string;
  emoji: string;
  optimalSoilTypes: string[];
  optimalPHRange: [number, number];
  optimalRainfallRange: [number, number]; // mm
  optimalTempRange: [number, number]; // °C
  seasons: string[];
  irrigationTypes: string[];
  expectedYield: string;
  yieldPerAcre: number; // in quintals
  pricePerQuintal: number; // INR
  costPerAcre: number; // INR
  marketDemand: 'High' | 'Medium' | 'Low';
  fertilizerRecommendation: {
    farmerFriendly: string;
    details: string[];
  };
  tips: string[];
}

// Agricultural dataset based on Indian farming conditions
const cropDatabase: CropProfile[] = [
  {
    name: 'Rice (Paddy)',
    emoji: '🌾',
    optimalSoilTypes: ['Clay', 'Alluvial', 'Loamy'],
    optimalPHRange: [5.5, 7.0],
    optimalRainfallRange: [1000, 2000],
    optimalTempRange: [20, 35],
    seasons: ['Kharif (Monsoon)'],
    irrigationTypes: ['Canal', 'Rainfed', 'Well/Tubewell'],
    expectedYield: '18-22 quintals per acre',
    yieldPerAcre: 20,
    pricePerQuintal: 2200,
    costPerAcre: 25000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (2 bags) + DAP (1 bag) + Potash (1 bag) + Zinc Sulphate (10 kg)',
      details: [
        'Urea - 100 kg/acre (2 bags) - Apply in 3 splits',
        'DAP - 50 kg/acre (1 bag) - Apply at sowing',
        'Potash (MOP) - 50 kg/acre - Apply with DAP',
        'Zinc Sulphate - 10 kg/acre - For better grain quality',
      ],
    },
    tips: [
      'Maintain 5cm water level during tillering stage',
      'Apply Urea in 3 equal doses for better absorption',
      'Watch for leaf folder and stem borer pests',
      'Harvest when 80% grains turn golden yellow',
    ],
  },
  {
    name: 'Wheat',
    emoji: '🌾',
    optimalSoilTypes: ['Loamy', 'Clay', 'Alluvial'],
    optimalPHRange: [6.0, 7.5],
    optimalRainfallRange: [400, 750],
    optimalTempRange: [10, 25],
    seasons: ['Rabi (Winter)'],
    irrigationTypes: ['Canal', 'Well/Tubewell', 'Sprinkler'],
    expectedYield: '20-24 quintals per acre',
    yieldPerAcre: 22,
    pricePerQuintal: 2275,
    costPerAcre: 22000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (2.5 bags) + DAP (1.5 bags) + Potash (1 bag)',
      details: [
        'Urea - 120 kg/acre (2.5 bags) - Half at sowing, half at first irrigation',
        'DAP - 60 kg/acre (1.5 bags) - Apply at sowing',
        'Potash (MOP) - 40 kg/acre - Mix with DAP at sowing',
      ],
    },
    tips: [
      'Sow seeds 5-6 cm deep in well-prepared soil',
      'First irrigation critical at 21 days (crown root initiation)',
      'Apply weedicide within 30 days of sowing',
      'Monitor for rust disease and aphid infestation',
    ],
  },
  {
    name: 'Maize (Corn)',
    emoji: '🌽',
    optimalSoilTypes: ['Loamy', 'Sandy', 'Alluvial'],
    optimalPHRange: [5.5, 7.5],
    optimalRainfallRange: [500, 1000],
    optimalTempRange: [18, 32],
    seasons: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'],
    irrigationTypes: ['Drip', 'Sprinkler', 'Well/Tubewell', 'Canal'],
    expectedYield: '24-32 quintals per acre',
    yieldPerAcre: 28,
    pricePerQuintal: 2090,
    costPerAcre: 20000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (2.5 bags) + DAP (1.5 bags) + Potash (1 bag) + Vermicompost (2 quintals)',
      details: [
        'Urea - 120 kg/acre (2.5 bags) - Apply in splits at 25 and 45 days',
        'DAP - 60 kg/acre (1.5 bags) - At sowing',
        'Potash (MOP) - 40 kg/acre - With DAP',
        'Vermicompost - 200 kg/acre - For soil health',
      ],
    },
    tips: [
      'Maintain 75cm row spacing for proper growth',
      'Apply mulch to retain soil moisture',
      'Watch for fall armyworm - major pest threat',
      'Harvest when kernels are hard and husk dry',
    ],
  },
  {
    name: 'Cotton',
    emoji: '☁️',
    optimalSoilTypes: ['Black', 'Loamy', 'Alluvial'],
    optimalPHRange: [6.0, 8.0],
    optimalRainfallRange: [700, 1200],
    optimalTempRange: [21, 35],
    seasons: ['Kharif (Monsoon)'],
    irrigationTypes: ['Drip', 'Canal', 'Well/Tubewell'],
    expectedYield: '8-12 quintals per acre (lint)',
    yieldPerAcre: 10,
    pricePerQuintal: 6620,
    costPerAcre: 35000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (2 bags) + DAP (1 bag) + Potash (1 bag) + MgSO4 (25 kg)',
      details: [
        'Urea - 100 kg/acre - In 3-4 splits during growth',
        'DAP - 50 kg/acre - At sowing',
        'Potash (MOP) - 50 kg/acre - Half at sowing, half at flowering',
        'Magnesium Sulphate - 25 kg/acre - Foliar spray for leaf health',
      ],
    },
    tips: [
      'Deep ploughing in summer for pest control',
      'Maintain proper plant population (22,000/acre)',
      'Watch for bollworm and whitefly infestation',
      'Pick cotton when bolls are fully opened',
    ],
  },
  {
    name: 'Sugarcane',
    emoji: '🎋',
    optimalSoilTypes: ['Loamy', 'Clay', 'Alluvial', 'Black'],
    optimalPHRange: [6.0, 8.0],
    optimalRainfallRange: [1500, 2500],
    optimalTempRange: [20, 35],
    seasons: ['Zaid (Summer)', 'Kharif (Monsoon)'],
    irrigationTypes: ['Canal', 'Drip', 'Well/Tubewell'],
    expectedYield: '320-400 quintals per acre',
    yieldPerAcre: 350,
    pricePerQuintal: 350,
    costPerAcre: 60000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (5 bags) + DAP (2 bags) + Potash (2 bags) + FYM (4 trolleys)',
      details: [
        'Urea - 250 kg/acre (5 bags) - In 4 equal splits',
        'DAP - 100 kg/acre (2 bags) - At planting',
        'Potash (MOP) - 100 kg/acre - Half at planting, half at 3 months',
        'FYM/Compost - 4 trolleys per acre - Before planting',
      ],
    },
    tips: [
      'Use 3-budded setts for planting',
      'Earthing up at 90-120 days after planting',
      'Trash mulching helps retain moisture',
      'Harvest at 10-12 months for maximum sugar content',
    ],
  },
  {
    name: 'Groundnut (Peanut)',
    emoji: '🥜',
    optimalSoilTypes: ['Sandy', 'Loamy', 'Red'],
    optimalPHRange: [5.5, 7.0],
    optimalRainfallRange: [500, 1000],
    optimalTempRange: [20, 30],
    seasons: ['Kharif (Monsoon)', 'Rabi (Winter)'],
    irrigationTypes: ['Rainfed', 'Sprinkler', 'Well/Tubewell'],
    expectedYield: '8-12 quintals per acre',
    yieldPerAcre: 10,
    pricePerQuintal: 5850,
    costPerAcre: 28000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'DAP (1 bag) + Potash (1 bag) + Gypsum (200 kg) + Rhizobium',
      details: [
        'DAP - 40 kg/acre - At sowing',
        'Potash (MOP) - 40 kg/acre - At sowing',
        'Gypsum - 200 kg/acre - Apply at flowering stage',
        'Rhizobium culture - Seed treatment before sowing',
      ],
    },
    tips: [
      'Treat seeds with Rhizobium culture before sowing',
      'Apply gypsum at flowering stage for pod development',
      'Avoid waterlogging - causes pod rot',
      'Harvest when leaves turn yellow and pods mature',
    ],
  },
  {
    name: 'Soybean',
    emoji: '🫘',
    optimalSoilTypes: ['Loamy', 'Clay', 'Black'],
    optimalPHRange: [6.0, 7.0],
    optimalRainfallRange: [600, 1000],
    optimalTempRange: [20, 30],
    seasons: ['Kharif (Monsoon)'],
    irrigationTypes: ['Rainfed', 'Sprinkler', 'Well/Tubewell'],
    expectedYield: '8-12 quintals per acre',
    yieldPerAcre: 10,
    pricePerQuintal: 4600,
    costPerAcre: 18000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'DAP (2 bags) + Potash (1 bag) + Rhizobium',
      details: [
        'DAP - 80 kg/acre (2 bags) - At sowing',
        'Potash (MOP) - 40 kg/acre - At sowing',
        'Urea - 20 kg/acre - Only if plants are yellow',
        'Rhizobium/Bradyrhizobium - Seed inoculation',
      ],
    },
    tips: [
      'Inoculate seeds with Bradyrhizobium for nitrogen fixation',
      'Maintain optimum plant population (1.8 lakh/acre)',
      'Watch for stem fly and girdle beetle',
      'Harvest when pods turn brown and rattle',
    ],
  },
  {
    name: 'Mustard',
    emoji: '🌻',
    optimalSoilTypes: ['Loamy', 'Sandy', 'Alluvial'],
    optimalPHRange: [6.0, 7.5],
    optimalRainfallRange: [250, 400],
    optimalTempRange: [10, 25],
    seasons: ['Rabi (Winter)'],
    irrigationTypes: ['Rainfed', 'Well/Tubewell', 'Sprinkler'],
    expectedYield: '6-8 quintals per acre',
    yieldPerAcre: 7,
    pricePerQuintal: 5650,
    costPerAcre: 15000,
    marketDemand: 'Medium',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (1.5 bags) + DAP (1 bag) + Potash (1 bag) + Sulphur (40 kg)',
      details: [
        'Urea - 80 kg/acre - Half at sowing, half at 30 days',
        'DAP - 40 kg/acre - At sowing',
        'Potash (MOP) - 40 kg/acre - At sowing',
        'Sulphur (Bentonite Sulphur) - 40 kg/acre - For oil content',
      ],
    },
    tips: [
      'Early sowing (October) gives better yields',
      'Apply sulphur for higher oil content',
      'Watch for aphid attack during flowering',
      'Harvest when pods turn yellowish-brown',
    ],
  },
  {
    name: 'Chickpea (Gram)',
    emoji: '🫛',
    optimalSoilTypes: ['Loamy', 'Black', 'Alluvial'],
    optimalPHRange: [6.0, 8.0],
    optimalRainfallRange: [300, 500],
    optimalTempRange: [15, 25],
    seasons: ['Rabi (Winter)'],
    irrigationTypes: ['Rainfed', 'Well/Tubewell'],
    expectedYield: '6-10 quintals per acre',
    yieldPerAcre: 8,
    pricePerQuintal: 5440,
    costPerAcre: 16000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'DAP (1.5 bags) + Potash (0.5 bag) + Rhizobium',
      details: [
        'DAP - 60 kg/acre (1.5 bags) - At sowing',
        'Potash (MOP) - 20 kg/acre - At sowing',
        'Rhizobium - Seed treatment (no extra nitrogen needed)',
        'Sulphur - 20 kg/acre - Optional for better yield',
      ],
    },
    tips: [
      'Seed treatment with fungicide prevents wilt',
      'One irrigation at pod formation is critical',
      'Watch for pod borer - major pest',
      'Harvest when leaves dry and pods turn brown',
    ],
  },
  {
    name: 'Potato',
    emoji: '🥔',
    optimalSoilTypes: ['Sandy', 'Loamy', 'Alluvial'],
    optimalPHRange: [5.0, 6.5],
    optimalRainfallRange: [400, 600],
    optimalTempRange: [15, 25],
    seasons: ['Rabi (Winter)'],
    irrigationTypes: ['Drip', 'Sprinkler', 'Well/Tubewell'],
    expectedYield: '100-120 quintals per acre',
    yieldPerAcre: 110,
    pricePerQuintal: 1200,
    costPerAcre: 70000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (3 bags) + DAP (2 bags) + Potash (2 bags) + FYM (3 trolleys)',
      details: [
        'Urea - 150 kg/acre (3 bags) - Half at planting, half at earthing',
        'DAP - 100 kg/acre (2 bags) - At planting',
        'Potash (MOP) - 100 kg/acre - At planting',
        'FYM - 3 trolleys per acre - Before planting',
      ],
    },
    tips: [
      'Use certified disease-free seed tubers',
      'Earthing up at 30 and 45 days after planting',
      'Avoid over-irrigation to prevent late blight',
      'Harvest when leaves turn yellow and skin sets',
    ],
  },
  {
    name: 'Tomato',
    emoji: '🍅',
    optimalSoilTypes: ['Loamy', 'Sandy', 'Red'],
    optimalPHRange: [6.0, 7.0],
    optimalRainfallRange: [400, 600],
    optimalTempRange: [20, 30],
    seasons: ['Rabi (Winter)', 'Zaid (Summer)'],
    irrigationTypes: ['Drip', 'Well/Tubewell'],
    expectedYield: '160-200 quintals per acre',
    yieldPerAcre: 180,
    pricePerQuintal: 1500,
    costPerAcre: 80000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (2.5 bags) + DAP (2 bags) + Potash (2 bags) + Calcium Nitrate',
      details: [
        'Urea - 120 kg/acre - In multiple splits through drip',
        'DAP - 80 kg/acre - At transplanting',
        'Potash (MOP) - 80 kg/acre - In splits',
        'Calcium Nitrate - 50 kg/acre - For fruit quality',
      ],
    },
    tips: [
      'Transplant 25-30 day old seedlings',
      'Staking improves fruit quality and reduces diseases',
      'Mulching conserves moisture and controls weeds',
      'Harvest at pink stage for distant markets',
    ],
  },
  {
    name: 'Onion',
    emoji: '🧅',
    optimalSoilTypes: ['Loamy', 'Sandy', 'Alluvial'],
    optimalPHRange: [6.0, 7.0],
    optimalRainfallRange: [350, 550],
    optimalTempRange: [13, 24],
    seasons: ['Rabi (Winter)', 'Kharif (Monsoon)'],
    irrigationTypes: ['Drip', 'Sprinkler', 'Well/Tubewell'],
    expectedYield: '100-120 quintals per acre',
    yieldPerAcre: 110,
    pricePerQuintal: 2000,
    costPerAcre: 55000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (2 bags) + DAP (1 bag) + Potash (1 bag) + Sulphur (30 kg)',
      details: [
        'Urea - 100 kg/acre - In 2-3 splits',
        'DAP - 50 kg/acre - At transplanting',
        'Potash (MOP) - 50 kg/acre - At transplanting',
        'Sulphur - 30 kg/acre - For pungency and storage',
      ],
    },
    tips: [
      'Transplant 6-8 week old seedlings',
      'Stop irrigation 10-15 days before harvest',
      'Watch for thrips and purple blotch disease',
      'Cure bulbs in shade for 7-10 days after harvest',
    ],
  },
  {
    name: 'Millet (Bajra)',
    emoji: '🌾',
    optimalSoilTypes: ['Sandy', 'Loamy', 'Red'],
    optimalPHRange: [5.5, 7.5],
    optimalRainfallRange: [300, 600],
    optimalTempRange: [25, 35],
    seasons: ['Kharif (Monsoon)', 'Zaid (Summer)'],
    irrigationTypes: ['Rainfed', 'Well/Tubewell'],
    expectedYield: '8-12 quintals per acre',
    yieldPerAcre: 10,
    pricePerQuintal: 2500,
    costPerAcre: 12000,
    marketDemand: 'Medium',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (1.5 bags) + DAP (0.5 bag) + Potash (0.5 bag)',
      details: [
        'Urea - 60 kg/acre - In 2 equal splits',
        'DAP - 30 kg/acre - At sowing',
        'Potash (MOP) - 30 kg/acre - At sowing',
        'FYM - 1-2 trolleys - If available',
      ],
    },
    tips: [
      'Best suited for drought-prone areas',
      'Apply Urea in 2 equal splits',
      'Watch for downy mildew and ergot diseases',
      'Harvest when grains are hard',
    ],
  },
  {
    name: 'Sorghum (Jowar)',
    emoji: '🌾',
    optimalSoilTypes: ['Black', 'Clay', 'Loamy', 'Red'],
    optimalPHRange: [6.0, 8.0],
    optimalRainfallRange: [400, 800],
    optimalTempRange: [25, 35],
    seasons: ['Kharif (Monsoon)', 'Rabi (Winter)'],
    irrigationTypes: ['Rainfed', 'Well/Tubewell'],
    expectedYield: '12-16 quintals per acre',
    yieldPerAcre: 14,
    pricePerQuintal: 3180,
    costPerAcre: 14000,
    marketDemand: 'Medium',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (1.5 bags) + DAP (1 bag) + Potash (1 bag)',
      details: [
        'Urea - 80 kg/acre - In 2 splits',
        'DAP - 40 kg/acre - At sowing',
        'Potash (MOP) - 40 kg/acre - At sowing',
      ],
    },
    tips: [
      'Drought tolerant crop suitable for dry regions',
      'Intercropping with legumes increases soil fertility',
      'Watch for shoot fly in early stages',
      'Harvest at physiological maturity',
    ],
  },
  {
    name: 'Turmeric',
    emoji: '🟡',
    optimalSoilTypes: ['Loamy', 'Clay', 'Alluvial'],
    optimalPHRange: [5.5, 7.5],
    optimalRainfallRange: [1500, 2500],
    optimalTempRange: [20, 35],
    seasons: ['Kharif (Monsoon)'],
    irrigationTypes: ['Drip', 'Canal', 'Well/Tubewell'],
    expectedYield: '80-100 quintals per acre (fresh)',
    yieldPerAcre: 90,
    pricePerQuintal: 7500,
    costPerAcre: 120000,
    marketDemand: 'High',
    fertilizerRecommendation: {
      farmerFriendly: 'Urea (1.5 bags) + DAP (1 bag) + Potash (2 bags) + FYM (4-5 trolleys)',
      details: [
        'Urea - 60 kg/acre - In 3 splits',
        'DAP - 50 kg/acre - At planting',
        'Potash (MOP) - 100 kg/acre - In 2 splits',
        'FYM/Vermicompost - 4-5 trolleys - Before planting',
      ],
    },
    tips: [
      'Plant mother rhizomes for better yield',
      'Mulching is essential after planting',
      'Earthing up at 60 and 120 days',
      'Harvest when leaves turn yellow (8-9 months)',
    ],
  },
];

// Scoring weights for different factors
const WEIGHTS = {
  soilType: 0.25,
  budget: 0.15,
  rainfall: 0.20,
  temperature: 0.15,
  season: 0.15,
  irrigation: 0.10,
};

function calculateSoilScore(cropProfile: CropProfile, soilType: string): number {
  if (cropProfile.optimalSoilTypes.includes(soilType)) {
    const index = cropProfile.optimalSoilTypes.indexOf(soilType);
    return 100 - (index * 10);
  }
  return 20;
}

function calculateBudgetScore(cropProfile: CropProfile, budget: number): number {
  const requiredBudget = cropProfile.costPerAcre;
  
  if (budget >= requiredBudget) {
    return 100;
  } else if (budget >= requiredBudget * 0.8) {
    return 80;
  } else if (budget >= requiredBudget * 0.6) {
    return 60;
  } else if (budget >= requiredBudget * 0.4) {
    return 40;
  }
  return 20;
}

function calculateRainfallScore(cropProfile: CropProfile, rainfall: number): number {
  const [minRain, maxRain] = cropProfile.optimalRainfallRange;
  const midRain = (minRain + maxRain) / 2;
  
  if (rainfall >= minRain && rainfall <= maxRain) {
    const distanceFromMid = Math.abs(rainfall - midRain);
    const range = maxRain - minRain;
    return 100 - (distanceFromMid / (range / 2)) * 15;
  } else {
    const distance = rainfall < minRain ? (minRain - rainfall) / minRain : (rainfall - maxRain) / maxRain;
    return Math.max(0, 70 - distance * 100);
  }
}

function calculateTemperatureScore(cropProfile: CropProfile, temp: number): number {
  const [minTemp, maxTemp] = cropProfile.optimalTempRange;
  const midTemp = (minTemp + maxTemp) / 2;
  
  if (temp >= minTemp && temp <= maxTemp) {
    const distanceFromMid = Math.abs(temp - midTemp);
    const range = maxTemp - minTemp;
    return 100 - (distanceFromMid / (range / 2)) * 15;
  } else {
    const distance = temp < minTemp ? minTemp - temp : temp - maxTemp;
    return Math.max(0, 60 - distance * 10);
  }
}

function calculateSeasonScore(cropProfile: CropProfile, season: string): number {
  return cropProfile.seasons.includes(season) ? 100 : 0;
}

function calculateIrrigationScore(cropProfile: CropProfile, irrigation: string): number {
  if (cropProfile.irrigationTypes.includes(irrigation)) {
    const index = cropProfile.irrigationTypes.indexOf(irrigation);
    return 100 - (index * 5);
  }
  return 40;
}

function getSuitability(score: number): 'Excellent' | 'Good' | 'Moderate' | 'Poor' {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Poor';
}

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getCropRecommendations(input: CropInput): CropRecommendation[] {
  console.log('=== Crop Recommendation Engine ===');
  console.log('Input received:', input);
  
  const results: CropRecommendation[] = [];
  
  for (const crop of cropDatabase) {
    const soilScore = calculateSoilScore(crop, input.soilType);
    const budgetScore = calculateBudgetScore(crop, input.budget);
    const rainfallScore = calculateRainfallScore(crop, input.rainfall);
    const tempScore = calculateTemperatureScore(crop, input.temperature);
    const seasonScore = calculateSeasonScore(crop, input.season);
    const irrigationScore = calculateIrrigationScore(crop, input.irrigationType);
    
    // Skip crops that don't match the season
    if (seasonScore === 0) continue;
    
    // Skip crops that exceed budget significantly
    if (input.budget < crop.costPerAcre * 0.4) continue;
    
    const totalScore = 
      soilScore * WEIGHTS.soilType +
      budgetScore * WEIGHTS.budget +
      rainfallScore * WEIGHTS.rainfall +
      tempScore * WEIGHTS.temperature +
      seasonScore * WEIGHTS.season +
      irrigationScore * WEIGHTS.irrigation;
    
    console.log(`${crop.name}: Soil=${soilScore.toFixed(1)}, Budget=${budgetScore.toFixed(1)}, Rain=${rainfallScore.toFixed(1)}, Temp=${tempScore.toFixed(1)}, Season=${seasonScore}, Irrigation=${irrigationScore.toFixed(1)} => Total=${totalScore.toFixed(1)}`);
    
    // Calculate profit estimation
    const expectedRevenue = crop.yieldPerAcre * crop.pricePerQuintal;
    const estimatedProfit = expectedRevenue - crop.costPerAcre;
    const profitMargin = ((estimatedProfit / crop.costPerAcre) * 100);
    
    results.push({
      crop: crop.name,
      score: Math.round(totalScore),
      expectedYield: crop.expectedYield,
      expectedRevenue: formatCurrency(expectedRevenue),
      estimatedCost: formatCurrency(crop.costPerAcre),
      profitEstimate: estimatedProfit >= 0 ? `+${formatCurrency(estimatedProfit)} Profit` : `${formatCurrency(Math.abs(estimatedProfit))} Loss`,
      profitMargin: Math.round(profitMargin),
      marketDemand: crop.marketDemand,
      fertilizer: crop.fertilizerRecommendation.farmerFriendly,
      fertilizerDetails: crop.fertilizerRecommendation.details,
      tips: crop.tips,
      suitability: getSuitability(totalScore),
      emoji: crop.emoji,
    });
  }
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  console.log('Top recommendations:', results.slice(0, 3).map(r => `${r.crop}(${r.score})`));
  console.log('================================');
  
  return results;
}

// Get default values based on location
export function getRegionalDefaults(location: string): Partial<CropInput> {
  const locationLower = location.toLowerCase();
  
  // North India
  if (locationLower.includes('punjab') || locationLower.includes('haryana')) {
    return { rainfall: 650, temperature: 25 };
  }
  if (locationLower.includes('uttar pradesh') || locationLower.includes('up')) {
    return { rainfall: 900, temperature: 26 };
  }
  
  // South India
  if (locationLower.includes('tamil nadu') || locationLower.includes('tn')) {
    return { rainfall: 950, temperature: 29 };
  }
  if (locationLower.includes('kerala')) {
    return { rainfall: 2500, temperature: 27 };
  }
  if (locationLower.includes('karnataka')) {
    return { rainfall: 1100, temperature: 26 };
  }
  if (locationLower.includes('andhra') || locationLower.includes('telangana')) {
    return { rainfall: 800, temperature: 28 };
  }
  
  // West India
  if (locationLower.includes('maharashtra')) {
    return { rainfall: 1000, temperature: 27 };
  }
  if (locationLower.includes('gujarat')) {
    return { rainfall: 700, temperature: 28 };
  }
  if (locationLower.includes('rajasthan')) {
    return { rainfall: 400, temperature: 30 };
  }
  
  // East India
  if (locationLower.includes('west bengal') || locationLower.includes('wb')) {
    return { rainfall: 1600, temperature: 26 };
  }
  if (locationLower.includes('bihar')) {
    return { rainfall: 1100, temperature: 27 };
  }
  if (locationLower.includes('odisha') || locationLower.includes('orissa')) {
    return { rainfall: 1400, temperature: 27 };
  }
  
  // Central India
  if (locationLower.includes('madhya pradesh') || locationLower.includes('mp')) {
    return { rainfall: 1000, temperature: 26 };
  }
  
  // Default values
  return { rainfall: 1000, temperature: 25 };
}
