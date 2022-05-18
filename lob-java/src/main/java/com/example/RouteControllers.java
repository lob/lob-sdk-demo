package com.example;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import java.io.IOException;

@RestController
public class RouteControllers {

    @RequestMapping(
            value = "/healthCheck",
            method = RequestMethod.GET,
            produces = "application/json"
    )
    public ResponseEntity<String> healthCheck() {
        class HealthCheckResponse {
            private Boolean ok;
            public Boolean getOk() { return this.ok; }
            public void setOk(Boolean ok) { this.ok = ok; };
            private String sdk;
            public String getSdk() { return this.sdk; }
            public void setSdk(String sdk) { this.sdk = sdk; };
            private String version;
            public String getVersion() { return this.version; }
            public void setVersion(String version) { this.version = version; };
            private String[] supportedResources;
            public String[] getSupportedResources() { return this.supportedResources; }
            public void setSupportedResources(String[] supportedResources) { this.supportedResources = supportedResources; };
        }

        HealthCheckResponse responseBody = new HealthCheckResponse();
        responseBody.setOk(true);
        responseBody.setSdk("java");
        responseBody.setVersion("13.0.0");
        responseBody.setSupportedResources(new String[]{});

        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            jsonInString = mapper.writeValueAsString(responseBody);
        } catch (IOException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

        return new ResponseEntity<String>(jsonInString, status);
    }
}
