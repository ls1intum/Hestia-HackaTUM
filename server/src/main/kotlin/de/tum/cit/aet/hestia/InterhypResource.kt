package de.tum.cit.aet.hestia

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
    lateinit var interhypClient: InterhypClient

    @GET
    @Path("/price-index")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "zip-code-prices")
    fun priceIndex(): String {
        return interhypClient.getData(
            estates = "houses",
            minZipCode = "01001",
            maxZipCode = "99998"
        )
    }
}