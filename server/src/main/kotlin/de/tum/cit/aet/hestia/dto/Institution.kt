package de.tum.cit.aet.hestia.dto

import com.github.doyaaaaaken.kotlincsv.dsl.csvReader
import de.tum.cit.aet.hestia.dto.munich.POI

data class Institution(
    val sponsorship: String,
    val institutionName: String,
    val institutionType: String,
    val street: String,
    val houseNumber: String,
    val houseNumberAdditional: String?,
    val postalCode: String,
    val city: String,
    val districtName: String,
    val districtNumber: Int,
    val latitude: Double,
    val longitude: Double,
    val institutionId: Int
) {
    fun toPoi(): POI = POI(
        name = institutionName,
        location = Location(latitude, longitude)
    )
}

fun parseCsv(content: String): List<Institution> {
    return csvReader().readAllWithHeader(data = content).map { row ->
        Institution(
            sponsorship = row["Trägerschaft"] ?: "",
            institutionName = row["Name Einrichtung"] ?: "",
            institutionType = row["Einrichtungsart"] ?: "",
            street = row["Straße"] ?: "",
            houseNumber = row["Hausnummer"] ?: "",
            houseNumberAdditional = row["Hausnummern-zusatz"],
            postalCode = row["PLZ"] ?: "",
            city = row["Ort"] ?: "",
            districtName = row["Stadtbezirk Name"] ?: "",
            districtNumber = row["Stadtbezirk Nummer"]?.toIntOrNull() ?: 0,
            latitude = row["Geokoordinaten Breite"]?.toDoubleOrNull() ?: 0.0,
            longitude = row["Geokoordinaten Länge"]?.toDoubleOrNull() ?: 0.0,
            institutionId = row["ID Einrichtung"]?.toIntOrNull() ?: 0
        )
    }
}
