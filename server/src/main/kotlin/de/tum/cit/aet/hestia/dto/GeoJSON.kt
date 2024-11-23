package de.tum.cit.aet.hestia.dto

data class GeoJSON(
    val type: String, // "FeatureCollection"
    val features: List<Feature>
)

data class Feature(
    val type: String, // "Feature"
    val geometry: Geometry,
    val properties: Map<String, Any>? // Key-value pairs for additional data
)

data class Geometry(
    val type: String, // Geometry type, e.g., "Point", "Polygon"
    val coordinates: Any // Coordinates array, could be List<Double>, List<List<Double>>, etc.
)