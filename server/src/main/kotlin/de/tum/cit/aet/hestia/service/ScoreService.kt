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

@ApplicationScoped
class ScoreService {

    @Inject
    private lateinit var interhypService: InterhypService

    @Inject
    private lateinit var googleService: GoogleService

    @Inject
    private lateinit var poiService: PoiService

    fun score(location: Location, travelMode: RouteTravelMode, zips: List<String>): Map<String, Double> {
        val zipDatas = zips.map { zip ->
            val interhypData = interhypService.priceIndexBuy("houses")
            val interhypZip = interhypData.values.first { it.zipCode == zip }
            val prizePerSqm = interhypZip.prizePerSqm

            val zipLocation = googleService.getPlaceDetails(interhypZip.googlePlaceId)

            val airQuality = googleService.getAirQuality(zipLocation)

            val nearestKita = poiService.kita().map { getDistance(zipLocation, it.location) }.minOrNull() ?: 100.0

            val nearestSchool =
                poiService.school(zip).map { getDistance(zipLocation, it.location) }.minOrNull() ?: 100.0

            val nearestKlinik = poiService.klinik().map { getDistance(zipLocation, it.location) }.minOrNull() ?: 100.0

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
        }

        val distanceMatrix =
            googleService.getDistanceMatrix(DistanceMatrixDTO(location, zipDatas.map { it.placeId }, travelMode))

        val scoreMap = zipDatas.map { zipData ->
            val distance = distanceMatrix[zipData.placeId]

            val score = Random(1337).nextDouble(0.0, 100.0)

            zipData.zip to score
        }.toMap()

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