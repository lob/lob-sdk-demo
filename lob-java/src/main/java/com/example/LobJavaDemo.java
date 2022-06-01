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
