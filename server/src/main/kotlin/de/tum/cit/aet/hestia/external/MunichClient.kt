package de.tum.cit.aet.hestia.external

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient

@RegisterRestClient
interface MunichClient {
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/dataset/21d97a9e-1e94-4a0c-86d1-3c1539bcb18b/resource/b6e9a48f-4892-47c4-ae97-37d1bc7ec993/download/open_data_kitas_2024_10_31.csv")
    fun getKitas(): String
}