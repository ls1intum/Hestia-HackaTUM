package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.munich.POI
import de.tum.cit.aet.hestia.dto.parseCsv
import de.tum.cit.aet.hestia.external.MunichClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/munich")
@ApplicationScoped
class MunichResource {

    @Inject
    @RestClient
    private lateinit var munichClient: MunichClient

    @GET
    @Path("/kita")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "kita")
    fun priceIndexBuy(): List<POI> {
        val kitas = parseCsv(munichClient.getKitas())
        return kitas.map { it.toPoi() }
    }
}