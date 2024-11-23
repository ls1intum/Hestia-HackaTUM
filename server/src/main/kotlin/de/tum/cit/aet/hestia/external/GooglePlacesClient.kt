package de.tum.cit.aet.hestia.external

import jakarta.ws.rs.*
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient
@Produces("application/json")
@Consumes("application/json")
interface GooglePlacesClient {
    @GET
    @Path("/v1/places/{placeId}")
    fun getPlaceDetails(
        @QueryParam("key") apiKey: String,
        @QueryParam("fields") fields: String,
        @PathParam("placeId") placeId: String
    ): String
}