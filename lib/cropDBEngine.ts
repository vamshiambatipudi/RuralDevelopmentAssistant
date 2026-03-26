// Database-backed Crop Recommendation Engine
// Fetches crop profiles from Supabase and applies scoring algorithm

import { supabase } from '@/integrations/supabase/client';

export interface CropInput {
  soilType: string;
  rainfall: number;
  temperature: number;
  season: string;
  irrigationType: string;
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
}

// Feature encoding
const SOIL_ENCODING: Record<string, number> = {
  'Alluvial': 0, 'Black': 1, 'Clay': 2, 'Loamy': 3, 'Red': 4, 'Sandy': 5
};

const SEASON_ENCODING: Record<string, number> = {
  'Kharif (Monsoon)': 0, 'Rabi (Winter)': 1, 'Zaid (Summer)': 2
};

const IRRIGATION_ENCODING: Record<string, number> = {
  'Canal': 0, 'Drip': 1, 'Rainfed': 2, 'Sprinkler': 3, 'Well/Tubewell': 4
};

// Fetch crop profiles from DB
async function fetchCropProfiles() {
  const { data, error } = await supabase
    .from('crop_profiles')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Failed to fetch crop profiles:', error);
    return [];
  }
  return data || [];
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

// Score a single crop profile against input features
function scoreCrop(
  crop: {
    optimal_soil_types: string[];
    rainfall_range_min: number;
    rainfall_range_max: number;
    temp_range_min: number;
    temp_range_max: number;
    seasons: string[];
    irrigation_types: string[];
    cost_per_acre: number;
  },
  features: {
    soilCode: number;
    rainfall: number;
    temp: number;
    seasonCode: number;
    irrigationCode: number;
    budget: number;
  }
): number {
  // Weights redistributed without location (total = 1.0)
  const weights = { soil: 0.22, rainfall: 0.24, temp: 0.20, season: 0.18, irrigation: 0.10, budget: 0.06 };
  let score = 0;

  // Soil match
  const soilCodes = crop.optimal_soil_types.map(s => SOIL_ENCODING[s]).filter(c => c !== undefined);
  const soilMatch = soilCodes.includes(features.soilCode);
  const soilPosition = soilMatch ? soilCodes.indexOf(features.soilCode) : -1;
  score += (soilMatch ? (100 - soilPosition * 15) : 25) * weights.soil;

  // Rainfall
  const minRain = crop.rainfall_range_min;
  const maxRain = crop.rainfall_range_max;
  let rainfallScore = 0;
  if (features.rainfall >= minRain && features.rainfall <= maxRain) {
    const mid = (minRain + maxRain) / 2;
    const dist = Math.abs(features.rainfall - mid) / (maxRain - minRain || 1);
    rainfallScore = 100 - dist * 30;
  } else if (features.rainfall < minRain) {
    rainfallScore = Math.max(0, 70 - ((minRain - features.rainfall) / (minRain || 1)) * 100);
  } else {
    rainfallScore = Math.max(0, 70 - ((features.rainfall - maxRain) / (maxRain || 1)) * 100);
  }
  score += rainfallScore * weights.rainfall;

  // Temperature
  const minTemp = crop.temp_range_min;
  const maxTemp = crop.temp_range_max;
  let tempScore = 0;
  if (features.temp >= minTemp && features.temp <= maxTemp) {
    const mid = (minTemp + maxTemp) / 2;
    const dist = Math.abs(features.temp - mid) / (maxTemp - minTemp || 1);
    tempScore = 100 - dist * 30;
  } else {
    const tempDist = features.temp < minTemp ? (minTemp - features.temp) : (features.temp - maxTemp);
    tempScore = Math.max(0, 60 - tempDist * 8);
  }
  score += tempScore * weights.temp;

  // Season
  const seasonCodes = crop.seasons.map(s => SEASON_ENCODING[s]).filter(c => c !== undefined);
  score += (seasonCodes.includes(features.seasonCode) ? 100 : 0) * weights.season;

  // Irrigation
  const irrigCodes = crop.irrigation_types.map(i => IRRIGATION_ENCODING[i]).filter(c => c !== undefined);
  const irrigMatch = irrigCodes.includes(features.irrigationCode);
  const irrigPos = irrigMatch ? irrigCodes.indexOf(features.irrigationCode) : -1;
  score += (irrigMatch ? (100 - irrigPos * 10) : 40) * weights.irrigation;

  // Budget
  let budgetScore = 100;
  if (features.budget < crop.cost_per_acre) {
    const ratio = features.budget / crop.cost_per_acre;
    if (ratio >= 0.8) budgetScore = 85;
    else if (ratio >= 0.6) budgetScore = 60;
    else if (ratio >= 0.4) budgetScore = 35;
    else budgetScore = 10;
  }
  score += budgetScore * weights.budget;

  // Ensemble variation (Random Forest simulation)
  const variations = [0.97, 0.99, 1.0, 1.01, 1.03];
  const avgScore = variations.reduce((a, v) => a + score * v, 0) / variations.length;

  // Interaction bonuses
  let bonus = 0;
  if (soilCodes[0] === features.soilCode && features.rainfall >= minRain && features.rainfall <= maxRain) bonus += 3;
  if (seasonCodes.includes(features.seasonCode) && features.temp >= minTemp && features.temp <= maxTemp) bonus += 2;

  return Math.min(100, avgScore + bonus);
}

