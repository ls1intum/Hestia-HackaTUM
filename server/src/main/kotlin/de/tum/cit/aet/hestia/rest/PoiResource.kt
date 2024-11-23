package de.tum.cit.aet.hestia.rest

import de.tum.cit.aet.hestia.dto.munich.POI
import de.tum.cit.aet.hestia.dto.parseKitaCsv
import de.tum.cit.aet.hestia.dto.parseSchoolCsv
import de.tum.cit.aet.hestia.dto.place.TextSearchRequest
import de.tum.cit.aet.hestia.external.GooglePlacesClient
import de.tum.cit.aet.hestia.external.KlinikClient
import de.tum.cit.aet.hestia.external.MunichClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@Path("/poi")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
class PoiResource {

    @Inject
    @ConfigProperty(name = "hestia.google.api.key")
    private lateinit var apiKey: String

    @Inject
    @RestClient
    private lateinit var munichClient: MunichClient

    @Inject
    @RestClient
    private lateinit var klinikClient: KlinikClient

    @Inject
    @RestClient
    private lateinit var googlePlacesClient: GooglePlacesClient

    @GET
    @Path("/kita")
    @CacheResult(cacheName = "kita")
    fun kita(): List<POI> {
        val kitas = parseKitaCsv(munichClient.getKitas())
        return kitas.map { it.toPoi() }
    }

    @GET
    @Path("/klinik")
    @CacheResult(cacheName = "kita")
    fun klinik(): List<POI> {
        val data = klinikClient.getAll()
        return data.map { it.toPoi() }
    }

    @GET
    @Path("/school/{zip}")
    @CacheResult(cacheName = "school")
    fun school(@PathParam("zip") zip: String): List<POI> {
        // Read CSV from resources folder "bavarian_schools.csv"
        val data = javaClass.getResource("/bavarian_schools.csv")?.readText() ?: return listOf()
        var schools = parseSchoolCsv(data)

        schools = schools.filter { it.zip == zip }

        return schools.mapNotNull {
            val places = googlePlacesClient.searchByText(
                apiKey = apiKey,
                fields = "places.location",
                payload = TextSearchRequest("${it.street} ${it.zip} ${it.city}")
            )
            val place = places.places.firstOrNull()
            place?.location?.let { it1 ->
                POI(
                    name = it.name,
                    location = it1,
                )
            }
        }
    }
}