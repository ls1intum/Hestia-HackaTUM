package de.tum.cit.aet.hestia.dto.place

import de.tum.cit.aet.hestia.dto.Location

data class TextSearchResponse(val places: List<Place>)

data class Place(val location: Location)
