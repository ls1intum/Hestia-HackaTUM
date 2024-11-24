package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.ZipCodePrizesResponse
import de.tum.cit.aet.hestia.service.InterhypService
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType

@Path("/interhyp")
@ApplicationScoped
class InterhypResource {

    @Inject
    private lateinit var interhypService: InterhypService

    @GET
    @Path("/price-index/buy")
    @Produces(MediaType.APPLICATION_JSON)
    fun priceIndexBuy(@QueryParam("estateType") estateType: String): ZipCodePrizesResponse {
        return interhypService.priceIndexBuy(estateType)
    }

    @GET
    @Path("/price-index/rent")
    @Produces(MediaType.APPLICATION_JSON)
    fun priceIndexRent(@QueryParam("estateType") estateType: String): ZipCodePrizesResponse {
        return interhypService.priceIndexRent(estateType)
    }
}