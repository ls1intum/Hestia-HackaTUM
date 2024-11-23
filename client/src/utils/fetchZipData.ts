import { Feature, FeatureCollection } from 'geojson'

export async function fetchZipCodes() {
  try {
    const response = await fetch('../../resources/plz-5stellig.geojson')
    const data: FeatureCollection = await response.json()

    // Filter features to only include ZIP codes starting with 80
    return {
      type: 'FeatureCollection',
      features: data.features.filter((feature: Feature) => {
        const plz = feature.properties?.plz || ''
        return (
          plz.startsWith('80') || plz.startsWith('81') || plz.startsWith('85')
        )
      }),
    } as FeatureCollection
  } catch (error) {
    console.error('Error loading ZIP codes:', error)
    throw error
  }
}
