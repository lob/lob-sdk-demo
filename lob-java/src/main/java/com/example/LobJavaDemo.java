package com.example;

// Import classes:
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class LobJavaDemo {
    public static void main(String[] args) {
        SpringApplication demoApp = new SpringApplication(LobJavaDemo.class);
        String port = System.getenv("PORT");
        if (port == null || port.isEmpty()) {
            port = "5555";
        }

        demoApp.setDefaultProperties(Collections.singletonMap("server.port", port));
        demoApp.run(args);

        /*
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
            AddressEditable addressEditable = new AddressEditable(); // AddressEditable
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

         */
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/*").allowedOrigins("http://localhost:8081");
            }
        };
    }
}
