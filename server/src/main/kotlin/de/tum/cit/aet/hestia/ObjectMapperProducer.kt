package de.tum.cit.aet.hestia

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Produces
import jakarta.inject.Singleton

@ApplicationScoped
class ObjectMapperProducer {
    @Produces
    @Singleton
    fun objectMapper(): ObjectMapper {
        return ObjectMapper().registerKotlinModule()
    }
}

