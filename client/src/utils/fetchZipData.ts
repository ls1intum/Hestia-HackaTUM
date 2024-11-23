import { FeatureCollection } from 'geojson'

export async function fetchZipCodesData() {
  try {
    const response = await fetch('/test.geojson')
    const data: FeatureCollection = await response.json()

    // Filter features to only include ZIP codes starting with 80
    return {
      type: 'FeatureCollection',
      features: data.features
    } as FeatureCollection
  } catch (error) {
    console.error('Error loading ZIP codes:', error)
    throw error
  }
}
