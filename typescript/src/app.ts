require("dotenv").config();
import * as bodyParser from "body-parser";
import * as crypto from 'crypto';
import { create } from "domain";
import express from "express";
import { Request, Response } from "express";
import * as fs from "fs";

const session = require("express-session");
var FileStore = require('session-file-store')(session);
const path = require("path");

import {
        Configuration,
        Address, AddressesApi, AddressEditable, AddressDeletion, AddressList,
        BankAccountsApi, BankAccountVerify, BankAccountWritable, BankTypeEnum,
        ChecksApi, CheckEditable,
        IntlVerificationsApi, IntlVerificationWritable, CountryExtended, IntlVerificationsPayload,
        Letter, LetterList, LetterDeletion, LettersApi, LetterEditable, LetterEditableExtraServiceEnum,
        Postcard, PostcardsApi, PostcardEditable, PostcardList, PostcardDeletion,
        ReverseGeocodeLookupsApi, Location,
        SelfMailer, SelfMailerList, SelfMailerDeletion, SelfMailersApi, SelfMailerEditable,
        TemplatesApi, TemplateWritable, TemplateUpdate, TemplateVersionWritable, TemplateVersionUpdatable, TemplateVersionsApi,
        USAutocompletionsApi, UsAutocompletionsWritable,
        UsVerification, UsVerifications, USVerificationsApi, UsVerificationsWritable, MultipleComponentsList,
        ZipLookupsApi, Zip, ZipEditable
    } from "@lob/lob-typescript-sdk";

const config: Configuration = new Configuration({
    username: process.env.LOB_API_KEY
});

