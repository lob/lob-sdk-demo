package com.example;

import org.openapitools.client.model.*;

public class ResponseModels {

    static class AddressesResponse {
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

    static class BankAccountsResponse {
        private BankAccount createdAccount;
        public BankAccount getCreatedAccount() { return this.createdAccount; }
        public void setCreatedAccount(BankAccount address) { this.createdAccount = address; }

        private BankAccount verifiedAccount;
        public BankAccount getVerifiedAccount() { return this.verifiedAccount; }
        public void setVerifiedAccount(BankAccount account) { this.verifiedAccount = account; }

        private BankAccount retrievedAccount;
        public BankAccount getRetrievedAccount() { return this.retrievedAccount; }
        public void setRetrievedAccount(BankAccount account) { this.retrievedAccount = account; }

        private BankAccountList listedAccounts;
        public BankAccountList getListedAccounts() { return this.listedAccounts; }
        public void setListedAccount(BankAccountList accounts) { this.listedAccounts = accounts; }

        private BankAccountDeletion deletedAccount;
        public BankAccountDeletion getDeletedAccount() { return this.deletedAccount; }
        public void setDeletedAccount(BankAccountDeletion account) { this.deletedAccount = account; }
    }

    static class ChecksResponse {
        private Check createdCheck;
        public Check getCreatedCheck() { return this.createdCheck; }
        public void setCreatedCheck(Check check) { this.createdCheck = check; }

        private Check retrievedCheck;
        public Check getRetrievedCheck() { return this.retrievedCheck; }
        public void setRetrievedCheck(Check check) { this.retrievedCheck = check; }

        private CheckList listedChecks;
        public CheckList getListedChecks() { return this.listedChecks; }
        public void setListedChecks(CheckList checks) { this.listedChecks = checks; }

        private CheckDeletion deletedCheck;
        public CheckDeletion getDeletedCheck() { return this.deletedCheck; }
        public void setDeletedCheck(CheckDeletion check) { this.deletedCheck = check; }
    }

    static class LettersResponse {
        private Letter createdLetter;
        public Letter getCreatedLetter() { return this.createdLetter; }
        public void setCreatedLetter(Letter letter) { this.createdLetter = letter; }

        private Letter retrievedLetter;
        public Letter getRetrievedLetter() { return this.retrievedLetter; }
        public void setRetrievedLetter(Letter letter) { this.retrievedLetter = letter; }

        private LetterList listedLetters;
        public LetterList getListedLetters() { return this.listedLetters; }
        public void setListedLetters(LetterList letters) { this.listedLetters = letters; }

        private LetterDeletion deletedLetter;
        public LetterDeletion getDeletedLetter() { return this.deletedLetter; }
        public void setDeletedLetter(LetterDeletion letter) { this.deletedLetter = letter; }
    }

    static class PostCardsResponse {
        private Postcard createdPostcard;
        public Postcard getCreatedPostcard() { return this.createdPostcard; }
        public void setCreatedPostcard(Postcard postcard) { this.createdPostcard = postcard; }

        private Postcard retrievedPostcard;
        public Postcard getRetrievedPostcard() { return this.retrievedPostcard; }
        public void setRetrievedPostcard(Postcard postcard) { this.retrievedPostcard = postcard; }

        private PostcardList listedPostcards;
        public PostcardList getListedPostcards() { return this.listedPostcards; }
        public void setListedPostcards(PostcardList postcards) { this.listedPostcards = postcards; }

        private PostcardDeletion deletedPostcard;
        public PostcardDeletion getDeletedPostcard() { return this.deletedPostcard; }
        public void setDeletedPostcard(PostcardDeletion postcard) { this.deletedPostcard = postcard; }
    }

    static class SelfMailersResponse {
        private SelfMailer createdSelfMailer;
        public SelfMailer getCreatedSelfMailer() { return this.createdSelfMailer; }
        public void setCreatedSelfMailer(SelfMailer mailer) { this.createdSelfMailer = mailer; }

        private SelfMailer retrievedSelfMailer;
        public SelfMailer getRetrievedSelfMailer() { return this.retrievedSelfMailer; }
        public void setRetrievedSelfMailer(SelfMailer mailer) { this.retrievedSelfMailer = mailer; }

        private SelfMailerList listedSelfMailers;
        public SelfMailerList getListedSelfMailers() { return this.listedSelfMailers; }
        public void setListedSelfMailers(SelfMailerList letters) { this.listedSelfMailers = letters; }

        private SelfMailerDeletion deletedSelfMailer;
        public SelfMailerDeletion getDeletedSelfMailer() { return this.deletedSelfMailer; }
        public void setDeletedSelfMailer(SelfMailerDeletion letter) { this.deletedSelfMailer = letter; }
    }

    static class TemplatesResponse {
        private Template createdTemplate;
        public Template getCreatedTemplate() { return this.createdTemplate; }
        public void setCreatedTemplate(Template template) { this.createdTemplate = template; }

        private Template retrievedTemplate;
        public Template getRetrievedTemplate() { return this.retrievedTemplate; }
        public void setRetrievedTemplate(Template template) { this.retrievedTemplate = template; }

        private Template updatedTemplate;
        public Template getUpdatedTemplate() { return this.updatedTemplate; }
        public void setUpdatedTemplate(Template template) { this.updatedTemplate = template; }

        private TemplateList listedTemplates;
        public TemplateList getListedTemplates() { return this.listedTemplates; }
        public void setListedTemplates(TemplateList templates) { this.listedTemplates = templates; }

        private TemplateDeletion deletedTemplate;
        public TemplateDeletion getDeletedTemplate() { return this.deletedTemplate; }
        public void setDeletedTemplate(TemplateDeletion template) { this.deletedTemplate = template; }
    }

    static class TemplateVersionsResponse {
        private TemplateVersion createdVersion;
        public TemplateVersion getCreatedVersion() { return this.createdVersion; }
        public void setCreatedVersion(TemplateVersion templateVersion) { this.createdVersion = templateVersion; }

        private TemplateVersion retrievedVersion;
        public TemplateVersion getRetrievedVersion() { return this.retrievedVersion; }
        public void setRetrievedVersion(TemplateVersion templateVersion) { this.retrievedVersion = templateVersion; }

        private TemplateVersion updatedVersion;
        public TemplateVersion getUpdatedVersion() { return this.updatedVersion; }
        public void setUpdatedVersion(TemplateVersion templateVersion) { this.updatedVersion = templateVersion; }

        private TemplateVersionList listedVersions;
        public TemplateVersionList getListedVersions() { return this.listedVersions; }
        public void setListedVersions(TemplateVersionList templateVersions) { this.listedVersions = templateVersions; }

        private TemplateVersionDeletion deletedVersion;
        public TemplateVersionDeletion getDeletedVersion() { return this.deletedVersion; }
        public void setDeletedVersion(TemplateVersionDeletion templateVersion) { this.deletedVersion = templateVersion; }
    }
}
