import {GeoJSON, MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Feature, FeatureCollection, GeoJsonProperties, Geometry,} from 'geojson'
import {Layer, Map as LeafletMap, PathOptions} from 'leaflet'
import {PropertyData, PropertySidebar} from './PropertySidebar'
import {cn} from '@/lib/utils'
import {generateMockData} from '@/mock/HousingDataGenerator'
import {useZipCodes} from '@/models/api/useAreaCodesAPI'
import {debounce} from 'lodash'
import {getSettings} from '@/components/Settings.tsx'

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

interface BoundaryLoggerProps {
    setBounds: (bounds: Bounds) => void
}

type ZipCodeMap = Map<string, Feature<Geometry, GeoJsonProperties>>

const BoundaryLogger: React.FC<BoundaryLoggerProps> = ({setBounds}) => {
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
        minLat: 48.061601,
        minLon: 11.36059,
        maxLat: 48.248925,
        maxLon: 11.722902,
    })

    const [allZipCodes, setAllZipCodes] = useState<FeatureCollection | null>(null)
    const [selectedArea, setSelectedArea] = useState<PropertyData | null>(null)
    const [selectedPlz, setSelectedPlz] = useState<string | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
    const mapRef = useRef<LeafletMap | null>(null)
    const [isInitialLoad, setIsInitialLoad] = useState(true)


    const {data: newZipCodes} = useZipCodes(bounds)

    console.log('newZipCodes:', newZipCodes);

    const [zipCodeColors, setZipCodeColors] = useState<Record<string, string>>({})

    const fetchZipCodeScores = useCallback(async (zipCodes: string[]) => {
        if (!zipCodes || zipCodes.length === 0) return;

        console.log('Fetching scores for zip codes:', zipCodes);

        try {
            const settings = getSettings();
            const response = await fetch(`/api/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: settings.workAddress,
                    travelMode: 'DRIVE',
                    zips: zipCodes,
                    weights: settings.weights,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json()
            console.log('Received score data:', data);

            const newColors: Record<string, string> = {}
            zipCodes.forEach(zip => {
                const value = Number(data[zip]) || 0
                const clampedValue = Math.min(100, Math.max(0, value))

                const red = Math.round(255 * (1 - clampedValue / 100))
                const green = Math.round(255 * (clampedValue / 100))
                const blue = 0

                const toHex = (num: number) => num.toString(16).padStart(2, '0')
                newColors[zip] = `#${toHex(red)}${toHex(green)}${toHex(blue)}`
            })

            setZipCodeColors(prev => ({...prev, ...newColors}))
        } catch (error) {
            console.error('Error fetching ZIP code scores:', error)
        }
    }, [])

    // Handle initial zip codes load and subsequent updates
    useEffect(() => {
        console.log('test2 ', newZipCodes);

        if (newZipCodes?.features) {
            console.log('test:', newZipCodes);
            setAllZipCodes(prevZipCodes => {
                if (!prevZipCodes) {
                    console.log('Initial zip codes loaded:', newZipCodes.features.length);
                    return newZipCodes;
                }

                const existingFeatures: ZipCodeMap = new Map(
                    prevZipCodes.features
                        .filter(feature => feature !== null && feature.properties !== null)
                        .map(feature => [
                            (feature as ZipCodeFeature).properties.plz,
                            feature,
                        ])
                )

                newZipCodes.features.forEach(feature => {
                    if (feature && feature.properties && 'plz' in feature.properties) {
                        const plz = (feature as ZipCodeFeature).properties.plz
                        if (!existingFeatures.has(plz)) {
                            existingFeatures.set(plz, feature)
                        }
                    }
                })
                console.log('Updated zip codes:', existingFeatures.size);
                console.log('New zip codes:', newZipCodes.features.length);

                return {
                    type: 'FeatureCollection',
                    features: Array.from(existingFeatures.values()),
                }
            })
            setIsInitialLoad(false)
        }
    }, [newZipCodes])

    // Separate effect for fetching scores
    useEffect(() => {
        if (allZipCodes?.features && !isInitialLoad) {
            console.log('Preparing to fetch scores');
            const zipCodes = allZipCodes.features
                .filter((feature): feature is ZipCodeFeature =>
                    feature !== null &&
                    feature.properties !== null &&
                    'plz' in feature.properties
                )
                .map(feature => feature.properties.plz)

            if (zipCodes.length > 0) {
                console.log('Fetching scores for', zipCodes.length, 'zip codes');
                fetchZipCodeScores(zipCodes)
            }
        }
    }, [allZipCodes, fetchZipCodeScores, isInitialLoad])

    const zipCodeStyle = (feature: Feature): PathOptions => {
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

        return {
            fillColor: zipCodeColors[plz] || '#ccc',
            weight: isSelected ? 3 : 1,
            opacity: 1,
            color: isSelected ? '#000' : '#666',
            dashArray: isSelected ? '' : '3',
            fillOpacity: isSelected ? 0.7 : 0.3,
        }
    }

    const onEachZipCode = (
        feature: Feature<Geometry, GeoJsonProperties>,
        layer: Layer
    ): void => {
        if (!feature || !feature.properties || !('plz' in feature.properties)) {
            return;
        }

        const zipFeature = feature as ZipCodeFeature
        const {plz, name} = zipFeature.properties

        layer.on({
            click: () => {
                setSelectedArea(generateMockData(plz, name))
                setSelectedPlz(plz)
                setIsSidebarOpen(true)
            },
            mouseover: e => {
                const targetLayer = e.target
                if (plz !== selectedPlz) {
                    targetLayer.setStyle({
                        weight: 2,
                        color: '#444',
                        dashArray: '',
                        fillOpacity: 0.5,
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
    }

    const handleSidebarClose = (): void => {
        setIsSidebarOpen(false)
        setSelectedPlz(null)
    }

    return (
        <div className='h-screen w-screen flex overflow-hidden z-0'>
            <div
                className={cn(
                    'flex-1 transition-all duration-300 ease-in-out',
                    isSidebarOpen && 'mr-[400px]'
                )}
            >
                <MapContainer
                    center={munichPosition}
                    zoom={12}
                    scrollWheelZoom={true}
                    className='h-full w-full'
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        maxZoom={19}
                    />
                    {allZipCodes?.features && (
                        <GeoJSON
                            key={`${selectedPlz}`}
                            data={allZipCodes}
                            style={zipCodeStyle}
                            onEachFeature={onEachZipCode}
                        />
                    )}
                    <BoundaryLogger setBounds={setBounds}/>
                </MapContainer>
            </div>

            <PropertySidebar
                isOpen={isSidebarOpen}
                onClose={handleSidebarClose}
                data={selectedArea}
            />
        </div>
    )
}