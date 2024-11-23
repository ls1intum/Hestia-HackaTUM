package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.ScoreDTO
import de.tum.cit.aet.hestia.dto.place.TextSearchRequest
import de.tum.cit.aet.hestia.external.GooglePlacesClient
import de.tum.cit.aet.hestia.service.ScoreService
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.config.inject.ConfigProperty

@Path("/score")
@ApplicationScoped
class ScoreResource {

    @Inject
    @ConfigProperty(name = "google.api.key")
    private lateinit var apiKey: String

    @Inject
    private lateinit var googlePlacesClient: GooglePlacesClient

    @Inject
    private lateinit var scoreService: ScoreService

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "scores")
    fun priceIndexBuy(dto: ScoreDTO): Map<String, Double> {
        val location = googlePlacesClient.searchByText(
            apiKey = apiKey,
            fields = "places.location",
            payload = TextSearchRequest(dto.address)
        ).places.first().location
        return scoreService.score(location, dto.travelMode, dto.zips)
    }
}