// Main prediction function - async because it fetches from DB
export async function predictCropRecommendations(input: CropInput): Promise<CropRecommendation[]> {
  console.log('=== DB-Backed Crop Prediction Engine ===');

  const cropProfiles = await fetchCropProfiles();
  if (cropProfiles.length === 0) {
    console.warn('No crop profiles found in database');
    return [];
  }

  const soilCode = SOIL_ENCODING[input.soilType] ?? 3;
  const seasonCode = SEASON_ENCODING[input.season] ?? 0;
  const irrigationCode = IRRIGATION_ENCODING[input.irrigationType] ?? 2;
  const features = { soilCode, rainfall: input.rainfall, temp: input.temperature, seasonCode, irrigationCode, budget: input.budget };

  const predictions: CropRecommendation[] = [];

  for (const crop of cropProfiles) {
    // Season filter
    const seasonCodes = crop.seasons.map(s => SEASON_ENCODING[s]).filter(c => c !== undefined);
    if (!seasonCodes.includes(seasonCode)) continue;

    // Budget filter
    if (input.budget < Number(crop.cost_per_acre) * 0.35) continue;

    const score = scoreCrop(crop, features);
    const expectedRevenue = Number(crop.yield_per_acre) * Number(crop.price_per_quintal);
    const profit = expectedRevenue - Number(crop.cost_per_acre);
    const profitMargin = Math.round((profit / Number(crop.cost_per_acre)) * 100);

    predictions.push({
      crop: crop.name,
      score: Math.round(score),
      expectedYield: `${crop.yield_per_acre} quintals/acre`,
      estimatedCost: formatCurrency(Number(crop.cost_per_acre)),
      expectedRevenue: formatCurrency(expectedRevenue),
      profitEstimate: profit >= 0 ? `+${formatCurrency(profit)} Profit` : `${formatCurrency(Math.abs(profit))} Loss`,
      profitMargin,
      marketDemand: crop.market_demand as 'High' | 'Medium' | 'Low',
      fertilizer: crop.fertilizer_summary,
      fertilizerDetails: crop.fertilizer_details,
      tips: crop.tips,
      suitability: getSuitabilityLabel(score),
      emoji: crop.emoji,
    });
  }

  predictions.sort((a, b) => b.score - a.score);
  console.log('Top 3:', predictions.slice(0, 3).map(p => `${p.crop}(${p.score}%)`).join(', '));
  return predictions;
}
