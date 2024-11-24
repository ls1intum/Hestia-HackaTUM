import PropertyData from "@/models/HousingPropertyData.ts";

export const calculateOverallScore = (data: PropertyData) => {
  const weights = {
    rentPrices: 0.25, // Increased weight for price
    buyPrices: 0.15, // Increased weight for price
    transportation: 0.15,
    childcare: 0.1,
    environment: 0.1,
    healthcare: 0.1,
    lifestyle: 0.05,
    safety: 0.1,
  }

  return (
    data.rentPrices.score * weights.rentPrices +
    data.buyPrices.score * weights.buyPrices +
    data.transportation.score * weights.transportation +
    data.childcare.score * weights.childcare +
    data.environment.score * weights.environment +
    data.healthcare.score * weights.healthcare +
    data.lifestyle.score * weights.lifestyle +
    data.safety.score * weights.safety
  )
}