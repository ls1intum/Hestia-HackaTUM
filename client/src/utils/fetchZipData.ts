import { Feature, FeatureCollection } from 'geojson'

export async function fetchZipCodes() {
  try {
    const response = await fetch('../../resources/test2.geojson')
    const data: FeatureCollection = await response.json()

    // Filter features to only include ZIP codes starting with 80
    return {
      type: 'FeatureCollection',
      features: data.features.filter((feature: Feature) => {
        const plz = feature.properties?.plz || ''
        return (
          true
        )
      }),
    } as FeatureCollection
  } catch (error) {
    console.error('Error loading ZIP codes:', error)
    throw error
  }
}
