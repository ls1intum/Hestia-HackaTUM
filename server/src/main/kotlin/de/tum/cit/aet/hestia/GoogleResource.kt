package de.tum.cit.aet.hestia

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityRequest
import de.tum.cit.aet.hestia.dto.airQuality.Location
import de.tum.cit.aet.hestia.external.GoogleAirQualityClient
import de.tum.cit.aet.hestia.external.GooglePlacesClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/google")
@ApplicationScoped
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

    @GET
    @Path("/air-quality")
    @CacheResult(cacheName = "air-quality")
    fun priceIndexBuy(): String {
        return ObjectMapper().writeValueAsString(
            airQualityClient.getCurrentConditions(
                apiKey = apiKey,
                payload = AirQualityRequest(
                    location = Location(
                        latitude = 48.137154,
                        longitude = 11.576124
                    ),
                )
            )
        )
    }

    @GET
    @Path("/place/{placeId}")
    @CacheResult(cacheName = "place-details")
    fun getPlaceDetails(@PathParam("placeId") placeId: String): String {
        println("placeId: $placeId")
        Thread.sleep(1000)
        return placesClient.getPlaceDetails(
            apiKey = apiKey,
            fields = "location",
            placeId = placeId,
        )
    }
}