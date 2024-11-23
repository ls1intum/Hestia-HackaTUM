package de.tum.cit.aet.hestia.external

import de.tum.cit.aet.hestia.dto.Klinik
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient(baseUri = "https://bundes-klinik-atlas.de")
interface KlinikClient {
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/fileadmin/json/locations.json")
    fun getAll(): List<Klinik>
}