package de.tum.cit.aet.hestia

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType

@Path("/hello")
class GreetingResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    fun hello(@QueryParam("name") name: String?) = "Hello from Quarkus REST ${name}!"
}