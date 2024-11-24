package de.tum.cit.aet.hestia.dto.place

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import de.tum.cit.aet.hestia.dto.Location

@JsonIgnoreProperties(ignoreUnknown = true)
data class TextSearchResponseOld(val results: List<Result>)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Result(val geometry: Geometry)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Geometry(val location: LocationLoc)

@JsonIgnoreProperties(ignoreUnknown = true)
data class LocationLoc(val lat: Double, val lng: Double) {
    fun toLocation(): Location {
        return Location(lat, lng)
    }
}


