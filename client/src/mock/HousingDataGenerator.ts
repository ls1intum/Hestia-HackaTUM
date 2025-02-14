import PropertyData from "@/models/HousingPropertyData.ts";
import {PriceIndexValue} from "@/models/api/usePriceIndex.ts";

export const normalizeScore = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(((value - min) / (max - min)) * 10, 1), 10)
}

function createSeededRandom(seed) {
  let h = 0;
  if (typeof seed === 'string') {
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
  } else {
    h = seed | 0;
  }

  return function random() {
    h = (h * 48271) % 0x7fffffff;
    return (h & 0x7fffffff) / 0x7fffffff;
  };
}


export const generateMockData = async (plz: string, name: string, rentValues: PriceIndexValue[], buyValues: PriceIndexValue[]): Promise<PropertyData> => {
  let randomFunction = createSeededRandom(plz);

  // Generate base rent and buy prices
  const rentValue = rentValues.find(entry => entry["zip_code"] === plz);
  const rentAvg = (rentValue && !isNaN(rentValue["prize_per_sqm"]) && rentValue["prize_per_sqm"] > 0)
    ? rentValue["prize_per_sqm"] / 3.5
    : (70 + randomFunction() * 20) / 3.5;
  const buyValue = buyValues.find(entry => entry["zip_code"] === plz);
  const buyAvg = (buyValue && !isNaN(buyValue["prize_per_sqm"]) && buyValue["prize_per_sqm"] >= 0)
    ? buyValue["prize_per_sqm"]
    : 6000 + randomFunction() * 4000;

  // Calculate price scores (lower prices get better scores)
  const rentScore = normalizeScore(rentAvg, 25, 15)
  const buyScore = normalizeScore(buyAvg, 10000, 6000)

  // Generate transportation data
  const carDuration = Math.floor(15 + randomFunction() * 30)
  const publicDuration = Math.floor(carDuration * (1.2 + randomFunction() * 0.5)) // Public transport typically takes longer

  // Generate environment data
  const airQualityIndex = 5 + randomFunction() * 5
  const greenSpaces = Math.floor(3 + randomFunction() * 7)
  const noiseLevel = Math.floor(3 + randomFunction() * 7)
  const envScore =
    (normalizeScore(airQualityIndex, 5, 10) +
      normalizeScore(greenSpaces, 3, 10) +
      normalizeScore(10 - noiseLevel, 3, 10)) /
    3

  // Generate safety data
  const crimeRate = 2 + randomFunction() * 5
  const emergencyResponse = 5 + randomFunction() * 10
  const safetyScore =
    (normalizeScore(10 - crimeRate, 2, 7) +
      normalizeScore(15 - emergencyResponse, 5, 15)) /
    2

  return {
    plz,
    name,
    rentPrices: {
      average: rentAvg,
      range: `€${(rentAvg - 2).toFixed(2)} - €${(rentAvg + 3).toFixed(2)}`,
      score: rentScore,
    },
    buyPrices: {
      average: buyAvg,
      range: `€${(buyAvg - 1000).toFixed(0)} - €${(buyAvg + 1500).toFixed(0)}`,
      score: buyScore,
    },
    transportation: {
      score: 5 + randomFunction() * 5,
      stations: Math.floor(2 + randomFunction() * 5),
      busLines: Math.floor(4 + randomFunction() * 8),
      commute: {
        car: {
          duration: carDuration,
          distance: Number((carDuration * 0.6).toFixed(1)), // Rough estimate of distance based on duration
        },
        publicTransport: {
          duration: publicDuration,
          changes: Math.floor(1 + randomFunction() * 3),
        },
      },
    },
    childcare: {
      score: 5 + randomFunction() * 5,
      kindergartens: Math.floor(2 + randomFunction() * 4),
      kitas: Math.floor(3 + randomFunction() * 5),
      availablePlaces: Math.floor(50 + randomFunction() * 100),
      nearestSchoolDistance: Math.floor(0.5 + randomFunction() * 2),
    },
    environment: {
      score: envScore,
      airQualityIndex: airQualityIndex,
      greenSpaces: greenSpaces,
      noiseLevel: noiseLevel,
    },
    healthcare: {
      score: 5 + randomFunction() * 5,
      hospitals: Math.floor(1 + randomFunction() * 3),
      clinics: Math.floor(2 + randomFunction() * 4),
      pharmacies: Math.floor(3 + randomFunction() * 5),
    },
    lifestyle: {
      score: 5 + randomFunction() * 5,
      restaurants: Math.floor(5 + randomFunction() * 15),
      cafes: Math.floor(3 + randomFunction() * 8),
      shops: Math.floor(10 + randomFunction() * 20),
      gyms: Math.floor(1 + randomFunction() * 4),
    },
    safety: {
      score: safetyScore,
      crimeRate: crimeRate,
      emergencyResponseTime: emergencyResponse,
    },
  }
};
