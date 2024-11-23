package de.tum.cit.aet.hestia.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Value(
    @JsonProperty("zip_code") val zipCode: String,
    @JsonProperty("prize_per_sqm") val prizePerSqm: Double,
    @JsonProperty("google_place_id") val googlePlaceId: String
)