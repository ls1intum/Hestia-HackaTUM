package de.tum.cit.aet.hestia.dto.route

import de.tum.cit.aet.hestia.dto.Location

data class DistanceMatrixDTO(val origin: Location, val locations: List<String>)