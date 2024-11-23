package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.ScoreDTO
import de.tum.cit.aet.hestia.service.ScoreService
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType

@Path("/score")
@ApplicationScoped
class ScoreResource {

    @Inject
    private lateinit var scoreService: ScoreService

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "scores")
    fun priceIndexBuy(dto: ScoreDTO): Map<String, Double> {
        return scoreService.score(dto.location, dto.travelMode, dto.zips)
    }
}