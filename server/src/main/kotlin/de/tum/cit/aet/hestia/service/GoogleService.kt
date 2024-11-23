package de.tum.cit.aet.hestia.service

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityRequest
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityResponse
import de.tum.cit.aet.hestia.dto.route.DistanceMatrixDTO
import de.tum.cit.aet.hestia.external.GoogleAirQualityClient
import de.tum.cit.aet.hestia.external.GooglePlacesClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@ApplicationScoped
class GoogleService {

    @Inject
    @ConfigProperty(name = "hestia.google.api.key")
    private lateinit var apiKey: String

    @Inject
    @RestClient
    private lateinit var airQualityClient: GoogleAirQualityClient

    @Inject
    @RestClient
    private lateinit var placesClient: GooglePlacesClient

    @Inject
    private lateinit var naviMatrixService: NaviMatrixService

    @Inject
    private lateinit var objectMapper: ObjectMapper

    @CacheResult(cacheName = "air-quality")
    fun getAirQuality(location: Location): AirQualityResponse {
        return airQualityClient.getCurrentConditions(
            apiKey = apiKey, payload = AirQualityRequest(
                location = location
            )
        )
    }

    @CacheResult(cacheName = "place-details")
    fun getPlaceDetails(placeId: String): Location {
        val jsonString = placesClient.getPlaceDetails(
            apiKey = apiKey,
            fields = "location",
            placeId = placeId,
        )
        val rootNode = objectMapper.readTree(jsonString)

        val locationNode = rootNode.get("location")
        val location = objectMapper.treeToValue(locationNode, Location::class.java)

        return location
    }

    @CacheResult(cacheName = "distance-matrix")
    fun getDistanceMatrix(dto: DistanceMatrixDTO): Map<String, Long> {
        return naviMatrixService.getDistanceMatrix(
            origin = dto.origin, locations = dto.locations, mode = dto.travelMode
        )
    }
}