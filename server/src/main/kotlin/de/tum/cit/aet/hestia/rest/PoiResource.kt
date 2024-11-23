package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.munich.POI
import de.tum.cit.aet.hestia.service.PoiService
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType

@Path("/poi")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
class PoiResource {

    @Inject
    private lateinit var poiService: PoiService

    @GET
    @Path("/kita")
    @CacheResult(cacheName = "kita")
    fun kita(): List<POI> {
        return poiService.kita()
    }

    @GET
    @Path("/klinik")
    @CacheResult(cacheName = "kita")
    fun klinik(): List<POI> {
        return poiService.klinik()
    }

    @GET
    @Path("/school/{zip}")
    @CacheResult(cacheName = "school")
    fun school(@PathParam("zip") zip: String): List<POI> {
        return poiService.school(zip)
    }
}