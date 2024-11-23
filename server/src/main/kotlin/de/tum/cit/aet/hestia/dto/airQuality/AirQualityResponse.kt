package de.tum.cit.aet.hestia.dto.airQuality

data class AirQualityResponse(
    val dateTime: String,
    val regionCode: String,
    val indexes: List<Index>
)