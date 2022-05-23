package com.example;

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
        class AddressesResponse {
            private Address createdAddress;
            public Address getCreatedAddress() { return this.createdAddress; }
            public void setCreatedAddress(Address address) { this.createdAddress = address; }

            private Address retrievedAddress;
            public Address getRetrievedAddress() { return this.retrievedAddress; }
            public void setRetrievedAddress(Address address) { this.retrievedAddress = address; }

            private AddressList listedAddresses;
            public AddressList getListedAddresses() { return this.listedAddresses; }
            public void setListedAddresses(AddressList addresses) { this.listedAddresses = addresses; }

            private AddressDeletion deletedAddress;
            public AddressDeletion getDeletedAddress() { return this.deletedAddress; }
            public void setDeletedAddress(AddressDeletion address) { this.deletedAddress = address; }
        }
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
            AddressesResponse responseBody = new AddressesResponse();
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
        // ToDo: This is broken
        class BankAccountsResponse {
            private BankAccount createdBankAccount;
            public BankAccount getCreatedBankAccount() { return this.createdBankAccount; }
            public void setCreatedBankAccount(BankAccount address) { this.createdBankAccount = address; }

            private BankAccount retrievedBankAccount;
            BankAccount getRetrievedBankAccount() { return this.retrievedBankAccount; }
            public void setRetrievedBankAccount(BankAccount account) { this.retrievedBankAccount = account; }

            private BankAccountList listedAccounts;
            public BankAccountList getListedAccounts() { return this.listedAccounts; }
            public void setListedAccount(BankAccountList accounts) { this.listedAccounts = accounts; }

            private BankAccountDeletion deletedBankAccount;
            public BankAccountDeletion getDeletedBankAccount() { return this.deletedBankAccount; }
            public void setDeletedBankAccount(BankAccountDeletion account) { this.deletedBankAccount = account; }
        }
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
            BankAccountsResponse responseBody = new BankAccountsResponse();
            System.out.println(bankAccountWritable);
            // BankAccount ba = apiInstance.create(bankAccountWritable);
            // responseBody.setCreatedBankAccount(ba);
            // responseBody.setRetrievedBankAccount(apiInstance.get(responseBody.getCreatedBankAccount().getId()));
            responseBody.setListedAccount(apiInstance.list(2, null, null, null, null, null));
            // responseBody.setDeletedBankAccount(apiInstance.delete(responseBody.getCreatedBankAccount().getId()));

            System.out.println(responseBody.getListedAccounts());
            jsonInString = objectMapper.writeValueAsString(responseBody);
            System.out.println(jsonInString);
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
        class ChecksResponse {
            private Check createdCheck;
            public Check getCreatedCheck() { return this.createdCheck; }
            public void setCreatedCheck(Check check) { this.createdCheck = check; }

            private Check retrievedCheck;
            Check getRetrievedCheck() { return this.retrievedCheck; }
            public void setRetrievedCheck(Check check) { this.retrievedCheck = check; }

            private CheckList listedChecks;
            public CheckList getListedChecks() { return this.listedChecks; }
            public void setListedChecks(CheckList checks) { this.listedChecks = checks; }

            private CheckDeletion deletedCheck;
            public CheckDeletion getDeletedCheck() { return this.deletedCheck; }
            public void setDeletedCheck(CheckDeletion check) { this.deletedCheck = check; }
        }
        ChecksApi apiInstance = new ChecksApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            CheckEditable checkEditable = new CheckEditable();
            JSONObject inputObj = new JSONObject(body);

            checkEditable.setDescription(inputObj.getString("description"));

            // Operations
            ChecksResponse responseBody = new ChecksResponse();
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
            value = "/letters",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> letters(@RequestBody String body) {
        class LettersResponse {
            private Letter createdLetter;
            public Letter getCreatedLetter() { return this.createdLetter; }
            public void setCreatedLetter(Letter letter) { this.createdLetter = letter; }

            private Letter retrievedLetter;
            Letter getRetrievedLetter() { return this.retrievedLetter; }
            public void setRetrievedLetter(Letter letter) { this.retrievedLetter = letter; }

            private LetterList listedLetters;
            public LetterList getListedLetters() { return this.listedLetters; }
            public void setListedLetters(LetterList letters) { this.listedLetters = letters; }

            private LetterDeletion deletedLetter;
            public LetterDeletion getDeletedLetter() { return this.deletedLetter; }
            public void setDeletedLetter(LetterDeletion letter) { this.deletedLetter = letter; }
        }
        LettersApi apiInstance = new LettersApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            LetterEditable letterEditable = new LetterEditable();
            JSONObject inputObj = new JSONObject(body);

            letterEditable.setDescription(inputObj.getString("description"));

            // Operations
            LettersResponse responseBody = new LettersResponse();
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
            value = "/self_mailers",
            method = RequestMethod.POST,
            produces = "application/json",
            consumes = "application/json"
    )
    @ResponseBody
    public ResponseEntity<String> selfMailers(@RequestBody String body) {
        class SelfMailersResponse {
            private SelfMailer createdSelfMailer;
            public SelfMailer getCreatedSelfMailer() { return this.createdSelfMailer; }
            public void setCreatedSelfMailer(SelfMailer mailer) { this.createdSelfMailer = mailer; }

            private SelfMailer retrievedSelfMailer;
            SelfMailer getRetrievedSelfMailer() { return this.retrievedSelfMailer; }
            public void setRetrievedSelfMailer(SelfMailer mailer) { this.retrievedSelfMailer = mailer; }

            private SelfMailerList listedSelfMailers;
            public SelfMailerList getListedSelfMailers() { return this.listedSelfMailers; }
            public void setListedSelfMailers(SelfMailerList letters) { this.listedSelfMailers = letters; }

            private SelfMailerDeletion deletedSelfMailer;
            public SelfMailerDeletion getDeletedSelfMailer() { return this.deletedSelfMailer; }
            public void setDeletedSelfMailer(SelfMailerDeletion letter) { this.deletedSelfMailer = letter; }
        }
        SelfMailersApi apiInstance = new SelfMailersApi(this.lobClient);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInString = "{}";
        HttpStatus status = HttpStatus.OK;
        try {
            // Read input values
            SelfMailerEditable letterEditable = new SelfMailerEditable();
            JSONObject inputObj = new JSONObject(body);

            letterEditable.setDescription(inputObj.getString("description"));

            // Operations
            SelfMailersResponse responseBody = new SelfMailersResponse();
            SelfMailer mailer = apiInstance.create(letterEditable, null);
            responseBody.setCreatedSelfMailer(mailer);
            responseBody.setRetrievedSelfMailer(apiInstance.get(responseBody.getCreatedSelfMailer().getId()));
            responseBody.setListedSelfMailers(apiInstance.list(2, null, null, null, null, null, null, null, null, null, null));
            responseBody.setDeletedSelfMailer(apiInstance.delete(responseBody.getCreatedSelfMailer().getId()));

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
}
