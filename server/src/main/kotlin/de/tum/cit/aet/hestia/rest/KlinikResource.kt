package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.munich.POI
import de.tum.cit.aet.hestia.external.KlinikClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/klinik")
@ApplicationScoped
class KlinikResource {

    @Inject
    @RestClient
    private lateinit var klinikClient: KlinikClient

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "kita")
    fun priceIndexBuy(): List<POI> {
        val data = klinikClient.getAll()
        return data.map { it.toPoi() }
    }
}