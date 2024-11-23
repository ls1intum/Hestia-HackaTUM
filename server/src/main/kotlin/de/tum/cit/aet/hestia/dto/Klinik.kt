package de.tum.cit.aet.hestia.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import de.tum.cit.aet.hestia.dto.munich.POI

@JsonIgnoreProperties(ignoreUnknown = true)
data class Klinik(val name: String, val zip: String, val latitude: String, val longitude: String) {
    fun toPoi(): POI {
        return POI(name, Location(latitude.toDouble(), longitude.toDouble()))
    }
}
