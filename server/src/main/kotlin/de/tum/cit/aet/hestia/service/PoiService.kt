package de.tum.cit.aet.hestia.service

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.munich.POI
import de.tum.cit.aet.hestia.dto.parseKitaCsv
import de.tum.cit.aet.hestia.dto.parseSchoolCsv
import de.tum.cit.aet.hestia.external.GoogleMapsClient
import de.tum.cit.aet.hestia.external.GooglePlacesClient
import de.tum.cit.aet.hestia.external.KlinikClient
import de.tum.cit.aet.hestia.external.MunichClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient

@ApplicationScoped
class PoiService {

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

    @Inject
    @RestClient
    private lateinit var googleMapsClient: GoogleMapsClient

    @Inject
    private lateinit var objectMapper: ObjectMapper

    @CacheResult(cacheName = "kita")
    fun kita(): List<POI> {
        val kitas = parseKitaCsv(munichClient.getKitas())
        return kitas.map { it.toPoi() }
    }

    @CacheResult(cacheName = "kita")
    fun klinik(): List<POI> {
        val data = klinikClient.getAll()
        return data.map { it.toPoi() }
    }

    @CacheResult(cacheName = "school")
    fun school(zip: String): List<POI> {
        // Read CSV from resources folder "bavarian_schools.csv"
        val data = javaClass.getResource("/bavarian_schools.csv")?.readText() ?: return listOf()
        var schools = parseSchoolCsv(data)

        schools = schools.filter { it.zip == zip }

        return schools.mapNotNull {
            val places = googleMapsClient.searchByText(
                apiKey = apiKey,
                query = "${it.street} ${it.zip} ${it.city}"
            )

            // val rootNode = objectMapper.readTree(jsonString)
            //
            //        val locationNode = rootNode.get("result").get("geometry").get("location")
            //        val location = Location(
            //            latitude = locationNode.get("lat").asDouble(),
            //            longitude = locationNode.get("lng").asDouble()
            //        )

            val rootNode = objectMapper.readTree(places)
            val locationNode = rootNode.get("results").get(0).get("geometry").get("location")
            val location = Location(
                latitude = locationNode.get("lat").asDouble(),
                longitude = locationNode.get("lng").asDouble()
            )

            POI(
                name = it.name,
                location = location,
            )
        }
    }
}