package de.tum.cit.aet.hestia

import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import org.hamcrest.CoreMatchers.`is`
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test

@QuarkusTest
class GreetingResourceTest {

    @Test
    @Disabled
    fun testHelloEndpoint() {
        assert(true);
    }

}