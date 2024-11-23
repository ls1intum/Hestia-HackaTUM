package de.tum.cit.aet.hestia

import io.quarkus.runtime.Startup
import jakarta.annotation.PostConstruct
import jakarta.inject.Singleton
import java.io.File
import java.net.URL

@Singleton
@Startup
class GeoJsonDownloader {

    @PostConstruct
    fun onStartup() {
        downloadGeoJsonFile()
    }

    private fun downloadGeoJsonFile() {
        val url = "https://downloads.suche-postleitzahl.org/v2/public/plz-5stellig.geojson"
        val destination = File("/tmp/geo.json")

        if (destination.exists()) {
            println("GeoJSON file already exists at: ${destination.absolutePath}")
            return
        }

        // Download the file
        URL(url).openStream().use { input ->
            destination.outputStream().use { output ->
                input.copyTo(output)
            }
        }

        println("GeoJSON file downloaded to: ${destination.absolutePath}")
    }
}
