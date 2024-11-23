package de.tum.cit.aet.hestia.rest

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityResponse
import de.tum.cit.aet.hestia.dto.route.DistanceMatrixDTO
import de.tum.cit.aet.hestia.service.GoogleService
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType

@Path("/google")
@ApplicationScoped
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
class GoogleResource {

    @Inject
    private lateinit var googleService: GoogleService

    @Inject
    private lateinit var objectMapper: ObjectMapper

    @GET
    @Path("/air-quality")
    @CacheResult(cacheName = "air-quality")
    fun getAirQuality(@QueryParam("latitude") latitude: Double, @QueryParam("longitude") longitude: Double): AirQualityResponse {
        return googleService.getAirQuality(Location(latitude, longitude))
    }

    @GET
    @Path("/place/{placeId}")
    @CacheResult(cacheName = "place-details")
    fun getPlaceDetails(@PathParam("placeId") placeId: String): Location {
        return googleService.getPlaceDetails(placeId)
    }

    @POST
    @Path("/distance-matrix")
    @CacheResult(cacheName = "distance-matrix")
    fun getDistanceMatrix(data: String): Map<String, Long> {
        val dto = objectMapper.readValue(data, DistanceMatrixDTO::class.java)
        return googleService.getDistanceMatrix(dto)
    }
}