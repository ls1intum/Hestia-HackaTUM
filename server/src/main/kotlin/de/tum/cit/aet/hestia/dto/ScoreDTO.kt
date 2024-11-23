package de.tum.cit.aet.hestia.dto

import de.tum.cit.aet.hestia.dto.route.RouteTravelMode

data class ScoreDTO(
    val location: Location,
    val travelMode: RouteTravelMode,
    val zips: List<String>
)