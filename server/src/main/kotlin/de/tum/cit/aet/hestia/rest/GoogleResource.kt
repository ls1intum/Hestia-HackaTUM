package de.tum.cit.aet.hestia.rest

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityRequest
import de.tum.cit.aet.hestia.dto.route.DistanceMatrixDTO
import de.tum.cit.aet.hestia.dto.route.RouteTravelMode
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
    lateinit var apiKey: String

    @Inject
    @RestClient
    lateinit var airQualityClient: GoogleAirQualityClient

    @Inject
    @RestClient
    lateinit var placesClient: GooglePlacesClient

    @Inject
    lateinit var naviMatrixService: NaviMatrixService

    @Inject
    lateinit var objectMapper: ObjectMapper

    @GET
    @Path("/air-quality")
    @CacheResult(cacheName = "air-quality")
    fun priceIndexBuy(location: Location): String {
        return ObjectMapper().writeValueAsString(
            airQualityClient.getCurrentConditions(
                apiKey = apiKey,
                payload = AirQualityRequest(
                    location = location
                )
            )
        )
    }

    @GET
    @Path("/place/{placeId}")
    @CacheResult(cacheName = "place-details")
    fun getPlaceDetails(@PathParam("placeId") placeId: String): String {
        return placesClient.getPlaceDetails(
            apiKey = apiKey,
            fields = "location",
            placeId = placeId,
        )
    }

    @POST
    @Path("/distance-matrix")
    @CacheResult(cacheName = "distance-matrix")
    fun getDistanceMatrix(data: String): String {
        val dto = objectMapper.readValue(data, DistanceMatrixDTO::class.java)
        return objectMapper.writeValueAsString(
            naviMatrixService.getDistanceMatrix(
                origin = dto.origin,
                locations = dto.locations,
                mode = RouteTravelMode.DRIVE
            )
        )
    }
}