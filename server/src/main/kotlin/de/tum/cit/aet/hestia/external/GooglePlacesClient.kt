package de.tum.cit.aet.hestia.external

import de.tum.cit.aet.hestia.dto.place.TextSearchRequest
import de.tum.cit.aet.hestia.dto.place.TextSearchResponse
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

    @POST
    @Path("/v1/places:searchText")
    fun searchByText(
        @HeaderParam("X-Goog-Api-Key") apiKey: String,
        @HeaderParam("X-Goog-FieldMask") fields: String,
        payload: TextSearchRequest
    ): TextSearchResponse
}