const av_config: Configuration = new Configuration({
    username: process.env.LOB_API_KEY
});

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        this.app.use(express.static(path.join(__dirname, "public")));
      }

    private config(): void {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use('/webhooks', bodyParser.raw({ type: 'application/json' }));
        this.app.use(bodyParser.json());
      }

    private async createAddressForMailpieces(): Promise<string> {
        const addressData : AddressEditable = {
            name: "Wednesday Addams",
            address_line1: "1313 CEMETERY LN",
            address_city: "WESTFIELD",
            address_state: "NJ",
            address_zip: "07090",
        };
        let id = "";
        try {
            const result = await new AddressesApi(config).create(addressData);
            if (result.id) {
                id = result.id;
            } else {
                throw new Error("Address creation must return a valid ID");
            }
        } catch (err: any) {
            console.error(err);
        }
        return id;
    }

    private async createTemplateForVersions(): Promise<string> {
        const templateData: TemplateWritable = {
            description: "Newer Template",
            html: "<html>Updated HTML for {{name}}</html>",
        };
        let id = "";
        try {
            const result = await new TemplatesApi(config).create(templateData);
            id = result.id;
        } catch (err: any) {
            console.error(err);
        }
        return id;
    }

    private async deleteAddress(addressId: string) {
        try {
            await new AddressesApi(config).delete(addressId);
        } catch (err: any) {
            console.error(err);
        }
    }

    private async deleteTemplate(templateId: string) {
        try {
            await new TemplatesApi(config).delete(templateId);
        } catch (err: any) {
            console.error(err);
        }
    }

    private async deleteBankAccount(bankId: string) {
        try {
            await new BankAccountsApi(config).delete(bankId);
        } catch (err: any) {
            console.error(err);
        }
    }

    private async createVerifiedBankAccount(): Promise<string> {
        const api = new BankAccountsApi(config);
        const bankData: BankAccountWritable = {
            description: "Test Bank Account",
            routing_number: "322271627",
            account_number: "123456789",
            signatory: "Gomez Addams",
            account_type: BankTypeEnum.Individual,
        };
        const verificationData: BankAccountVerify = {
          amounts: [11, 35],
        };
        let id = "";
        try {
            const result = await api.create(bankData)
            const verifiedAccount = await api.verify(result.id, verificationData);
            id = verifiedAccount.id;
        } catch (err: any) {
            console.error(err);
        }
        return id;
    }

    private routes(): void {
        const router = express.Router();
    
        router.get("/addresses", async (req: Request, res: Response) => {
            console.log('hit');
            // create, get, list, delete address
            const Addresses = new AddressesApi(config);
            const addressData : AddressEditable = {
                name: "Thing T. Thing",
                address_line1: "1313 CEMETERY LN",
                address_city: "WESTFIELD",
                address_state: "NJ",
                address_zip: "07000",
            };
            try {
                // only create is assigned to a new object, as 
                const createAddress : Address = await Addresses.create(addressData);
                const getAddress : Address = await Addresses.get(createAddress.id);
                const listAddresses : AddressList = await Addresses.list(2);
                const deleteAddress : AddressDeletion = await Addresses.delete(createAddress.id);
                res.statusCode(200).send({
                    createdAddress: createAddress,
                    retrievedAddress: getAddress,
                    listedAddresses: listAddresses,
                    deletedAddress: deleteAddress
                });
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/postcards", async (req: Request, res: Response) => {
            // create, get, list, cancel postcard
            const Postcards = new PostcardsApi(config);
            const addressId = await this.createAddressForMailpieces();
            const postcardData : PostcardEditable = {
                to: addressId,
                from: addressId,
                front:
                "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf",
                back: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf"
            }
            try {
                // only create is assigned to a new object, as 
                const createPostcard : Postcard = await Postcards.create(postcardData);
                const getPostcard : Postcard = await Postcards.get(createPostcard.id);
                const listPostcard : PostcardList = await Postcards.list(2);
                const cancelPostcard : PostcardDeletion = await Postcards.cancel(createPostcard.id);
                res.render("postcards", {
                    createdPostcard: createPostcard,
                    retrievedPostcard: getPostcard,
                    listedPostcards: listPostcard,
                    deletedPostcard: cancelPostcard
                });
                await this.deleteAddress(addressId);
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/us_verifications", async (req: Request, res: Response) => {
            // verify a US address
            const UsVerifications = new USVerificationsApi(av_config);
            const verificationData1: UsVerificationsWritable = {
                primary_line: "001 CEMETERY LANE",
                city: "WESTFIELD",
                state: "NJ",
                zip_code: "07090",
            };
            const verificationData2: UsVerificationsWritable = {
                primary_line: "1515 CEMETERY LN",
                city: "WESTFIELD",
                state: "NJ",
                zip_code: "07090",
            };
            const addressList: MultipleComponentsList = {
                addresses: [verificationData1, verificationData2]
            }
            try {
                const singleVerified : UsVerification = await UsVerifications.verifySingle(verificationData1);
                const bulkVerified : UsVerifications = await UsVerifications.verifyBulk(addressList);
                console.log(bulkVerified);
                res.render("./us_verifications", {
                    singleVerify: singleVerified,
                    bulkVerify: bulkVerified
                });
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/self_mailers", async (req: Request, res: Response) => {
            // create, get, list, cancel self-mailer
            const SelfMailers = new SelfMailersApi(config);
            const addressId = await this.createAddressForMailpieces();
            const selfMailerData : SelfMailerEditable = {
                to: addressId,
                from: addressId,
                inside:
                    "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_inside.pdf",
                outside:
                    "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_outside.pdf"
            }

            try {
                const createSelfMailer : SelfMailer = await SelfMailers.create(selfMailerData);
                const getSelfMailer : SelfMailer = await SelfMailers.get(createSelfMailer.id);
                const listSelfMailer : SelfMailerList = await SelfMailers.list(2);
                const deleteSelfMailer : SelfMailerDeletion = await SelfMailers.delete(createSelfMailer.id);
                res.render("self_mailers", {
                    createdSelfMailer: createSelfMailer,
                    retrievedSelfMailer: getSelfMailer,
                    listedSelfMailers: listSelfMailer,
                    deletedSelfMailer: deleteSelfMailer
                });
                await this.deleteAddress(addressId);
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/letters", async (req: Request, res: Response) => {
            // create, get, list, cancel self-mailer
            const Letters = new LettersApi(config);
            const addressId = await this.createAddressForMailpieces();
            const letterData : LetterEditable = {
                to: addressId,
                from: addressId,
                color: true,
                extra_service: LetterEditableExtraServiceEnum.Certified,
                file: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/us_letter_1pg.pdf"
            }

            try {
                const createLetter : Letter = await Letters.create(letterData);
                const getLetter : Letter = await Letters.get(createLetter.id);
                const listLetters : LetterList = await Letters.list(2);
                const deleteLetter : LetterDeletion = await Letters.cancel(createLetter.id);
                res.render("letters", {
                    createdLetter: createLetter,
                    retrievedLetter: getLetter,
                    listedLetters: listLetters,
                    deletedLetter: deleteLetter
                });
                await this.deleteAddress(addressId);
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/bank_accounts", async (req: Request, res: Response) => {
            // create, get, list, delete bank account
            const BankAccounts = new BankAccountsApi(config);
            // we might need to create new valid routing and account numbers
            const bankData: BankAccountWritable = {
                description: "Test Bank Account",
                routing_number: "322271627",
                account_number: "123456789",
                signatory: "Morticia Addams",
                account_type: BankTypeEnum.Individual,
            };
            const verify: BankAccountVerify = {
              amounts: [11, 35],
            };

            try {
                const createBankAccount = await BankAccounts.create(bankData);
                const verifyBankAccount = await BankAccounts.verify(createBankAccount.id, verify);
                const getBankAccount = await BankAccounts.get(createBankAccount.id);
                const listBankAccounts = await BankAccounts.list(2);
                const deleteBankAccount = await BankAccounts.delete(createBankAccount.id);
                res.render("bank_accounts", {
                    createdAccount: createBankAccount,
                    verifiedAccount: verifyBankAccount,
                    retrievedAccount: getBankAccount,
                    listedAccounts: listBankAccounts,
                    deletedAccount: deleteBankAccount
                });
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/checks", async (req: Request, res: Response) => {
            // create, get, list, cancel check
            const Checks = new ChecksApi(config);
            const bankAccountId = await this.createVerifiedBankAccount();
            const addressId = await this.createAddressForMailpieces();
            const checkData : CheckEditable = {
                to: addressId,
                from: addressId,
                bank_account: bankAccountId,
                amount: 100
            }
            try {
                const createCheck = await Checks.create(checkData);
                const getCheck = await Checks.get(createCheck.id);
                const listChecks = await Checks.list(2);
                const deleteCheck = await Checks.cancel(createCheck.id);
                res.render("checks", {
                    createdCheck: createCheck,
                    retrievedCheck: getCheck,
                    listedChecks: listChecks,
                    deletedCheck: deleteCheck
                });
                await this.deleteAddress(addressId);
                await this.deleteBankAccount(bankAccountId);
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/templates", async (req: Request, res: Response) => {
            // create, get, update, list, delete template
            const Templates = new TemplatesApi(config);
            const templateData: TemplateWritable = {
                description: "Newer Template",
                html: "<html>Updated HTML for {{name}}</html>",
            };
            try {
                const createTemplate = await Templates.create(templateData);
                console.log("published version: ", createTemplate.published_version?.id);
                const getTemplate = await Templates.get(createTemplate.id);
                const listTemplates = await Templates.list(2);
                const updateData: TemplateUpdate = {
                    description: "updated template",
                    published_version: createTemplate.published_version?.id as string
                }
                const updateTemplate = await Templates.update(createTemplate.id, updateData);
                const deleteTemplate = await Templates.delete(createTemplate.id);
                res.render("templates", {
                    createdTemplate: createTemplate,
                    retrievedTemplate: getTemplate,
                    listedTemplates: listTemplates,
                    updatedTemplate: updateTemplate,
                    deletedTemplate: deleteTemplate
                });
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/template_versions", async (req: Request, res: Response) => {
            // create, get, update, list, delete template versions
            const TemplateVersions = new TemplateVersionsApi(config);
            const templateId = await this.createTemplateForVersions();
            const templateData: TemplateVersionWritable = {
                description: "Newer Template",
                html: "<html>Updated HTML for {{name}}</html>",
            };
            try {
                const createTemplateVersion = await TemplateVersions.create(templateId, templateData);
                const getTemplateVersion = await TemplateVersions.get(templateId, createTemplateVersion.id);
                const listTemplateVersions = await TemplateVersions.list(templateId);
                const updateData: TemplateVersionUpdatable = {
                    description: "updated template version",
                }
                const updateTemplateVersion = await TemplateVersions.update(templateId, createTemplateVersion.id, updateData);
                const deleteTemplateVersion = await TemplateVersions.delete(templateId, createTemplateVersion.id);
                res.render("template_versions", {
                    createdVersion: createTemplateVersion,
                    retrievedVersion: getTemplateVersion,
                    listedVersions: listTemplateVersions,
                    updatedVersion: updateTemplateVersion,
                    deletedVersion: deleteTemplateVersion
                });
                this.deleteTemplate(templateId);
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/intl_verifications", async (req: Request, res: Response) => {
            // verify a non-US address
            const IntlVerifications = new IntlVerificationsApi(av_config);
            const verificationData1: IntlVerificationWritable = {
                primary_line: "370 WATER ST",
                postal_code: "C1N 1C4",
                country: CountryExtended.Ca,
            };
            const verificationData2: IntlVerificationWritable = {
                primary_line: "012 PLACEHOLDER ST",
                postal_code: "F0O 8A2",
                country: CountryExtended.Ca,
            };
            const addressList: IntlVerificationsPayload = {
                addresses: [verificationData1, verificationData2]
            }
            try {
                const singleVerified = await IntlVerifications.verifySingle(verificationData1);
                const bulkVerified = await IntlVerifications.verifyBulk(addressList);
                res.render("intl_verifications", {
                    singleVerify: singleVerified,
                    bulkVerify: bulkVerified
                });
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/us_autocompletions", async (req: Request, res: Response) => {
            // autocomplete partial address data
            const UsAutocompletions = new USAutocompletionsApi(av_config);
            const autocompletionData: UsAutocompletionsWritable = {
                address_prefix: "185 B",
                city: "SAN FRANCISCO"
            };
            try {
                const autocompletedAddresses = await UsAutocompletions.autocomplete(autocompletionData);
                res.render("us_autocompletions", {
                    autocompleted: autocompletedAddresses
                });
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/reverse_geocode_lookups", async (req: Request, res: Response) => {
            // look up a latitude and longitude
            const ReverseGeocodeLookup = new ReverseGeocodeLookupsApi(av_config);
            const coordinates: Location = {
                latitude: 37.777456,
                longitude: -122.393039
              };
            try {
                const geocode = await ReverseGeocodeLookup.lookup(coordinates);
                res.render("reverse_geocode_lookups", {
                    geocode: geocode
                });
            } catch (err: any) {
                console.error(err);
            }
        });

        router.get("/zip_lookups", async (req: Request, res: Response) => {
            // look up a zip code
            const ZipLookup = new ZipLookupsApi(av_config);
            const zipRequest : ZipEditable = {
                zip_code: "07090"
            }
            try {
                const zipLookup : Zip = await ZipLookup.lookup(zipRequest);
                console.log("Result of Zip Lookup: ", zipLookup);
                res.render("zip_lookups", {
                    lookup: zipLookup
                });
            } catch (err: any) {
                console.error(err);
            }
        });
    
        const fileStoreOptions = {}

        this.app.use(session({
          secret: "dummy secret",
          store: new FileStore(fileStoreOptions),
          resave: false,
          saveUninitialized: false,
          cookie: { secure: false },
        }));
    
        this.app.use("/", router);
    }
}

export default new App().app;