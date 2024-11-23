package de.tum.cit.aet.hestia.service

import com.fasterxml.jackson.databind.ObjectMapper
import de.tum.cit.aet.hestia.dto.GeoJSON
import de.tum.cit.aet.hestia.dto.Location
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import kotlin.system.measureTimeMillis

@ApplicationScoped
class GeoService {

    @Inject
    private lateinit var objectMapper: ObjectMapper

    @CacheResult(cacheName = "geoRead")
    fun read(): GeoJSON {
        val geo: GeoJSON
        println(
            "Time: ${
                measureTimeMillis {
                    geo = objectMapper.readValue(javaClass.getResource("/geo.json"), GeoJSON::class.java)
                }
            } ms"
        )
        println("Features: ${geo.features.size}")
        return geo
    }

    fun calculate(geo: GeoJSON, startLocation: Location, endLocation: Location): List<Any> {
        val filteredData: List<Any>
        println(
            "Time: ${
                measureTimeMillis {
                    filteredData = geo.features.filter { feature ->
                        var c1 = feature.geometry.coordinates as ArrayList<Any>
                        while ((c1[0] as? ArrayList<*>)?.get(0) is ArrayList<*>) {
                            c1 = c1[0] as ArrayList<Any>
                        }
                        val coords = c1 as ArrayList<ArrayList<Double>>

                        // Coord: Longitude, Latitude
                        coords.any { coord ->
                            ((coord[0] > startLocation.longitude && coord[0] < endLocation.longitude) || (coord[0] < startLocation.longitude && coord[0] > endLocation.longitude)) &&
                                    ((coord[1] > startLocation.latitude && coord[1] < endLocation.latitude) || (coord[1] < startLocation.latitude && coord[1] > endLocation.latitude))
                        }
                    }
                }
            } ms"
        )
        println("PLZs: ${filteredData.size}")

        return filteredData
    }
}