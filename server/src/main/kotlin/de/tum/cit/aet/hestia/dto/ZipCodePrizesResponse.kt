package de.tum.cit.aet.hestia.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ZipCodePrizesResponse(
    @JsonProperty("values") var values: List<Value>,
    @JsonProperty("estate_type") val estateType: String,
    @JsonProperty("message") val message: String,
    @JsonProperty("request") val request: Request
)

