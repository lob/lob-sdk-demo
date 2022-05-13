package com.example;

import javax.swing.text.Position.Bias;

/**
 * Hello world!
 */
        // Import classes:
import com.lob.api.ApiClient;
import com.lob.api.ApiException;
import com.lob.api.Configuration;
import com.lob.api.auth.HttpBasicAuth;

import org.openapitools.client.model.*;

import io.github.cdimascio.dotenv.Dotenv;

import com.lob.api.client.AddressesApi;

public final class App {
    private App() {
    }

    /**
     * Says hello to the world.
     * @param args The arguments of the program.
     */
    public static void main(String[] args) {
            ApiClient defaultClient = Configuration.getConfigForIntegration();
            defaultClient.setBasePath("https://api.lob.com/v1");
            HttpBasicAuth basicAuth = (HttpBasicAuth) defaultClient.getAuthentication("basicAuth");

            // If using a env file
            // Dotenv dotenv = Dotenv.load();
            // String apiKey = dotenv.get("LOB_API_TEST_KEY");

            // basicAuth.setUsername(apiKey);

            // if not using a env file
            basicAuth.setUsername("YOUR-API-KEY");

            AddressesApi apiInstance = new AddressesApi(defaultClient);
            AddressEditable addressEditable = new AddressEditable(); // AddressEditable | 
            try {
                Address result = apiInstance.addressCreate(addressEditable);
                System.out.println(result);
            } catch (ApiException e) {
                System.err.println("Exception when calling AddressesApi#addressCreate");
                System.err.println("Status code: " + e.getCode());
                System.err.println("Reason: " + e.getResponseBody());
                System.err.println("Response headers: " + e.getResponseHeaders());
                e.printStackTrace();
            }
    }
}
