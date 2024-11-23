package de.tum.cit.aet.hestia

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityRequest
import de.tum.cit.aet.hestia.dto.airQuality.Location
import de.tum.cit.aet.hestia.external.GoogleAirQualityClient
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/google")
@ApplicationScoped
class GoogleResource {

    @Inject
    @ConfigProperty(name = "hestia.google.api.key")
    lateinit var apiKey: String

    @Inject
    @RestClient
    lateinit var airQualityClient: GoogleAirQualityClient

    @GET
    @Path("/air-quality")
    @Produces(MediaType.APPLICATION_JSON)
    // @CacheResult(cacheName = "zip-code-prices-buy")
    fun priceIndexBuy(): String {
        println("apiKey: $apiKey")
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
}