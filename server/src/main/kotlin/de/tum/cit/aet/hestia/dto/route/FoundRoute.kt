package de.tum.cit.aet.hestia.dto.route

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class FoundRoute(
    val originIndex: Int,
    val destinationIndex: Int,
    val distanceMeters: Int,
    val duration: String,
    val condition: String
)
