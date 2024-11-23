package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.munich.POI
import de.tum.cit.aet.hestia.dto.parseCsv
import de.tum.cit.aet.hestia.external.KlinikClient
import de.tum.cit.aet.hestia.external.MunichClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/poi")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
class PoiResource {

    @Inject
    @RestClient
    private lateinit var munichClient: MunichClient

    @Inject
    @RestClient
    private lateinit var klinikClient: KlinikClient

    @GET
    @Path("/kita")
    @CacheResult(cacheName = "kita")
    fun kita(): List<POI> {
        val kitas = parseCsv(munichClient.getKitas())
        return kitas.map { it.toPoi() }
    }

    @GET
    @Path("/klinik")
    @CacheResult(cacheName = "kita")
    fun klinik(): List<POI> {
        val data = klinikClient.getAll()
        return data.map { it.toPoi() }
    }
}