package de.tum.cit.aet.hestia.service

import de.tum.cit.aet.hestia.dto.Location
import de.tum.cit.aet.hestia.dto.route.DistanceMatrixDTO
import de.tum.cit.aet.hestia.dto.route.RouteTravelMode
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.random.Random
import kotlin.system.measureTimeMillis

@ApplicationScoped
class ScoreService {

    @Inject
    private lateinit var interhypService: InterhypService

    @Inject
    private lateinit var googleService: GoogleService

    @Inject
    private lateinit var poiService: PoiService

    fun score(location: Location, travelMode: RouteTravelMode, zips: List<String>): Map<String, Double> {
        println("Zips: ${zips.size}")
        val interhypData = interhypService.priceIndexBuy("houses")
        println("InterhypData: ${interhypData.values.size}")
        val zipDatas: List<ZipData>
        println(
            "ZipData: ${
                measureTimeMillis {
                    zipDatas = zips
                        .filter { interhypData.values.any { ih -> ih.zipCode == it } }
                        .parallelStream()
                        .map { zip ->
                            val interhypZip = interhypData.values.first { it.zipCode == zip }
                            val prizePerSqm = interhypZip.prizePerSqm

                            val zipLocation = googleService.getPlaceDetails(interhypZip.googlePlaceId)

                            // val airQuality = googleService.getAirQuality(zipLocation)

                            val nearestKita =
                                poiService.kita().map { getDistance(zipLocation, it.location) }.minOrNull() ?: 100.0

                            val nearestSchool =
                                poiService.school(zip).map { getDistance(zipLocation, it.location) }
                                    .minOrNull() ?: 100.0

                            val nearestKlinik =
                                poiService.klinik().map { getDistance(zipLocation, it.location) }.minOrNull() ?: 100.0

                            ZipData(
                                zip,
                                prizePerSqm,
                                interhypZip.googlePlaceId,
                                zipLocation,
                                0.0,
                                nearestKita,
                                nearestSchool,
                                nearestKlinik
                            )
                        }.toList()
                }
            } ms")

        println("ZipDatas: ${zipDatas.size}")

        val distanceMatrices: MutableList<Map<String, Long>>
        println(
            "DistanceMatrices: ${
                measureTimeMillis {
                    distanceMatrices = zipDatas.chunked(50).parallelStream().map { chunk ->
                        googleService.getDistanceMatrix(
                            DistanceMatrixDTO(
                                location,
                                chunk.map { it.placeId },
                                travelMode
                            )
                        )
                    }.toList()
                }
            } ms")

        println("DistanceMatrices: ${distanceMatrices.size}")
        println("DistanceMatrices: ${distanceMatrices.map { it.size }}")

        val distanceMatrix = distanceMatrices.reduce { acc, map -> acc + map }

        val random = Random(1337)
        val scoreMap: Map<String, Double>
        println(
            "Score: ${
                measureTimeMillis {
                    scoreMap = zipDatas.map { zipData ->
                        val distance = distanceMatrix[zipData.placeId]

                        val score = random.nextDouble(0.0, 100.0)

                        zipData.zip to score
                    }.toMap()
                }
            } ms")

        return scoreMap
    }

    fun getDistance(location1: Location, location2: Location): Double {
        val earthRadius = 6371.0 // Radius of the Earth in kilometers

        val latDistance = Math.toRadians(location2.latitude - location1.latitude)
        val lonDistance = Math.toRadians(location2.longitude - location1.longitude)

        val a = sin(latDistance / 2) * sin(latDistance / 2) +
                cos(Math.toRadians(location1.latitude)) * cos(Math.toRadians(location2.latitude)) *
                sin(lonDistance / 2) * sin(lonDistance / 2)

        val c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return earthRadius * c // Distance in kilometers
    }

    data class ZipData(
        val zip: String,
        val prizePerSqm: Double,
        val placeId: String,
        val location: Location,
        val airQuality: Double,
        val nearestKita: Double,
        val nearestSchool: Double,
        val nearestKlinik: Double
    )
}