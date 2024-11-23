package de.tum.cit.aet.hestia.external

import de.tum.cit.aet.hestia.dto.ZipCodePrizesResponse
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient
interface InterhypClient {
    @GET
    @Path("/api/automated-estate-valuation/zip_code_prizes")
    @Produces(MediaType.APPLICATION_JSON)
    fun getData(
        @QueryParam("estates") estates: String,
        @QueryParam("min_zip_code") minZipCode: String,
        @QueryParam("max_zip_code") maxZipCode: String
    ): ZipCodePrizesResponse
}