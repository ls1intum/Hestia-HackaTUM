package de.tum.cit.aet.hestia.service

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.route.*
import de.tum.cit.aet.hestia.external.GoogleRoutesClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@ApplicationScoped
class NaviMatrixService {

    @Inject
    @ConfigProperty(name = "hestia.google.api.key")
    private lateinit var apiKey: String

    @Inject
    @RestClient
    private lateinit var routesClient: GoogleRoutesClient

    @Inject
    private lateinit var objectMapper: ObjectMapper


    @CacheResult(cacheName = "navi-matrix-service")
    fun getDistanceMatrix(origin: Location, locations: List<String>, mode: RouteTravelMode): Map<String, Long> {
        // For each target locations, calculate the distance from the origin via the Google Maps API
        // Return a map with the target location as key and the distance as value
        // Do this in parallel to speed up the process. One way to do this is to use the Kotlin coroutines library.
        // The Google Maps API is a REST API. You can use the Quarkus REST client to call the API.

        val input: RouteMatrixRequest = RouteMatrixRequest(
            origins = listOf(
                RouteMatrixOrigin(
                    Waypoint(
                        location = LatLng(
                            origin,
                            heading = null
                        ),
                        via = null,
                        vehicleStopover = null,
                        sideOfRoad = null,
                        placeId = null,
                        address = null
                    ),
                    routeModifiers = null
                )
            ),
            destinations = locations.map {
                RouteMatrixDestination(
                    Waypoint(
                        placeId = it,
                        via = null,
                        vehicleStopover = null,
                        sideOfRoad = null,
                        location = null,
                        address = null
                    )
                )
            },
            travelMode = mode,
            routingPreference = if (mode != RouteTravelMode.WALK && mode != RouteTravelMode.BICYCLE && mode != RouteTravelMode.TRANSIT) RoutingPreference.TRAFFIC_UNAWARE else null,
            departureTime = null,
            arrivalTime = null,
            languageCode = null,
            regionCode = null,
            units = null,
            extraComputations = null,
            trafficModel = null,
            transitPreferences = null
        )

        val routes = routesClient.getPlaceDetails(apiKey, "*", input)

        return routes.map {
            locations.get(it.destinationIndex) to it.duration.substring(0, it.duration.length - 1).toLong()
        }.toMap()
    }


}
