package de.tum.cit.aet.hestia.external

import de.tum.cit.aet.hestia.dto.route.FoundRoute
import de.tum.cit.aet.hestia.dto.route.RouteMatrixRequest
import jakarta.ws.rs.*
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient
@Produces("application/json")
@Consumes("application/json")
interface GoogleRoutesClient {
    @POST
    @Path("/distanceMatrix/v2:computeRouteMatrix")
    fun getPlaceDetails(
        @QueryParam("key") apiKey: String,
        @QueryParam("fields") fields: String,
        payload: RouteMatrixRequest
    ): List<FoundRoute>
}