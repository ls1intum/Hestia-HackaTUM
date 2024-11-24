import PropertyData from "@/models/HousingPropertyData.ts";

const normalizeScore = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(((value - min) / (max - min)) * 10, 1), 10)
}

export const generateMockData = (plz: string, name: string): PropertyData => {
  // Generate base rent and buy prices
  const rentAvg = 15 + Math.random() * 10
  const buyAvg = 6000 + Math.random() * 4000

  // Calculate price scores (lower prices get better scores)
  const rentScore = normalizeScore(rentAvg, 25, 15)
  const buyScore = normalizeScore(buyAvg, 10000, 6000)

  // Generate transportation data
  const carDuration = Math.floor(15 + Math.random() * 30)
  const publicDuration = Math.floor(carDuration * (1.2 + Math.random() * 0.5)) // Public transport typically takes longer

  // Generate environment data
  const airQualityIndex = 5 + Math.random() * 5
  const greenSpaces = Math.floor(3 + Math.random() * 7)
  const noiseLevel = Math.floor(3 + Math.random() * 7)
  const envScore =
    (normalizeScore(airQualityIndex, 5, 10) +
      normalizeScore(greenSpaces, 3, 10) +
      normalizeScore(10 - noiseLevel, 3, 10)) /
    3

  // Generate safety data
  const crimeRate = 2 + Math.random() * 5
  const emergencyResponse = 5 + Math.random() * 10
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
      score: 5 + Math.random() * 5,
      stations: Math.floor(2 + Math.random() * 5),
      busLines: Math.floor(4 + Math.random() * 8),
      commute: {
        car: {
          duration: carDuration,
          distance: Number((carDuration * 0.6).toFixed(1)), // Rough estimate of distance based on duration
        },
        publicTransport: {
          duration: publicDuration,
          changes: Math.floor(1 + Math.random() * 3),
        },
      },
    },
    childcare: {
      score: 5 + Math.random() * 5,
      kindergartens: Math.floor(2 + Math.random() * 4),
      kitas: Math.floor(3 + Math.random() * 5),
      availablePlaces: Math.floor(50 + Math.random() * 100),
      nearestSchoolDistance: Math.floor(0.5 + Math.random() * 2),
    },
    environment: {
      score: envScore,
      airQualityIndex: airQualityIndex,
      greenSpaces: greenSpaces,
      noiseLevel: noiseLevel,
    },
    healthcare: {
      score: 5 + Math.random() * 5,
      hospitals: Math.floor(1 + Math.random() * 3),
      clinics: Math.floor(2 + Math.random() * 4),
      pharmacies: Math.floor(3 + Math.random() * 5),
    },
    lifestyle: {
      score: 5 + Math.random() * 5,
      restaurants: Math.floor(5 + Math.random() * 15),
      cafes: Math.floor(3 + Math.random() * 8),
      shops: Math.floor(10 + Math.random() * 20),
      gyms: Math.floor(1 + Math.random() * 4),
    },
    safety: {
      score: safetyScore,
      crimeRate: crimeRate,
      emergencyResponseTime: emergencyResponse,
    },
  }
}
