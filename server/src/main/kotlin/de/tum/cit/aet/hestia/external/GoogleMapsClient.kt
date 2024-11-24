package de.tum.cit.aet.hestia.external

import jakarta.ws.rs.*
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient(baseUri = "https://maps.googleapis.com/")
@Produces("application/json")
@Consumes("application/json")
interface GoogleMapsClient {
    @POST
    @Path("/maps/api/place/textsearch/json")
    fun searchByText(
        @QueryParam("key") apiKey: String,
        @QueryParam("query") query: String
    ): String

    @GET
    @Path("/maps/api/place/details/json")
    fun getPlaceDetails(
        @QueryParam("key") apiKey: String,
        @QueryParam("fields") fields: String,
        @QueryParam("place_id") placeId: String
    ): String
}