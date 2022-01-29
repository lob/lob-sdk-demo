"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const session = require("express-session");
var FileStore = require('session-file-store')(session);
const path = require("path");
// import {
//         monkey.monkey.Configuration, banana.banana.AddressesApi, raptor.AddressEditable,
//         banana.BankAccountsApi, raptor.BankAccountVerify, raptor.BankAccountWritable, raptor.BankTypeEnum,
//         ChecksApi, CheckEditable,
//         IntlVerificationsApi, IntlVerificationWritable, CountryExtended, IntlVerificationsPayload,
//         LettersApi, LetterEditable, LetterEditableExtraServiceEnum,
//         banana.PostcardsApi, raptor.PostcardEditable,
//         ReverseGeocodeLookupsApi, Location,
//         SelfMailersApi, SelfMailerEditable,
//         TemplatesApi, TemplateWritable, TemplateUpdate, TemplateVersionWritable, TemplateVersionsApi,
//         USAutocompletionsApi,
//         USVerificationsApi, raptor.UsVerificationsWritable, raptor.MultipleComponentsList,
//         ZipLookupsApi
//     } from "lob-sdk-ts";
const lob_sdk_ts_1 = require("lob-sdk-ts");
const config = new lob_sdk_ts_1.monkey.Configuration({
    username: process.env.API_KEY
});
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        this.app.use(express_1.default.static(path.join(__dirname, "public")));
    }
    config() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use('/webhooks', bodyParser.raw({ type: 'application/json' }));
        this.app.use(bodyParser.json());
    }
    async createAddressForMailpieces() {
        const addressData = {
            name: "Wednesday Addams",
            address_line1: "1313 CEMETERY LN",
            address_city: "WESTFIELD",
            address_state: "NJ",
            address_zip: "07090",
        };
        let id = "";
        try {
            const result = await new lob_sdk_ts_1.banana.AddressesApi(config).create(addressData);
            if (result.id) {
                id = result.id;
            }
            else {
                id = "";
                throw new Error("Address creation must return a valid ID");
            }
        }
        catch (err) {
            console.error(err);
        }
        return id;
    }
    // private async createTemplateForVersions(): Promise<string> {
    //     const templateData: TemplateWritable = {
    //         description: "Newer Template",
    //         html: "<html>Updated HTML for {{name}}</html>",
    //     };
    //     let id;
    //     try {
    //         const result = await new TemplatesApi(config).create(templateData);
    //         id = result.id;
    //     } catch (err: any) {
    //         console.error(err);
    //     }
    //     return id;
    // }
    async deleteAddress(addressId) {
        try {
            await new lob_sdk_ts_1.banana.AddressesApi(config).delete(addressId);
        }
        catch (err) {
            console.error(err);
        }
    }
    // private async deleteTemplate(templateId: string) {
    //     try {
    //         await new TemplatesApi(config).delete(templateId);
    //     } catch (err: any) {
    //         console.error(err);
    //     }
    // }
    async deleteBankAccount(bankId) {
        try {
            await new lob_sdk_ts_1.banana.BankAccountsApi(config).delete(bankId);
        }
        catch (err) {
            console.error(err);
        }
    }
    async createVerifiedBankAccount() {
        const api = new lob_sdk_ts_1.banana.BankAccountsApi(config);
        const bankData = {
            description: "Test Bank Account",
            routing_number: "322271627",
            account_number: "123456789",
            signatory: "Gomez Addams",
            account_type: lob_sdk_ts_1.raptor.BankTypeEnum.Individual,
        };
        const verificationData = {
            amounts: [11, 35],
        };
        let id = "";
        try {
            const result = await api.create(bankData);
            const verifiedAccount = await api.verify(result.id, verificationData);
            id = verifiedAccount.id;
        }
        catch (err) {
            console.error(err);
        }
        return id;
    }
    routes() {
        const router = express_1.default.Router();
        router.get("/", async (req, res) => {
            try {
                res.render("home");
            }
            catch (e) {
                res.status(res.statusCode);
                res.render("shared/error", {
                    error: e
                });
            }
        });
        router.get("/addresses", async (req, res) => {
            // create, get, list, delete address
            const Addresses = new lob_sdk_ts_1.banana.AddressesApi(config);
            const addressData = {
                name: "Thing T. Thing",
                address_line1: "1313 CEMETERY LN",
                address_city: "WESTFIELD",
                address_state: "NJ",
                address_zip: "07000",
            };
            try {
                // only create is assigned to a new object, as 
                const createAddress = await Addresses.create(addressData);
                const getAddress = await Addresses.get(createAddress.id);
                const listAddresses = await Addresses.list();
                res.render("addresses", {
                    createdAddress: createAddress,
                    retrievedAddress: getAddress,
                    listedAddresses: listAddresses
                });
                const deleteAddress = await Addresses.delete(createAddress.id);
                res.render("addresses", {
                    deletedAddress: deleteAddress
                });
            }
            catch (err) {
                console.error(err);
            }
        });
        router.get("/postcards", async (req, res) => {
            // create, get, list, cancel postcard
            const Postcards = new lob_sdk_ts_1.banana.PostcardsApi(config);
            const addressId = await this.createAddressForMailpieces();
            const postcardData = {
                to: addressId,
                from: addressId,
                front: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf",
                back: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf"
            };
            try {
                // only create is assigned to a new object, as 
                const createPostcard = await Postcards.create(postcardData);
                const getPostcard = await Postcards.get(createPostcard.id);
                const listPostcard = await Postcards.list();
                res.render("addresses", {
                    createdPostcard: createPostcard,
                    retrievedPostcard: getPostcard,
                    listedPostcards: listPostcard
                });
                const cancelPostcard = await Postcards.cancel(createPostcard.id);
                await this.deleteAddress(addressId);
                res.render("addresses", {
                    deletedPostcard: cancelPostcard
                });
            }
            catch (err) {
                console.error(err);
            }
        });
        router.get("/us_verifications", async (req, res) => {
            // verify a US address
            const UsVerifications = new lob_sdk_ts_1.banana.USVerificationsApi(config);
            const verificationData1 = {
                primary_line: "001 CEMETERY LANE",
                city: "WESTFIELD",
                state: "NJ",
                zip_code: "07090",
            };
            const verificationData2 = {
                primary_line: "1515 CEMETERY LN",
                city: "WESTFIELD",
                state: "NJ",
                zip_code: "07090",
            };
            const addressList = {
                addresses: [verificationData1, verificationData2]
            };
            try {
                const singleVerified = await UsVerifications.verifySingle(verificationData1);
                const bulkVerified = await UsVerifications.verifyBulk(addressList);
                res.render("addresses", {
                    singleVerify: singleVerified,
                    bulkVerify: bulkVerified
                });
            }
            catch (err) {
                console.error(err);
            }
        });
        // router.get("/self_mailers", async (req: Request, res: Response) => {
        //     // create, get, list, cancel self-mailer
        //     const SelfMailers = new SelfMailersApi(config);
        //     const addressId = await this.createAddressForMailpieces();
        //     const selfMailerData : SelfMailerEditable = {
        //         to: addressId,
        //         from: addressId,
        //         inside:
        //             "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_inside.pdf",
        //         outside:
        //             "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_outside.pdf"
        //     }
        //     try {
        //         // only create is assigned to a new object, as 
        //         const createSelfMailer = await SelfMailers.create(selfMailerData);
        //         await SelfMailers.get(createSelfMailer.id);
        //         await SelfMailers.list();
        //         await SelfMailers.delete(createSelfMailer.id);
        //         await this.deleteAddress(addressId);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/letters", async (req: Request, res: Response) => {
        //     // create, get, list, cancel self-mailer
        //     const Letters = new LettersApi(config);
        //     const addressId = await this.createAddressForMailpieces();
        //     const letterData : LetterEditable = {
        //         to: addressId,
        //         from: addressId,
        //         color: true,
        //         extra_service: LetterEditableExtraServiceEnum.Certified,
        //         file: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/us_letter_1pg.pdf"
        //     }
        //     try {
        //         // only create is assigned to a new object, as 
        //         const createSelfMailer = await Letters.create(letterData);
        //         await Letters.get(createSelfMailer.id);
        //         await Letters.list();
        //         await Letters.cancel(createSelfMailer.id);
        //         await this.deleteAddress(addressId);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/bank_accounts", async (req: Request, res: Response) => {
        //     // create, get, list, delete bank account
        //     const BankAccounts = new banana.BankAccountsApi(config);
        //     // we might need to create new valid routing and account numbers
        //     const bankData: raptor.BankAccountWritable = {
        //         description: "Test Bank Account",
        //         routing_number: "322271627",
        //         account_number: "123456789",
        //         signatory: "Morticia Addams",
        //         account_type: raptor.BankTypeEnum.Individual,
        //     };
        //     const verify: raptor.BankAccountVerify = {
        //       amounts: [11, 35],
        //     };
        //     try {
        //         const createBankAccount = await BankAccounts.create(bankData);
        //         await BankAccounts.verify(createBankAccount.id, verify);
        //         await BankAccounts.get(createBankAccount.id);
        //         await BankAccounts.list();
        //         await BankAccounts.delete(createBankAccount.id);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/checks", async (req: Request, res: Response) => {
        //     // create, get, list, cancel check
        //     const Checks = new ChecksApi(config);
        //     const bankAccountId = await this.createVerifiedBankAccount();
        //     const addressId = await this.createAddressForMailpieces();
        //     const checkData : CheckEditable = {
        //         to: addressId,
        //         from: addressId,
        //         bank_account: bankAccountId,
        //         amount: 100
        //     }
        //     try {
        //         const createCheck = await Checks.create(checkData);
        //         await Checks.get(createCheck.id);
        //         await Checks.list();
        //         await Checks.cancel(createCheck.id);
        //         await this.deleteAddress(addressId);
        //         await this.deleteBankAccount(bankAccountId);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/templates", async (req: Request, res: Response) => {
        //     // create, get, update, list, delete template
        //     const Templates = new TemplatesApi(config);
        //     const templateData: TemplateWritable = {
        //         description: "Newer Template",
        //         html: "<html>Updated HTML for {{name}}</html>",
        //     };
        //     try {
        //         const createTemplate = await Templates.create(templateData);
        //         await Templates.get(createTemplate.id);
        //         await Templates.list();
        //         const updateData: TemplateUpdate = {
        //             description: "updated template",
        //             published_version: createTemplate.id
        //         }
        //         await Templates.update(createTemplate.id, updateData);
        //         await Templates.delete(createTemplate.id);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/template_versions", async (req: Request, res: Response) => {
        //     // create, get, update, list, delete template versions
        //     const TemplateVersions = new TemplateVersionsApi(config);
        //     const templateId = await this.createTemplateForVersions();
        //     const templateData: TemplateVersionWritable = {
        //         description: "Newer Template",
        //         html: "<html>Updated HTML for {{name}}</html>",
        //     };
        //     try {
        //         const createTemplateVersion = await TemplateVersions.create(templateId, templateData);
        //         await TemplateVersions.get(templateId, createTemplateVersion.id);
        //         await TemplateVersions.list(templateId);
        //         const updateData: TemplateUpdate = {
        //             description: "updated template",
        //             published_version: templateId
        //         }
        //         await TemplateVersions.update(templateId, createTemplateVersion.id, updateData);
        //         await TemplateVersions.delete(templateId, createTemplateVersion.id);
        //         this.deleteTemplate(templateId);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/intl_verifications", async (req: Request, res: Response) => {
        //     // verify a non-US address
        //     const IntlVerifications = new IntlVerificationsApi(config);
        //     const verificationData1: IntlVerificationWritable = {
        //         primary_line: "370 WATER ST",
        //         postal_code: "C1N 1C4",
        //         country: CountryExtended.Ca,
        //     };
        //     const verificationData2: IntlVerificationWritable = {
        //         primary_line: "012 PLACEHOLDER ST",
        //         postal_code: "F0O 8A2",
        //         country: CountryExtended.Ca,
        //     };
        //     const addressList: IntlVerificationsPayload = {
        //         addresses: [verificationData1, verificationData2]
        //     }
        //     try {
        //         await IntlVerifications.verifySingle(verificationData1);
        //         await IntlVerifications.verifyBulk(addressList);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/us_autocompletions", async (req: Request, res: Response) => {
        //     // autocomplete partial address data
        //     const UsAutocompletions = new USAutocompletionsApi(config);
        //     const autocompletionData: IntlVerificationWritable = {
        //         primary_line: "370 WATER ST",
        //         postal_code: "C1N 1C4",
        //         country: CountryExtended.Ca,
        //     };
        //     try {
        //         await UsAutocompletions.autocomplete(autocompletionData);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/reverse_geocode_lookups", async (req: Request, res: Response) => {
        //     // create, get, update, list, cancel template
        //     const ReverseGeocodeLookup = new ReverseGeocodeLookupsApi(config);
        //     const coordinates: Location = {
        //         latitude: 37.777456,
        //         longitude: -122.393039
        //       };
        //     try {
        //         await ReverseGeocodeLookup.lookup(coordinates);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // router.get("/zip_lookups", async (req: Request, res: Response) => {
        //     // create, get, update, list, cancel template
        //     const ZipLookup = new ZipLookupsApi(config);
        //     try {
        //         await ZipLookup.lookup("07090");
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // });
        // TODO: add webhooks route (not sure if necessary)
        const fileStoreOptions = {};
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
exports.default = new App().app;
