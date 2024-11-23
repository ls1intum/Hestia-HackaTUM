import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { Feature, FeatureCollection } from 'geojson'
import { PathOptions } from 'leaflet'
import { fetchZipCodes } from '../utils/fetchZipData'

interface ZipCodeFeature extends Feature {
  properties: {
    plz: string
    name: string
  }
}

export function Map() {
  const munichPosition: [number, number] = [48.1351, 11.582]
  const [zipCodes, setZipCodes] = useState<FeatureCollection | null>(null)
  const [, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadZipCodes = async () => {
      try {
        setIsLoading(true)
        const data = await fetchZipCodes()
        setZipCodes(data)
      } catch (err) {
        setError('Failed to load ZIP codes')
        console.error('Error loading ZIP codes:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadZipCodes()
  }, [])

  // Function to generate a color based on ZIP code
  const getColor = (plz: string): string => {
    // Convert last two digits of ZIP code to number for color variation
    const value = parseInt(plz.slice(-2), 10)

    // Create different color ranges
    if (value < 20) return '#fee5d9'
    if (value < 40) return '#fcae91'
    if (value < 60) return '#fb6a4a'
    if (value < 80) return '#de2d26'
    return '#a50f15'
  }

  const zipCodeStyle = (feature: ZipCodeFeature): PathOptions => {
    return {
      fillColor: getColor(feature.properties.plz),
      weight: 1,
      opacity: 1,
      color: '#666',
      dashArray: '3',
      fillOpacity: 0.3,
    }
  }

  const onEachZipCode = (feature: ZipCodeFeature, layer: L.Layer) => {
    const { plz, name } = feature.properties

    layer.bindPopup(`
      <strong>PLZ: ${plz}</strong>
      ${name ? `<br>Area: ${name}` : ''}
    `)

    layer.on({
      mouseover: e => {
        const layer = e.target
        layer.setStyle({
          weight: 3,
          dashArray: '',
          fillOpacity: 0.7,
        })
        layer.bringToFront()
      },
      mouseout: e => {
        const layer = e.target
        layer.setStyle({
          weight: 1,
          dashArray: '3',
          fillOpacity: 0.3,
        })
      },
    })
  }

  return (
    <div className='h-screen w-screen'>
      <MapContainer
        center={munichPosition}
        zoom={11}
        scrollWheelZoom={true}
        className='h-full z-30'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {zipCodes && (
          <GeoJSON
            data={zipCodes}
            style={feature => zipCodeStyle(feature as ZipCodeFeature)}
            onEachFeature={(feature, layer) =>
              onEachZipCode(feature as ZipCodeFeature, layer)
            }
          />
        )}
      </MapContainer>
    </div>
  )
}
