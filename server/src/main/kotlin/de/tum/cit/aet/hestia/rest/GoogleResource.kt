package de.tum.cit.aet.hestia.rest

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityRequest
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityResponse
import de.tum.cit.aet.hestia.dto.route.DistanceMatrixDTO
import de.tum.cit.aet.hestia.external.GoogleAirQualityClient
import de.tum.cit.aet.hestia.external.GooglePlacesClient
import de.tum.cit.aet.hestia.service.NaviMatrixService
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/google")
@ApplicationScoped
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
class GoogleResource {

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

    @GET
    @Path("/air-quality")
    @CacheResult(cacheName = "air-quality")
    fun getAirQuality(@QueryParam("latitude") latitude: Double, @QueryParam("longitude") longitude: Double): AirQualityResponse {
        return airQualityClient.getCurrentConditions(
            apiKey = apiKey, payload = AirQualityRequest(
                location = Location(latitude = latitude, longitude = longitude)
            )
        )
    }

    @GET
    @Path("/place/{placeId}")
    @CacheResult(cacheName = "place-details")
    fun getPlaceDetails(@PathParam("placeId") placeId: String): Location {
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

    @POST
    @Path("/distance-matrix")
    @CacheResult(cacheName = "distance-matrix")
    fun getDistanceMatrix(data: String): Map<String, Long> {
        val dto = objectMapper.readValue(data, DistanceMatrixDTO::class.java)
        return naviMatrixService.getDistanceMatrix(
            origin = dto.origin, locations = dto.locations, mode = dto.travelMode
        )
    }
}