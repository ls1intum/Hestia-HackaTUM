package de.tum.cit.aet.hestia.dto

import de.tum.cit.aet.hestia.dto.route.RouteTravelMode

data class ScoreDTO(
    val address: String,
    val travelMode: RouteTravelMode,
    val zips: List<String>,
    val weights: Weigths
)

data class Weigths(
    val commuteTime: Weight,
    val kitaProximity: Weight,
    val schoolProximity: Weight,
    val klinikProximity: Weight,
    val airQuality: Weight,
    val price: Weight
)

data class Weight(
    val weight: Double,
    val enabled: Boolean
)
