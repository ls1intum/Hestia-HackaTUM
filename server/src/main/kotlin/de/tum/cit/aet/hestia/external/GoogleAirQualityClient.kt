package de.tum.cit.aet.hestia.external

import de.tum.cit.aet.hestia.dto.airQuality.AirQualityRequest
import de.tum.cit.aet.hestia.dto.airQuality.AirQualityResponse
import jakarta.ws.rs.*
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient
@Produces("application/json")
@Consumes("application/json")
interface GoogleAirQualityClient {
    @POST
    @Path("/v1/currentConditions:lookup")
    fun getCurrentConditions(
        @QueryParam("key") apiKey: String,
        payload: AirQualityRequest
    ): AirQualityResponse
}