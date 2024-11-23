import {
    GeoJSON,
    MapContainer,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { PathOptions, Map as LeafletMap, Layer } from "leaflet";
import {PropertyData, PropertySidebar} from "./PropertySidebar";
import { cn } from "@/lib/utils";
import { generateMockData } from "@/mock/HousingDataGenerator";
import { useZipCodes } from "@/models/api/useAreaCodesAPI";
import { debounce } from "lodash";

interface ZipCodeFeature extends Feature {
    properties: {
        plz: string;
        name: string;
    };
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

type ZipCodeMap = Map<string, Feature<Geometry, GeoJsonProperties>>;

const MIN_ZOOM_LEVEL = 12; // Adjust this value based on your needs

const BoundaryLogger: React.FC<BoundaryLoggerProps> = ({ setBounds }) => {
    const updateBounds = useCallback(
      debounce((map: LeafletMap) => {
          if (map.getZoom() >= MIN_ZOOM_LEVEL) {
              const bounds = map.getBounds();
              setBounds({
                  minLat: bounds.getSouth(),
                  maxLat: bounds.getNorth(),
                  minLon: bounds.getWest(),
                  maxLon: bounds.getEast(),
              });
          }
      }, 300),
      [setBounds]
    );

    const map = useMapEvents({
        moveend: () => updateBounds(map),
        zoomend: () => updateBounds(map),
    });

    return null;
};

export function HeatMap() {
    const munichPosition: [number, number] = [48.1351, 11.582];
    const [bounds, setBounds] = useState<Bounds>({
        minLat: 48.061601,
        minLon: 11.36059,
        maxLat: 48.248925,
        maxLon: 11.722902,
    });

    const [allZipCodes, setAllZipCodes] = useState<FeatureCollection | null>(null);
    const [selectedArea, setSelectedArea] = useState<PropertyData | null>(null);
    const [selectedPlz, setSelectedPlz] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const mapRef = useRef<LeafletMap | null>(null);

    const { data: newZipCodes } = useZipCodes(bounds);

    useEffect(() => {
        if (newZipCodes) {
            setAllZipCodes((prevZipCodes) => {
                if (!prevZipCodes) return newZipCodes;

                const existingFeatures: ZipCodeMap = new Map(
                  prevZipCodes.features.map((feature) => [
                      (feature as ZipCodeFeature).properties.plz,
                      feature,
                  ])
                );

                newZipCodes.features.forEach((feature) => {
                    const plz = (feature as ZipCodeFeature).properties.plz;
                    if (!existingFeatures.has(plz)) {
                        existingFeatures.set(plz, feature);
                    }
                });

                return {
                    type: "FeatureCollection",
                    features: Array.from(existingFeatures.values()),
                };
            });
        }
    }, [newZipCodes]);

    const getColor = (plz: string): string => {
        const value = parseInt(plz.slice(-2), 10);
        if (value < 20) return "#fee5d9";
        if (value < 40) return "#fcae91";
        if (value < 60) return "#fb6a4a";
        if (value < 80) return "#de2d26";
        return "#a50f15";
    };

    const zipCodeStyle = (feature: Feature<Geometry, GeoJsonProperties>): PathOptions => {
        const zipFeature = feature as ZipCodeFeature;
        const isSelected = zipFeature.properties.plz === selectedPlz;

        return {
            fillColor: getColor(zipFeature.properties.plz),
            weight: isSelected ? 3 : 1,
            opacity: 1,
            color: isSelected ? "#000" : "#666",
            dashArray: isSelected ? "" : "3",
            fillOpacity: isSelected ? 0.7 : 0.3,
        };
    };

    const onEachZipCode = (feature: Feature<Geometry, GeoJsonProperties>, layer: Layer): void => {
        const zipFeature = feature as ZipCodeFeature;
        const { plz, name } = zipFeature.properties;

        layer.on({
            click: () => {
                setSelectedArea(generateMockData(plz, name));
                setSelectedPlz(plz);
                setIsSidebarOpen(true);
            },
            mouseover: (e) => {
                const targetLayer = e.target as Layer;
                if (plz !== selectedPlz) {
                    // @ts-ignore
                    targetLayer.setStyle({
                        weight: 2,
                        color: "#444",
                        dashArray: "",
                        fillOpacity: 0.5,
                    });
                }
                // @ts-ignore
                targetLayer.bringToFront();
            },
            mouseout: (e) => {
                const targetLayer = e.target as Layer;
                if (plz !== selectedPlz) {
                    // @ts-ignore
                    targetLayer.setStyle(zipCodeStyle(feature));
                }
            },
        });
    };

    const handleSidebarClose = (): void => {
        setIsSidebarOpen(false);
        setSelectedPlz(null);
    };

    return (
      <div className="h-screen w-screen flex overflow-hidden">
          <div
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              isSidebarOpen && "mr-[400px]"
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
                      style={(feature) => zipCodeStyle(feature)}
                      onEachFeature={(feature, layer) => onEachZipCode(feature, layer)}
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
    );
}
