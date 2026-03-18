// Government Schemes Data - now reads from database
// Keep interfaces and utility functions for compatibility

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: 'farmers' | 'rural' | 'women' | 'students' | 'elderly';
  eligibility: {
    criteria: string[];
    farmerTypes?: string[];
    minLandSize?: number;
    maxLandSize?: number;
    states?: string[];
    ageMin?: number;
    ageMax?: number;
    gender?: 'male' | 'female' | 'all';
    incomeLimit?: number;
  };
  benefits: string;
  applicationProcess: string[];
  documentsRequired: string[];
  link: string;
  helpline?: string;
  lastUpdated: string;
}

export interface UserProfile {
  farmerType?: string;
  landSize?: number;
  state?: string;
  age?: number;
  gender?: string;
  annualIncome?: number;
}

// Legacy static data kept as fallback - will be empty since we now use DB
export const schemesDatabase: Scheme[] = [];

// Convert DB row to Scheme interface
export function dbRowToScheme(row: any): Scheme {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    eligibility: row.eligibility || { criteria: [] },
    benefits: row.benefits,
    applicationProcess: row.application_process || [],
    documentsRequired: row.documents_required || [],
    link: row.link,
    helpline: row.helpline || undefined,
    lastUpdated: row.updated_at,
  };
}

// Check if user is eligible for a scheme
export function checkEligibility(scheme: Scheme, profile: UserProfile): {
  eligible: boolean;
  matchScore: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let matchScore = 100;

  if (scheme.eligibility.farmerTypes && profile.farmerType) {
    if (!scheme.eligibility.farmerTypes.includes(profile.farmerType)) {
      matchScore -= 30;
      reasons.push(`Farmer type "${profile.farmerType}" may not be eligible`);
    }
  }

  if (scheme.eligibility.maxLandSize && profile.landSize) {
    if (profile.landSize > scheme.eligibility.maxLandSize) {
      matchScore -= 40;
      reasons.push(`Land size exceeds maximum limit of ${scheme.eligibility.maxLandSize} acres`);
    }
  }

  if (scheme.eligibility.minLandSize && profile.landSize) {
    if (profile.landSize < scheme.eligibility.minLandSize) {
      matchScore -= 40;
      reasons.push(`Land size below minimum requirement of ${scheme.eligibility.minLandSize} acres`);
    }
  }

  if (scheme.eligibility.ageMin && profile.age) {
    if (profile.age < scheme.eligibility.ageMin) {
      matchScore -= 50;
      reasons.push(`Age should be at least ${scheme.eligibility.ageMin} years`);
    }
  }

  if (scheme.eligibility.ageMax && profile.age) {
    if (profile.age > scheme.eligibility.ageMax) {
      matchScore -= 50;
      reasons.push(`Age should not exceed ${scheme.eligibility.ageMax} years`);
    }
  }

  if (scheme.eligibility.gender && scheme.eligibility.gender !== 'all' && profile.gender) {
    if (profile.gender.toLowerCase() !== scheme.eligibility.gender) {
      matchScore -= 100;
      reasons.push(`This scheme is only for ${scheme.eligibility.gender} applicants`);
    }
  }

  if (scheme.eligibility.incomeLimit && profile.annualIncome) {
    if (profile.annualIncome > scheme.eligibility.incomeLimit) {
      matchScore -= 40;
      reasons.push(`Annual income exceeds limit of ₹${scheme.eligibility.incomeLimit.toLocaleString()}`);
    }
  }

  return {
    eligible: matchScore >= 50,
    matchScore: Math.max(0, matchScore),
    reasons: reasons.length > 0 ? reasons : ['You appear to meet the basic eligibility criteria'],
  };
}

// Filter schemes by category and eligibility (works with any scheme array)
export function filterSchemes(
  schemes: Scheme[],
  category: string,
  searchQuery: string,
  profile?: UserProfile
): Array<Scheme & { eligibilityResult?: ReturnType<typeof checkEligibility> }> {
  let filtered = schemes;

  if (category !== 'all') {
    filtered = filtered.filter(s => s.category === category);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );
  }

  if (profile && Object.keys(profile).length > 0) {
    return filtered.map(scheme => ({
      ...scheme,
      eligibilityResult: checkEligibility(scheme, profile),
    })).sort((a, b) => (b.eligibilityResult?.matchScore || 0) - (a.eligibilityResult?.matchScore || 0));
  }

  return filtered;
}
