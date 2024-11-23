package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.ZipCodePrizesResponse
import de.tum.cit.aet.hestia.external.InterhypClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/interhyp")
@ApplicationScoped
class InterhypResource {

    @Inject
    @RestClient
    private lateinit var interhypClient: InterhypClient

    @GET
    @Path("/price-index/buy")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "zip-code-prices-buy")
    fun priceIndexBuy(): ZipCodePrizesResponse {
        return interhypClient.getData(
            estates = "houses", minZipCode = "01001", maxZipCode = "99998"
        )
    }

    @GET
    @Path("/price-index/rent")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "zip-code-prices-rent")
    fun priceIndexRent(): ZipCodePrizesResponse {
        val data = interhypClient.getData(
            estates = "houses", minZipCode = "01001", maxZipCode = "99998"
        )
        data.values = data.values.map { it.copy(prizePerSqm = it.prizePerSqm / 100) }
        return data
    }
}