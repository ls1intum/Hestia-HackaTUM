export default interface PropertyData {
  plz: string
  name: string
  rentPrices: {
    average: number
    range: string
    score: number // 1-10 normalized score
  }
  buyPrices: {
    average: number
    range: string
    score: number // 1-10 normalized score
  }
  transportation: {
    score: number
    stations: number
    busLines: number
    commute: {
      car: {
        duration: number // in minutes
        distance: number // in km
      }
      publicTransport: {
        duration: number // in minutes
        changes: number // number of changes/transfers
      }
    }
  }
  childcare: {
    score: number
    kindergartens: number
    kitas: number
    availablePlaces: number
    nearestSchoolDistance?: number
  }
  environment: {
    score: number
    airQualityIndex?: number
    greenSpaces?: number
    noiseLevel?: number
  }
  healthcare: {
    score: number
    hospitals?: number
    clinics?: number
    pharmacies?: number
  }
  lifestyle: {
    score: number
    restaurants?: number
    cafes?: number
    shops?: number
    gyms?: number
  }
  safety: {
    score: number
    crimeRate?: number
    emergencyResponseTime?: number
  }
}
