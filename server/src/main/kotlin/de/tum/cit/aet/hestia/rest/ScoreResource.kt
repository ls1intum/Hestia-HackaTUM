package de.tum.cit.aet.hestia.rest

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.ScoreDTO
import de.tum.cit.aet.hestia.external.GoogleMapsClient
import de.tum.cit.aet.hestia.external.GooglePlacesClient
import de.tum.cit.aet.hestia.service.ScoreService
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/score")
@ApplicationScoped
class ScoreResource {

    @Inject
    @ConfigProperty(name = "hestia.google.api.key")
    private lateinit var apiKey: String

    @Inject
    @RestClient
    private lateinit var googlePlacesClient: GooglePlacesClient

    @Inject
    @RestClient
    private lateinit var googleMapsClient: GoogleMapsClient

    @Inject
    private lateinit var scoreService: ScoreService

    @Inject
    private lateinit var objectMapper: ObjectMapper

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "scores")
    fun priceIndexBuy(dto: ScoreDTO): Map<String, Double> {
        val res = googleMapsClient.searchByText(
            apiKey = apiKey,
            query = dto.address
        )

        val rootNode = objectMapper.readTree(res)
        val locationNode = rootNode.get("results").get(0).get("geometry").get("location")
        val location = Location(
            latitude = locationNode.get("lat").asDouble(),
            longitude = locationNode.get("lng").asDouble()
        )
        return scoreService.score(location, dto.travelMode, dto.zips)
    }
}