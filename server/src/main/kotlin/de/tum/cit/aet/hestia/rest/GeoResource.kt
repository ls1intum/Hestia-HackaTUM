package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.service.GeoService
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType

@Path("/geo")
@ApplicationScoped
class GeoResource {

    @Inject
    private lateinit var geoService: GeoService

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "geo")
    fun priceIndexBuy(
        @QueryParam("min_lat") minLat: Double, @QueryParam("min_lon") minLon: Double,
        @QueryParam("max_lat") maxLat: Double, @QueryParam("max_lon") maxLon: Double
    ): List<Any> {
        val geo = geoService.read()
        val startLocation = Location(minLat, minLon)
        val endLocation = Location(maxLat, maxLon)
        return geoService.calculate(geo, startLocation, endLocation)
    }
}