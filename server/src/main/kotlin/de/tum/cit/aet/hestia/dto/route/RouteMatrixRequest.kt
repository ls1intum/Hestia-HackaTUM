package de.tum.cit.aet.hestia.dto.route

import de.tum.cit.aet.hestia.dto.Location

data class RouteMatrixRequest(
    val origins: List<RouteMatrixOrigin>,
    val destinations: List<RouteMatrixDestination>,
    val travelMode: RouteTravelMode,
    val routingPreference: RoutingPreference?,
    val departureTime: String?,
    val arrivalTime: String?,
    val languageCode: String?,
    val regionCode: String?,
    val units: Units?,
    val extraComputations: List<ExtraComputation>?,
    val trafficModel: TrafficModel?,
    val transitPreferences: TransitPreferences?
)

data class RouteMatrixOrigin(
    val waypoint: Waypoint,
    val routeModifiers: RouteModifiers?
)

data class RouteMatrixDestination(
    val waypoint: Waypoint
)

data class Waypoint(
    val via: Boolean?,
    val vehicleStopover: Boolean?,
    val sideOfRoad: Boolean?,
    val location: LatLng?,
    val placeId: String?,
    val address: String?
)

data class LatLng(
    val latLng: Location?,
    val heading: Int?
)

data class RouteModifiers(
    val avoidTolls: Boolean?,
    val avoidHighways: Boolean?,
    val avoidFerries: Boolean?,
    val avoidIndoor: Boolean?
)

enum class RouteTravelMode {
    TRAVEL_MODE_UNSPECIFIED, DRIVE, BICYCLE, WALK, TWO_WHEELER, TRANSIT
}

enum class RoutingPreference {
    ROUTING_PREFERENCE_UNSPECIFIED, TRAFFIC_UNAWARE, TRAFFIC_AWARE, TRAFFIC_AWARE_OPTIMAL
}

enum class Units {
    UNITS_UNSPECIFIED, METRIC, IMPERIAL
}

enum class ExtraComputation {
    EXTRA_COMPUTATION_UNSPECIFIED, TOLLS
}

enum class TrafficModel {
    TRAFFIC_MODEL_UNSPECIFIED, BEST_GUESS, OPTIMISTIC, PESSIMISTIC
}

data class TransitPreferences(
    val allowedTravelModes: List<TransitTravelMode>?,
    val routingPreference: TransitRoutingPreference?
)

enum class TransitTravelMode {
    TRANSIT_TRAVEL_MODE_UNSPECIFIED,
    BUS,
    SUBWAY,
    TRAIN,
    LIGHT_RAIL,
    RAIL
}

enum class TransitRoutingPreference {
    TRANSIT_ROUTING_PREFERENCE_UNSPECIFIED,
    LESS_WALKING,
    FEWER_TRANSFERS
}
