import { GeoJSON, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { Layer, Map as LeafletMap, PathOptions } from 'leaflet'
import { PropertySidebar } from './PropertySidebar'
import { cn } from '@/lib/utils'
import { generateMockData } from '@/mock/HousingDataGenerator'
import { useZipCodes } from '@/models/api/useAreaCodesAPI'
import { debounce } from 'lodash'
import PropertyData from '@/models/HousingPropertyData.ts'
import { calculateOverallScore } from '@/utils/calculateScore.ts'
import { getTileColorForScore } from '@/utils/colorCoding.ts'
import {fetchPriceIndex, fetchPriceIndexRent} from "@/models/api/usePriceIndex.ts";

interface ZipCodeFeature extends Feature {
  properties: {
    plz: string
    name: string
  }
}

interface Bounds {
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
}

interface ZipCodeData {
  mockData: PropertyData
  score: number
}

const BoundaryLogger = ({ setBounds }) => {
  const updateBounds = useCallback(
    debounce((map: LeafletMap) => {
      const bounds = map.getBounds()
      setBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLon: bounds.getWest(),
        maxLon: bounds.getEast(),
      })
    }, 300),
    [setBounds]
  )

  const map = useMapEvents({
    moveend: () => updateBounds(map),
    zoomend: () => updateBounds(map),
  })

  return null
}

export function HeatMap() {
  const munichPosition: [number, number] = [48.1351, 11.582]
  const [bounds, setBounds] = useState<Bounds>({
    minLat: 47.951075481734236,
    minLon: 11.33892059326172,
    maxLat: 48.343928144639065,
    maxLon: 11.78112030029297,
  })

  const [selectedPlz, setSelectedPlz] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const mapRef = useRef<LeafletMap | null>(null)
  const [displayedFeatures, setDisplayedFeatures] = useState<Feature[]>([])

  // Store both mock data and scores
  const [zipCodeData, setZipCodeData] = useState<Record<string, ZipCodeData>>(
    {}
  )

  // Fetch zip codes data
  const { data: zipCodes } = useZipCodes(bounds)

  useEffect(() => {
    if (zipCodes?.features) {
      // Merge new features with existing ones, removing duplicates
      const merged = [...displayedFeatures, ...zipCodes.features]
      const uniqueFeatures = merged.filter(
        (feature, index, self) =>
          index ===
          self.findIndex(
            f =>
              f.properties &&
              'plz' in f.properties &&
              feature.properties &&
              'plz' in feature.properties &&
              f.properties.plz === feature.properties.plz
          )
      )
      setDisplayedFeatures(uniqueFeatures)
    }
  }, [displayedFeatures, zipCodes])

  // Generate mock data and calculate scores for new zip codes only
  useEffect(() => {
    const fetchData = async () => {
      if (zipCodes?.features) {
        const newData: Record<string, ZipCodeData> = { ...zipCodeData };
        let hasNewData = false;

        const rentValues = (await fetchPriceIndexRent({ estateType: 'houses' })).values;
        const buyValues = (await fetchPriceIndex({ estateType: 'houses' })).values;

        for (const feature of zipCodes.features) {
          if (feature?.properties && 'plz' in feature.properties) {
            const zipFeature = feature as ZipCodeFeature;
            const plz = zipFeature.properties.plz;

            // Only generate data if we haven't already done so for this zip code
            if (!newData[plz]) {
              try {
                const mockData = await generateMockData(
                  zipFeature.properties.plz,
                  zipFeature.properties.name,
                  rentValues,
                  buyValues
                );
                const score = calculateOverallScore(mockData);
                console.log(score);
                newData[plz] = { mockData, score };
                hasNewData = true;
              } catch (error) {
                console.error(`Failed to fetch data for PLZ: ${plz}`, error);
              }
            }
          }
        }

        // Only update state if we actually generated new data
        if (hasNewData) {
          setZipCodeData(newData);
        }
      }
    };

    fetchData(); // Call the async function
  }, [zipCodes, zipCodeData]);


  // Handle initial zip codes load and subsequent updates

  const zipCodeStyle = useCallback(
    (feature: Feature): PathOptions => {
      if (!feature || !feature.properties || !('plz' in feature.properties)) {
        return {
          fillColor: '#ccc',
          weight: 1,
          opacity: 1,
          color: '#666',
          dashArray: '3',
          fillOpacity: 0.3,
        }
      }

      const zipFeature = feature as ZipCodeFeature
      const plz = zipFeature.properties.plz
      const isSelected = plz === selectedPlz
      const score = zipCodeData[plz]?.score ?? 5 // Default score of 5 if not calculated yet

      return {
        fillColor: getTileColorForScore(score),
        weight: isSelected ? 3 : 1,
        opacity: 1,
        color: isSelected ? '#000' : '#555',
        dashArray: isSelected ? '' : '3',
        fillOpacity: isSelected ? 0.8 : 0.4,
      }
    },
    [selectedPlz, zipCodeData]
  )

  const onEachZipCode = useCallback(
    (feature: Feature<Geometry, GeoJsonProperties>, layer: Layer): void => {
      if (!feature || !feature.properties || !('plz' in feature.properties)) {
        return
      }

      const zipFeature = feature as ZipCodeFeature
      const { plz } = zipFeature.properties

      layer.on({
        click: () => {
          // Use the stored mock data instead of generating new data
          setSelectedPlz(plz)
          setIsSidebarOpen(true)
        },
        mouseover: e => {
          const targetLayer = e.target
          if (plz !== selectedPlz) {
            targetLayer.setStyle({
              weight: 2,
              color: '#333',
              dashArray: '',
              fillOpacity: 0.6,
            })
          }
          targetLayer.bringToFront()
        },
        mouseout: e => {
          const targetLayer = e.target
          if (plz !== selectedPlz) {
            targetLayer.setStyle({
              weight: 1,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.3,
            })
          }
        },
      })
    },
    [selectedPlz, zipCodeData]
  )

  const handleSidebarClose = useCallback((): void => {
    setIsSidebarOpen(false)
    setSelectedPlz(null)
  }, [])

  return (
    <div className='h-screen w-screen flex overflow-hidden z-0'>
      <div
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out',
          isSidebarOpen && 'mr-[450px]'
        )}
      >
        <MapContainer
          center={munichPosition}
          zoom={12}
          zoomControl={false}
          scrollWheelZoom={true}
          className='h-full w-full'
          ref={mapRef}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
            keepBuffer={200}
          />
          {zipCodes && (
            <GeoJSON
              key={`${selectedPlz}`}
              data={zipCodes}
              style={zipCodeStyle}
              onEachFeature={onEachZipCode}
            />
          )}
          <BoundaryLogger setBounds={setBounds} />
        </MapContainer>
      </div>

      <PropertySidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        data={zipCodeData[selectedPlz ?? '']?.mockData ?? null}
      />
    </div>
  )
}
