package de.tum.cit.aet.hestia.service

import de.tum.cit.aet.hestia.dto.ZipCodePrizesResponse
import de.tum.cit.aet.hestia.external.InterhypClient
import io.quarkus.cache.CacheResult
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.rest.client.inject.RestClient

@ApplicationScoped
class InterhypService {

    @Inject
    @RestClient
    private lateinit var interhypClient: InterhypClient

    @CacheResult(cacheName = "zip-code-prices-buy")
    fun priceIndexBuy(estateType: String): ZipCodePrizesResponse {
        return interhypClient.getData(
            estates = estateType, minZipCode = "01001", maxZipCode = "99998"
        )
    }

    @CacheResult(cacheName = "zip-code-prices-rent")
    fun priceIndexRent(estateType: String): ZipCodePrizesResponse {
        val data = interhypClient.getData(
            estates = estateType, minZipCode = "01001", maxZipCode = "99998"
        )
        data.values = data.values.map { it.copy(prizePerSqm = it.prizePerSqm / 100) }
        return data
    }
}