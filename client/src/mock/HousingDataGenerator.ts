
// Mock data generator remains the same
import {PropertyData} from "@/components/PropertySidebar.tsx";

export const generateMockData = (plz: string, name: string): PropertyData => ({
    plz,
    name,
    rentPrices: {
        average: 15 + Math.random() * 10,
        range: `€${(13 + Math.random() * 5).toFixed(2)} - €${(20 + Math.random() * 8).toFixed(2)}`
    },
    buyPrices: {
        average: 6000 + Math.random() * 4000,
        range: `€${(5000 + Math.random() * 2000).toFixed(0)} - €${(8000 + Math.random() * 3000).toFixed(0)}`
    },
    transportation: {
        score: 5 + Math.random() * 5,
        stations: Math.floor(2 + Math.random() * 5),
        busLines: Math.floor(4 + Math.random() * 8)
    },
    childcare: {
        kindergartens: Math.floor(2 + Math.random() * 4),
        kitas: Math.floor(3 + Math.random() * 5),
        availablePlaces: Math.floor(50 + Math.random() * 100)
    }
});