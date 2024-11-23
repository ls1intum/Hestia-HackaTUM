import {GeoJSON, MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import {useCallback, useRef, useState, useEffect} from 'react'
import {Feature, FeatureCollection} from 'geojson'
import {PathOptions, Map as LeafletMap} from 'leaflet'
import {PropertySidebar} from './PropertySidebar'
import {cn} from '@/lib/utils'
import {generateMockData} from "@/mock/HousingDataGenerator"
import {useZipCodes} from "@/models/api/useAreaCodesAPI"
import {debounce} from "lodash"

interface ZipCodeFeature extends Feature {
    properties: {
        plz: string;
        name: string;
    }
}

interface Bounds {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
}

interface BoundaryLoggerProps {
    setBounds: (bounds: Bounds) => void;
}

type ZipCodeMap = Map<string, Feature>;

const MIN_ZOOM_LEVEL = 12;  // Adjust this value based on your needs

const BoundaryLogger: React.FC<BoundaryLoggerProps> = ({ setBounds }) => {
  const updateBounds = useCallback(
    debounce((map: LeafletMap) => {
      // Only update bounds if zoom level is sufficient
      if (map.getZoom() >= MIN_ZOOM_LEVEL) {
        const bounds = map.getBounds();
        setBounds({
          minLat: bounds.getSouth(),
          maxLat: bounds.getNorth(),
          minLon: bounds.getWest(),
          maxLon: bounds.getEast()
        });
      }
    }, 300),
    [setBounds]
  );

  const map = useMapEvents({
    moveend: () => {
      updateBounds(map);
    },
    zoomend: () => {
      updateBounds(map);
    }
  });

  return null;
};

export function HeatMap() {
    const munichPosition: [number, number] = [48.1351, 11.5820]
    const [bounds, setBounds] = useState<Bounds>({
        minLat: 48.061601,
        minLon: 11.360590,
        maxLat: 48.248925,
        maxLon: 11.722902,
    })

    const [allZipCodes, setAllZipCodes] = useState<FeatureCollection | null>(null)
    const [selectedArea, setSelectedArea] = useState<any>(null)
    const [selectedPlz, setSelectedPlz] = useState<string | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
    const mapRef = useRef<LeafletMap | null>(null)

    const {
        data: newZipCodes,
        isLoading,
        isError,
        error
    } = useZipCodes(bounds)

    // Use useEffect to merge new zip codes when they arrive
    useEffect(() => {
        if (newZipCodes) {
            setAllZipCodes((prevZipCodes) => {
                if (!prevZipCodes) return newZipCodes;

                const existingFeatures: ZipCodeMap = new Map(
                    prevZipCodes.features.map(feature => [
                        (feature as ZipCodeFeature).properties.plz,
                        feature
                    ])
                );

                newZipCodes.features.forEach(feature => {
                    const plz = (feature as ZipCodeFeature).properties.plz;
                    if (!existingFeatures.has(plz)) {
                        existingFeatures.set(plz, feature);
                    }
                });

                return {
                    type: 'FeatureCollection',
                    features: Array.from(existingFeatures.values())
                };
            });
        }
    }, [newZipCodes]);

    const getColor = (plz: string): string => {
        const value = parseInt(plz.slice(-2), 10)
        if (value < 20) return '#fee5d9'
        if (value < 40) return '#fcae91'
        if (value < 60) return '#fb6a4a'
        if (value < 80) return '#de2d26'
        return '#a50f15'
    }

    const zipCodeStyle = (feature: ZipCodeFeature): PathOptions => {
        const isSelected = feature.properties.plz === selectedPlz

        return {
            fillColor: getColor(feature.properties.plz),
            weight: isSelected ? 3 : 1,
            opacity: 1,
            color: isSelected ? '#000' : '#666',
            dashArray: isSelected ? '' : '3',
            fillOpacity: isSelected ? 0.7 : 0.3
        }
    }

    const onEachZipCode = (feature: ZipCodeFeature, layer: L.Layer): void => {
        const {plz, name} = feature.properties

        layer.on({
            click: () => {
                setSelectedArea(generateMockData(plz, name))
                setSelectedPlz(plz)
                setIsSidebarOpen(true)
            },
            mouseover: (e) => {
                const layer = e.target
                if (feature.properties.plz !== selectedPlz) {
                    layer.setStyle({
                        weight: 2,
                        color: '#444',
                        dashArray: '',
                        fillOpacity: 0.5
                    })
                }
                layer.bringToFront()
            },
            mouseout: (e) => {
                const layer = e.target
                if (feature.properties.plz !== selectedPlz) {
                    layer.setStyle(zipCodeStyle(feature))
                }
            }
        })
    }

    const handleSidebarClose = (): void => {
        setIsSidebarOpen(false)
        setSelectedPlz(null)
    }

    return (
        <div className="h-screen w-screen flex overflow-hidden">
            <div
                className={cn(
                    "flex-1 transition-all duration-300 ease-in-out",
                    isSidebarOpen && 'mr-[400px]'
                )}
            >
                <MapContainer
                    center={munichPosition}
                    zoom={12}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {allZipCodes && (
                        <GeoJSON
                            key={`${selectedPlz}-${allZipCodes.features.length}`}
                            data={allZipCodes}
                            style={(feature) => zipCodeStyle(feature as ZipCodeFeature)}
                            onEachFeature={(feature, layer) =>
                                onEachZipCode(feature as ZipCodeFeature, layer)
                            }
                        />
                    )}
                    <BoundaryLogger setBounds={setBounds} />
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