package de.tum.cit.aet.hestia.dto

import com.github.doyaaaaaken.kotlincsv.dsl.csvReader

data class School(
    val number: Int,
    val type: String,
    val name: String,
    val street: String,
    val zip: String,
    val city: String,
    val link: String
)

fun parseSchoolCsv(content: String): List<School> {
    return csvReader().readAllWithHeader(data = content).map { row ->
        School(
            number = row["Schulnummer"]?.toIntOrNull() ?: 0,
            type = row["Schultyp"] ?: "",
            name = row["Name"] ?: "",
            street = row["Straße"] ?: "",
            zip = row["PLZ"] ?: "",
            city = row["Ort"] ?: "",
            link = row["Link"] ?: ""
        )
    }
}
