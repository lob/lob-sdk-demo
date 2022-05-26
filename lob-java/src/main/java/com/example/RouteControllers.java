package com.example;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.lob.api.ApiClient;
import com.lob.api.ApiException;
import com.lob.api.Configuration;
import com.lob.api.auth.HttpBasicAuth;
import com.lob.api.client.*;
import org.json.JSONObject;
import org.openapitools.client.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class RouteControllers {

    private final ApiClient lobClient;

    RouteControllers() {
        ApiClient client = Configuration.getDefaultApiClient();
        HttpBasicAuth basicAuth = (HttpBasicAuth) client.getAuthentication("basicAuth");
        basicAuth.setUsername(System.getenv("LOB_API_TEST_KEY"));

        this.lobClient = client;
    }

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
        responseBody.setSupportedResources(new String[]{
                "ADDRESSES",
                "BANK_ACCOUNTS",
                "CHECKS",
                "LETTERS",
                "POSTCARDS",
                "SELF_MAILERS",
                "TEMPLATES",
                "TEMPLATE_VERSIONS"
        });

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            jsonInString = objectMapper.writeValueAsString(responseBody);
        } catch (IOException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/addresses",
            method = RequestMethod.POST,
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> addresses(@RequestBody String body) {
        AddressesApi apiInstance = new AddressesApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            AddressEditable addressEditable = new AddressEditable();
            JSONObject inputObj = new JSONObject(body);

            addressEditable.setName(inputObj.getString("name"));
            addressEditable.setAddressLine1(inputObj.getString("address_line1"));
            if (inputObj.has("address_line2")) {
                addressEditable.setAddressLine2(inputObj.getString("address_line2"));
            }
            addressEditable.setAddressCity(inputObj.getString("address_city"));
            addressEditable.setAddressState(inputObj.getString("address_state"));
            addressEditable.setAddressZip(inputObj.getString("address_zip"));

            // Operations
            ResponseModels.AddressesResponse responseBody = new ResponseModels.AddressesResponse();
            responseBody.setCreatedAddress(apiInstance.create(addressEditable));
            responseBody.setRetrievedAddress(apiInstance.get(responseBody.getCreatedAddress().getId()));
            responseBody.setListedAddresses(apiInstance.list(2, null, null, null, null, null));
            responseBody.setDeletedAddress(apiInstance.delete(responseBody.getCreatedAddress().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);

        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

//        try {
//            AddressEditable addressRaw = new AddressEditable();
//            addressRaw.setName("Harry Zhang");
//            addressRaw.setCompany("Lob");
//            addressRaw.setEmail("harry@lob.com");
//            addressRaw.setPhone("5555555555");
//            addressRaw.setAddressLine1("210 King St");
//            addressRaw.setAddressLine2("# 6100");
//            addressRaw.setAddressCity("San Francisco");
//            addressRaw.setAddressState("CA");
//            addressRaw.setAddressZip("94107");
//            addressRaw.setAddressCountry(CountryExtended.US);
//
//            Address address = apiInstance.create(addressRaw);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            Address address = apiInstance.get("adr_fa85158b26c3eb7c");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            AddressList addresses = apiInstance.list(2, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            AddressDeletion address = apiInstance.delete("adr_fa85158b26c3eb7c");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/address",
            method = RequestMethod.POST,
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> address(@RequestBody String body) {
        AddressesApi apiInstance = new AddressesApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            AddressEditable addressEditable = new AddressEditable();
            JSONObject inputObj = new JSONObject(body);

            addressEditable.setName(inputObj.getString("name"));
            addressEditable.setAddressLine1(inputObj.getString("address_line1"));
            if (inputObj.has("address_line2")) {
                addressEditable.setAddressLine2(inputObj.getString("address_line2"));
            }
            addressEditable.setAddressCity(inputObj.getString("address_city"));
            addressEditable.setAddressState(inputObj.getString("address_state"));
            addressEditable.setAddressZip(inputObj.getString("address_zip"));

            // Operations
            Address address = apiInstance.create(addressEditable);

            jsonInString = objectMapper.writeValueAsString(address);

        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/bank_accounts",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> bankAccounts(@RequestBody String body) {
        BankAccountsApi apiInstance = new BankAccountsApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            BankAccountWritable bankAccountWritable = new BankAccountWritable();
            JSONObject inputObj = new JSONObject(body);

            bankAccountWritable.setDescription(inputObj.getString("description"));
            bankAccountWritable.setRoutingNumber(inputObj.getString("routing_number"));
            bankAccountWritable.setAccountNumber(inputObj.getString("account_number"));
            bankAccountWritable.setSignatory(inputObj.getString("signatory"));

            // map string to enum
            bankAccountWritable.setAccountType(BankTypeEnum.fromValue(inputObj.getString("account_type")));

            BankAccountVerify verification = new BankAccountVerify();
            String amountsRaw = inputObj.getString("amounts");
            List<Integer> amounts = Arrays.stream(amountsRaw.substring(1, amountsRaw.length() - 1).split(","))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            for(Integer amt : amounts){
                verification.addAmountsItem(amt);
            }

            // Operations
            ResponseModels.BankAccountsResponse responseBody = new ResponseModels.BankAccountsResponse();

            responseBody.setCreatedAccount(apiInstance.create(bankAccountWritable));
            responseBody.setVerifiedAccount(apiInstance.verify(responseBody.getCreatedAccount().getId(), verification));
            responseBody.setRetrievedAccount(apiInstance.get(responseBody.getCreatedAccount().getId()));
            responseBody.setListedAccount(apiInstance.list(2, null, null, null, null, null));
            responseBody.setDeletedAccount(apiInstance.delete(responseBody.getCreatedAccount().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

//        try {
//            BankAccountWritable accountRaw = new BankAccountWritable();
//            accountRaw.setDescription("Test Bank Account");
//            accountRaw.setRoutingNumber("322271627");
//            accountRaw.setAccountNumber("123456789");
//            accountRaw.setSignatory("Jane Doe");
//            accountRaw.setAccountType(BankTypeEnum.INDIVIDUAL);
//
//            BankAccount account = apiInstance.create(accountRaw);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            BankAccountVerify verification = new BankAccountVerify();
//            verification.addAmountsItem(11);
//            verification.addAmountsItem(35);
//            BankAccount account = apiInstance.verify("bank_8cad8df5354d33f", verification);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            BankAccount account = apiInstance.get("bank_8cad8df5354d33f");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            BankAccountList accounts = apiInstance.list(2, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            BankAccountDeletion account = apiInstance.delete("bank_8cad8df5354d33f");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/check_bank_accounts",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> bankAccount(@RequestBody String body) {
        BankAccountsApi apiInstance = new BankAccountsApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            BankAccountWritable bankAccountWritable = new BankAccountWritable();
            JSONObject inputObj = new JSONObject(body);

            bankAccountWritable.setDescription(inputObj.getString("description"));
            bankAccountWritable.setRoutingNumber(inputObj.getString("routing_number"));
            bankAccountWritable.setAccountNumber(inputObj.getString("account_number"));
            bankAccountWritable.setSignatory(inputObj.getString("signatory"));

            // map string to enum
            BankTypeEnum bankAccountType = BankTypeEnum.fromValue(inputObj.getString("account_type"));
            bankAccountWritable.setAccountType(bankAccountType);

            // Operations
            BankAccount bankAccount = apiInstance.create(bankAccountWritable);

            BankAccountVerify verification = new BankAccountVerify();
            verification.addAmountsItem(11);
            verification.addAmountsItem(35);
            apiInstance.verify(bankAccount.getId(), verification);

            jsonInString = objectMapper.writeValueAsString(bankAccount);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/checks",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> checks(@RequestBody String body) {
        ChecksApi apiInstance = new ChecksApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            CheckEditable checkEditable = new CheckEditable();
            JSONObject inputObj = new JSONObject(body);

            checkEditable.setFrom(inputObj.getString("from"));
            checkEditable.setTo(inputObj.getString("to"));
            checkEditable.setAmount(inputObj.getFloat("amount"));
            checkEditable.setBankAccount(inputObj.getString("bank_account"));

            // Operations
            ResponseModels.ChecksResponse responseBody = new ResponseModels.ChecksResponse();
            Check check = apiInstance.create(checkEditable, null);
            responseBody.setCreatedCheck(check);
            responseBody.setRetrievedCheck(apiInstance.get(responseBody.getCreatedCheck().getId()));
            responseBody.setListedChecks(apiInstance.list(2, null, null, null, null, null, null, null, null, null));
            responseBody.setDeletedCheck(apiInstance.cancel(responseBody.getCreatedCheck().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

//        try {
//            AddressEditable addressTo = new AddressEditable();
//            addressTo.setName("Harry Zhang");
//            addressTo.setCompany("Lob");
//            addressTo.setEmail("harry@lob.com");
//            addressTo.setPhone("5555555555");
//            addressTo.setAddressLine1("210 King St");
//            addressTo.setAddressLine2("# 6100");
//            addressTo.setAddressCity("San Francisco");
//            addressTo.setAddressState("CA");
//            addressTo.setAddressZip("94107");
//            addressTo.setAddressCountry(CountryExtended.US);
//
//            AddressEditable addressFrom = new AddressEditable();
//            addressFrom.setName("Harry Zhang");
//            addressFrom.setCompany("Lob");
//            addressFrom.setEmail("harry@lob.com");
//            addressFrom.setPhone("5555555555");
//            addressFrom.setAddressLine1("210 King St");
//            addressFrom.setAddressLine2("# 6100");
//            addressFrom.setAddressCity("San Francisco");
//            addressFrom.setAddressState("CA");
//            addressFrom.setAddressZip("94107");
//            addressFrom.setAddressCountry(CountryExtended.US);
//
//            CheckEditable checkRaw = new CheckEditable();
//            checkRaw.setFrom(addressFrom);
//            checkRaw.setTo(addressTo);
//            checkRaw.setAmount(100f);
//            checkRaw.setBankAccount("bank_8cad8df5354d33f");
//
//            Check check = apiInstance.create(checkRaw, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            Check check = apiInstance.get("chk_534f10783683daa0");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            CheckList checks = apiInstance.list(2, null, null, null, null, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            CheckDeletion check = apiInstance.cancel("chk_534f10783683daa0");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/letters",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> letters(@RequestBody String body) {
        LettersApi apiInstance = new LettersApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            LetterEditable letterEditable = new LetterEditable();
            JSONObject inputObj = new JSONObject(body);

            letterEditable.setDescription(inputObj.getString("description"));
            letterEditable.setFrom(inputObj.getString("from"));
            letterEditable.setTo(inputObj.getString("to"));
            letterEditable.setColor(inputObj.getBoolean("color"));
            letterEditable.setFile(inputObj.getString("file"));

            // map string to enum
            letterEditable.setExtraService(LetterEditable.ExtraServiceEnum.fromValue(inputObj.getString("extra_service")));

            // Operations
            ResponseModels.LettersResponse responseBody = new ResponseModels.LettersResponse();
            Letter letter = apiInstance.create(letterEditable, null);
            responseBody.setCreatedLetter(letter);
            responseBody.setRetrievedLetter(apiInstance.get(responseBody.getCreatedLetter().getId()));
            responseBody.setListedLetters(apiInstance.list(2, null, null, null, null, null, null, null, null, null, null));
            responseBody.setDeletedLetter(apiInstance.cancel(responseBody.getCreatedLetter().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

//        try {
//            AddressEditable addressTo = new AddressEditable();
//            addressTo.setName("Harry Zhang");
//            addressTo.setCompany("Lob");
//            addressTo.setEmail("harry@lob.com");
//            addressTo.setPhone("5555555555");
//            addressTo.setAddressLine1("210 King St");
//            addressTo.setAddressLine2("# 6100");
//            addressTo.setAddressCity("San Francisco");
//            addressTo.setAddressState("CA");
//            addressTo.setAddressZip("94107");
//            addressTo.setAddressCountry(CountryExtended.US);
//
//            AddressEditable addressFrom = new AddressEditable();
//            addressFrom.setName("Harry Zhang");
//            addressFrom.setCompany("Lob");
//            addressFrom.setEmail("harry@lob.com");
//            addressFrom.setPhone("5555555555");
//            addressFrom.setAddressLine1("210 King St");
//            addressFrom.setAddressLine2("# 6100");
//            addressFrom.setAddressCity("San Francisco");
//            addressFrom.setAddressState("CA");
//            addressFrom.setAddressZip("94107");
//            addressFrom.setAddressCountry(CountryExtended.US);
//
//            LetterEditable letterRaw = new LetterEditable();
//            letterRaw.setDescription("demo");
//            letterRaw.setTo(addressTo);
//            letterRaw.setFrom(addressFrom);
//            letterRaw.setFile("https://s3-us-west-2.amazonaws.com/public.lob.com/assets/us_letter_1pg.pdf");
//            letterRaw.setColor(true);
//            letterRaw.setExtraService(LetterEditable.ExtraServiceEnum.CERTIFIED);
//
//            Letter letter = apiInstance.create(letterRaw, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            Letter letter = apiInstance.get("ltr_4868c3b754655f90");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            LetterList letters = apiInstance.list(2, null, null, null, null, null, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            LetterDeletion letter = apiInstance.cancel("ltr_4868c3b754655f90");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/postcards",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> postcards(@RequestBody String body) {
        PostcardsApi apiInstance = new PostcardsApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            PostcardEditable postcardEditable = new PostcardEditable();
            JSONObject inputObj = new JSONObject(body);

            postcardEditable.setFront(inputObj.getString("front"));
            postcardEditable.setBack(inputObj.getString("back"));
            postcardEditable.setTo(inputObj.getString("to"));
            postcardEditable.setFrom(inputObj.getString("from"));

            // Operations
            ResponseModels.PostCardsResponse responseBody = new ResponseModels.PostCardsResponse();
            responseBody.setCreatedPostcard(apiInstance.create(postcardEditable, null));
            responseBody.setRetrievedPostcard(apiInstance.get(responseBody.getCreatedPostcard().getId()));
            responseBody.setListedPostcards(apiInstance.list(2, null, null, null, null, null, null, null, null, null, null));
            responseBody.setDeletedPostcard(apiInstance.cancel(responseBody.getCreatedPostcard().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

        try {
            AddressEditable toAddress = new AddressEditable();
            toAddress.setDescription("Harry - Office");
            toAddress.setName("Harry Zhang");
            toAddress.setCompany("Lob");
            toAddress.setEmail("harry@lob.com");
            toAddress.setPhone("5555555555");
            toAddress.setAddressLine1("210 King St");
            toAddress.setAddressLine2("# 6100");
            toAddress.setAddressCity("San Francisco");
            toAddress.setAddressState("CA");
            toAddress.setAddressZip("94107");
            toAddress.setAddressCountry(CountryExtended.US);

            AddressEditable fromAddress = new AddressEditable();
            fromAddress.setDescription("Harry - Office");
            fromAddress.setName("Harry Zhang");
            fromAddress.setCompany("Lob");
            fromAddress.setEmail("harry@lob.com");
            fromAddress.setPhone("5555555555");
            fromAddress.setAddressLine1("210 King St");
            fromAddress.setAddressLine2("# 6100");
            fromAddress.setAddressCity("San Francisco");
            fromAddress.setAddressState("CA");
            fromAddress.setAddressZip("94107");
            fromAddress.setAddressCountry(CountryExtended.US);

            PostcardEditable postcardRaw = new PostcardEditable();
            postcardRaw.setDescription("demo");
            postcardRaw.setTo(toAddress);
            postcardRaw.setFrom(fromAddress);
            postcardRaw.setFront("tmpl_a1234dddg");
            postcardRaw.setBack("tmpl_a1234dddg");
            postcardRaw.setSize(PostcardSize._6X9);
            postcardRaw.setMailType(MailType.FIRST_CLASS);

            Postcard postcard = apiInstance.create(postcardRaw, null);
        } catch (ApiException e) {
            e.printStackTrace();
        }

//        try {
//            Postcard postcard = apiInstance.get("psc_208e45e48d271294");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            PostcardList postcards = apiInstance.list(2, null, null, null, null, null, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            PostcardDeletion address = apiInstance.cancel("psc_208e45e48d271294");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/self_mailers",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> selfMailers(@RequestBody String body) {
        SelfMailersApi apiInstance = new SelfMailersApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            SelfMailerEditable selfMailerEditable = new SelfMailerEditable();
            JSONObject inputObj = new JSONObject(body);

            selfMailerEditable.setInside(inputObj.getString("inside"));
            selfMailerEditable.setOutside(inputObj.getString("outside"));
            selfMailerEditable.setTo(inputObj.getString("to"));
            selfMailerEditable.setFrom(inputObj.getString("from"));

            // Operations
            ResponseModels.SelfMailersResponse responseBody = new ResponseModels.SelfMailersResponse();
            responseBody.setCreatedSelfMailer(apiInstance.create(selfMailerEditable, null));
            responseBody.setRetrievedSelfMailer(apiInstance.get(responseBody.getCreatedSelfMailer().getId()));
            responseBody.setListedSelfMailers(apiInstance.list(2, null, null, null, null, null, null, null, null, null, null));
            responseBody.setDeletedSelfMailer(apiInstance.delete(responseBody.getCreatedSelfMailer().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

//        try {
//            AddressEditable toAddress = new AddressEditable();
//            toAddress.setDescription("Harry - Office");
//            toAddress.setName("Harry Zhang");
//            toAddress.setCompany("Lob");
//            toAddress.setEmail("harry@lob.com");
//            toAddress.setPhone("5555555555");
//            toAddress.setAddressLine1("210 King St");
//            toAddress.setAddressLine2("# 6100");
//            toAddress.setAddressCity("San Francisco");
//            toAddress.setAddressState("CA");
//            toAddress.setAddressZip("94107");
//            toAddress.setAddressCountry(CountryExtended.US);
//
//            AddressEditable fromAddress = new AddressEditable();
//            fromAddress.setDescription("Harry - Office");
//            fromAddress.setName("Harry Zhang");
//            fromAddress.setCompany("Lob");
//            fromAddress.setEmail("harry@lob.com");
//            fromAddress.setPhone("5555555555");
//            fromAddress.setAddressLine1("210 King St");
//            fromAddress.setAddressLine2("# 6100");
//            fromAddress.setAddressCity("San Francisco");
//            fromAddress.setAddressState("CA");
//            fromAddress.setAddressZip("94107");
//            fromAddress.setAddressCountry(CountryExtended.US);
//
//            SelfMailerEditable mailerRaw = new SelfMailerEditable();
//            mailerRaw.setTo(toAddress);
//            mailerRaw.setFrom(objectMapper.writeValueAsString(fromAddress));
//
//            SelfMailer selfMailer = apiInstance.create(mailerRaw, null);
//        } catch (ApiException | JsonProcessingException e) {
//            e.printStackTrace();
//        }

//        try {
//            SelfMailer selfMailer = apiInstance.get("sfm_8ffbe811dea49dcf");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            SelfMailerList selfMailer = apiInstance.list(2, null, null, null, null, null, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            SelfMailerDeletion selfMailer = apiInstance.delete("sfm_8ffbe811dea49dcf");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/templates",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> templates(@RequestBody String body) {
        TemplatesApi apiInstance = new TemplatesApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            TemplateWritable templateWritable = new TemplateWritable();
            TemplateUpdate templateUpdate = new TemplateUpdate();
            JSONObject inputObj = new JSONObject(body);

            templateWritable.setDescription(inputObj.getString("description"));
            templateWritable.setHtml(inputObj.getString("html"));

            // Operations
            ResponseModels.TemplatesResponse responseBody = new ResponseModels.TemplatesResponse();
            responseBody.setCreatedTemplate(apiInstance.create(templateWritable));
            responseBody.setRetrievedTemplate(apiInstance.get(responseBody.getCreatedTemplate().getId()));
            responseBody.setListedTemplates(apiInstance.list(2, null, null, null, null, null));

            templateUpdate.setDescription("updated template");
            templateUpdate.setPublishedVersion(responseBody.getCreatedTemplate().getPublishedVersion().getId());

            responseBody.setUpdatedTemplate(apiInstance.update(responseBody.getCreatedTemplate().getId(), templateUpdate));
            responseBody.setDeletedTemplate(apiInstance.delete(responseBody.getCreatedTemplate().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

//        try {
//            AddressEditable addressRaw = new AddressEditable();
//            addressRaw.setName("Harry Zhang");
//            addressRaw.setCompany("Lob");
//            addressRaw.setEmail("harry@lob.com");
//            addressRaw.setPhone("5555555555");
//            addressRaw.setAddressLine1("210 King St");
//            addressRaw.setAddressLine2("# 6100");
//            addressRaw.setAddressCity("San Francisco");
//            addressRaw.setAddressState("CA");
//            addressRaw.setAddressZip("94107");
//            addressRaw.setAddressCountry(CountryExtended.US);
//
//            Address address = apiInstance.create(addressRaw);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            Address address = apiInstance.get("adr_fa85158b26c3eb7c");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            AddressList addresses = apiInstance.list(2, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            AddressDeletion address = apiInstance.delete("adr_fa85158b26c3eb7c");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }

    @RequestMapping(
            value = "/template_versions",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> templateVersions(@RequestBody String body) {
        TemplateVersionsApi apiInstance = new TemplateVersionsApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Required Setup
            TemplatesApi templatesApi = new TemplatesApi(this.lobClient);
            TemplateWritable templateWritable = new TemplateWritable();
            templateWritable.setHtml("<html>Updated HTML for {{name}}</html>");
            templateWritable.setDescription("Newer Template");
            String templateId = templatesApi.create(templateWritable).getId();

            // Read input values
            TemplateVersionWritable templateVersionWritable = new TemplateVersionWritable();
            TemplateVersionUpdatable templateUpdate = new TemplateVersionUpdatable();
            JSONObject inputObj = new JSONObject(body);

            templateVersionWritable.setDescription(inputObj.getString("description"));
            templateVersionWritable.setHtml(inputObj.getString("html"));

            // Operations
            ResponseModels.TemplateVersionsResponse responseBody = new ResponseModels.TemplateVersionsResponse();
            responseBody.setCreatedVersion(apiInstance.create(templateId, templateVersionWritable));
            responseBody.setRetrievedVersion(apiInstance.get(templateId, responseBody.getCreatedVersion().getId()));
            responseBody.setListedVersions(apiInstance.list(templateId, 2, null, null, null, null));

            templateUpdate.setDescription("updated template");

            responseBody.setUpdatedVersion(apiInstance.update(templateId, responseBody.getCreatedVersion().getId(), templateUpdate));
            responseBody.setDeletedVersion(apiInstance.delete(templateId, responseBody.getCreatedVersion().getId()));

            jsonInString = objectMapper.writeValueAsString(responseBody);

            // Required Teardown
            templatesApi.delete(templateId);
        } catch (IOException | ApiException e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            e.printStackTrace();
        }

//        try {
//            AddressEditable addressRaw = new AddressEditable();
//            addressRaw.setName("Harry Zhang");
//            addressRaw.setCompany("Lob");
//            addressRaw.setEmail("harry@lob.com");
//            addressRaw.setPhone("5555555555");
//            addressRaw.setAddressLine1("210 King St");
//            addressRaw.setAddressLine2("# 6100");
//            addressRaw.setAddressCity("San Francisco");
//            addressRaw.setAddressState("CA");
//            addressRaw.setAddressZip("94107");
//            addressRaw.setAddressCountry(CountryExtended.US);
//
//            Address address = apiInstance.create(addressRaw);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            Address address = apiInstance.get("adr_fa85158b26c3eb7c");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            AddressList addresses = apiInstance.list(2, null, null, null, null, null);
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

//        try {
//            AddressDeletion address = apiInstance.delete("adr_fa85158b26c3eb7c");
//        } catch (ApiException e) {
//            e.printStackTrace();
//        }

        return new ResponseEntity<String>(jsonInString, status);
    }
}
