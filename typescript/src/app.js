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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const lob_typescript_sdk_1 = require("@lob/lob-typescript-sdk");
const config = new lob_typescript_sdk_1.Configuration({
    username: process.env.API_KEY
});
const av_config = new lob_typescript_sdk_1.Configuration({
    username: process.env.LIVE_KEY
});
class App {
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
    createAddressForMailpieces() {
        return __awaiter(this, void 0, void 0, function* () {
            const addressData = {
                name: "Wednesday Addams",
                address_line1: "1313 CEMETERY LN",
                address_city: "WESTFIELD",
                address_state: "NJ",
                address_zip: "07090",
            };
            let id = "";
            try {
                const result = yield new lob_typescript_sdk_1.AddressesApi(config).create(addressData);
                if (result.id) {
                    id = result.id;
                }
                else {
                    throw new Error("Address creation must return a valid ID");
                }
            }
            catch (err) {
                console.error(err);
            }
            return id;
        });
    }
    createTemplateForVersions() {
        return __awaiter(this, void 0, void 0, function* () {
            const templateData = {
                description: "Newer Template",
                html: "<html>Updated HTML for {{name}}</html>",
            };
            let id = "";
            try {
                const result = yield new lob_typescript_sdk_1.TemplatesApi(config).create(templateData);
                id = result.id;
            }
            catch (err) {
                console.error(err);
            }
            return id;
        });
    }
    deleteAddress(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new lob_typescript_sdk_1.AddressesApi(config).delete(addressId);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    deleteTemplate(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new lob_typescript_sdk_1.TemplatesApi(config).delete(templateId);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    deleteBankAccount(bankId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new lob_typescript_sdk_1.BankAccountsApi(config).delete(bankId);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    createVerifiedBankAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const api = new lob_typescript_sdk_1.BankAccountsApi(config);
            const bankData = {
                description: "Test Bank Account",
                routing_number: "322271627",
                account_number: "123456789",
                signatory: "Gomez Addams",
                account_type: lob_typescript_sdk_1.BankTypeEnum.Individual,
            };
            const verificationData = {
                amounts: [11, 35],
            };
            let id = "";
            try {
                const result = yield api.create(bankData);
                const verifiedAccount = yield api.verify(result.id, verificationData);
                id = verifiedAccount.id;
            }
            catch (err) {
                console.error(err);
            }
            return id;
        });
    }
    routes() {
        const router = express_1.default.Router();
        router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.render("./home");
            }
            catch (e) {
                res.status(res.statusCode);
                res.render("./shared/error", {
                    error: e
                });
            }
        }));
        router.get("/addresses", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create, get, list, delete address
            const Addresses = new lob_typescript_sdk_1.AddressesApi(config);
            const addressData = {
                name: "Thing T. Thing",
                address_line1: "1313 CEMETERY LN",
                address_city: "WESTFIELD",
                address_state: "NJ",
                address_zip: "07000",
            };
            try {
                // only create is assigned to a new object, as 
                const createAddress = yield Addresses.create(addressData);
                const getAddress = yield Addresses.get(createAddress.id);
                const listAddresses = yield Addresses.list(2);
                const deleteAddress = yield Addresses.delete(createAddress.id);
                res.render("./addresses", {
                    createdAddress: createAddress,
                    retrievedAddress: getAddress,
                    listedAddresses: listAddresses,
                    deletedAddress: deleteAddress
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/postcards", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create, get, list, cancel postcard
            const Postcards = new lob_typescript_sdk_1.PostcardsApi(config);
            const addressId = yield this.createAddressForMailpieces();
            const postcardData = {
                to: addressId,
                from: addressId,
                front: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf",
                back: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf"
            };
            try {
                // only create is assigned to a new object, as 
                const createPostcard = yield Postcards.create(postcardData);
                const getPostcard = yield Postcards.get(createPostcard.id);
                const listPostcard = yield Postcards.list(2);
                const cancelPostcard = yield Postcards.cancel(createPostcard.id);
                res.render("postcards", {
                    createdPostcard: createPostcard,
                    retrievedPostcard: getPostcard,
                    listedPostcards: listPostcard,
                    deletedPostcard: cancelPostcard
                });
                yield this.deleteAddress(addressId);
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/us_verifications", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // verify a US address
            const UsVerifications = new lob_typescript_sdk_1.USVerificationsApi(av_config);
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
                const singleVerified = yield UsVerifications.verifySingle(verificationData1);
                const bulkVerified = yield UsVerifications.verifyBulk(addressList);
                console.log(bulkVerified);
                res.render("./us_verifications", {
                    singleVerify: singleVerified,
                    bulkVerify: bulkVerified
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/self_mailers", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create, get, list, cancel self-mailer
            const SelfMailers = new lob_typescript_sdk_1.SelfMailersApi(config);
            const addressId = yield this.createAddressForMailpieces();
            const selfMailerData = {
                to: addressId,
                from: addressId,
                inside: "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_inside.pdf",
                outside: "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_outside.pdf"
            };
            try {
                const createSelfMailer = yield SelfMailers.create(selfMailerData);
                const getSelfMailer = yield SelfMailers.get(createSelfMailer.id);
                const listSelfMailer = yield SelfMailers.list(2);
                const deleteSelfMailer = yield SelfMailers.delete(createSelfMailer.id);
                res.render("self_mailers", {
                    createdSelfMailer: createSelfMailer,
                    retrievedSelfMailer: getSelfMailer,
                    listedSelfMailers: listSelfMailer,
                    deletedSelfMailer: deleteSelfMailer
                });
                yield this.deleteAddress(addressId);
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/letters", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create, get, list, cancel self-mailer
            const Letters = new lob_typescript_sdk_1.LettersApi(config);
            const addressId = yield this.createAddressForMailpieces();
            const letterData = {
                to: addressId,
                from: addressId,
                color: true,
                extra_service: lob_typescript_sdk_1.LetterEditableExtraServiceEnum.Certified,
                file: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/us_letter_1pg.pdf"
            };
            try {
                const createLetter = yield Letters.create(letterData);
                const getLetter = yield Letters.get(createLetter.id);
                const listLetters = yield Letters.list(2);
                const deleteLetter = yield Letters.cancel(createLetter.id);
                res.render("letters", {
                    createdLetter: createLetter,
                    retrievedLetter: getLetter,
                    listedLetters: listLetters,
                    deletedLetter: deleteLetter
                });
                yield this.deleteAddress(addressId);
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/bank_accounts", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create, get, list, delete bank account
            const BankAccounts = new lob_typescript_sdk_1.BankAccountsApi(config);
            // we might need to create new valid routing and account numbers
            const bankData = {
                description: "Test Bank Account",
                routing_number: "322271627",
                account_number: "123456789",
                signatory: "Morticia Addams",
                account_type: lob_typescript_sdk_1.BankTypeEnum.Individual,
            };
            const verify = {
                amounts: [11, 35],
            };
            try {
                const createBankAccount = yield BankAccounts.create(bankData);
                const verifyBankAccount = yield BankAccounts.verify(createBankAccount.id, verify);
                const getBankAccount = yield BankAccounts.get(createBankAccount.id);
                const listBankAccounts = yield BankAccounts.list(2);
                const deleteBankAccount = yield BankAccounts.delete(createBankAccount.id);
                res.render("bank_accounts", {
                    createdAccount: createBankAccount,
                    verifiedAccount: verifyBankAccount,
                    retrievedAccount: getBankAccount,
                    listedAccounts: listBankAccounts,
                    deletedAccount: deleteBankAccount
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/checks", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create, get, list, cancel check
            const Checks = new lob_typescript_sdk_1.ChecksApi(config);
            const bankAccountId = yield this.createVerifiedBankAccount();
            const addressId = yield this.createAddressForMailpieces();
            const checkData = {
                to: addressId,
                from: addressId,
                bank_account: bankAccountId,
                amount: 100
            };
            try {
                const createCheck = yield Checks.create(checkData);
                const getCheck = yield Checks.get(createCheck.id);
                const listChecks = yield Checks.list(2);
                const deleteCheck = yield Checks.cancel(createCheck.id);
                res.render("checks", {
                    createdCheck: createCheck,
                    retrievedCheck: getCheck,
                    listedChecks: listChecks,
                    deletedCheck: deleteCheck
                });
                yield this.deleteAddress(addressId);
                yield this.deleteBankAccount(bankAccountId);
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/templates", (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // create, get, update, list, delete template
            const Templates = new lob_typescript_sdk_1.TemplatesApi(config);
            const templateData = {
                description: "Newer Template",
                html: "<html>Updated HTML for {{name}}</html>",
            };
            try {
                const createTemplate = yield Templates.create(templateData);
                console.log("published version: ", (_a = createTemplate.published_version) === null || _a === void 0 ? void 0 : _a.id);
                const getTemplate = yield Templates.get(createTemplate.id);
                const listTemplates = yield Templates.list(2);
                const updateData = {
                    description: "updated template",
                    published_version: (_b = createTemplate.published_version) === null || _b === void 0 ? void 0 : _b.id
                };
                const updateTemplate = yield Templates.update(createTemplate.id, updateData);
                const deleteTemplate = yield Templates.delete(createTemplate.id);
                res.render("templates", {
                    createdTemplate: createTemplate,
                    retrievedTemplate: getTemplate,
                    listedTemplates: listTemplates,
                    updatedTemplate: updateTemplate,
                    deletedTemplate: deleteTemplate
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/template_versions", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // create, get, update, list, delete template versions
            const TemplateVersions = new lob_typescript_sdk_1.TemplateVersionsApi(config);
            const templateId = yield this.createTemplateForVersions();
            const templateData = {
                description: "Newer Template",
                html: "<html>Updated HTML for {{name}}</html>",
            };
            try {
                const createTemplateVersion = yield TemplateVersions.create(templateId, templateData);
                const getTemplateVersion = yield TemplateVersions.get(templateId, createTemplateVersion.id);
                const listTemplateVersions = yield TemplateVersions.list(templateId);
                const updateData = {
                    description: "updated template version",
                };
                const updateTemplateVersion = yield TemplateVersions.update(templateId, createTemplateVersion.id, updateData);
                const deleteTemplateVersion = yield TemplateVersions.delete(templateId, createTemplateVersion.id);
                res.render("template_versions", {
                    createdVersion: createTemplateVersion,
                    retrievedVersion: getTemplateVersion,
                    listedVersions: listTemplateVersions,
                    updatedVersion: updateTemplateVersion,
                    deletedVersion: deleteTemplateVersion
                });
                this.deleteTemplate(templateId);
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/intl_verifications", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // verify a non-US address
            const IntlVerifications = new lob_typescript_sdk_1.IntlVerificationsApi(av_config);
            const verificationData1 = {
                primary_line: "370 WATER ST",
                postal_code: "C1N 1C4",
                country: lob_typescript_sdk_1.CountryExtended.Ca,
            };
            const verificationData2 = {
                primary_line: "012 PLACEHOLDER ST",
                postal_code: "F0O 8A2",
                country: lob_typescript_sdk_1.CountryExtended.Ca,
            };
            const addressList = {
                addresses: [verificationData1, verificationData2]
            };
            try {
                const singleVerified = yield IntlVerifications.verifySingle(verificationData1);
                const bulkVerified = yield IntlVerifications.verifyBulk(addressList);
                res.render("intl_verifications", {
                    singleVerify: singleVerified,
                    bulkVerify: bulkVerified
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/us_autocompletions", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // autocomplete partial address data
            const UsAutocompletions = new lob_typescript_sdk_1.USAutocompletionsApi(av_config);
            const autocompletionData = {
                address_prefix: "185 B",
                city: "SAN FRANCISCO"
            };
            try {
                const autocompletedAddresses = yield UsAutocompletions.autocomplete(autocompletionData);
                res.render("us_autocompletions", {
                    autocompleted: autocompletedAddresses
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/reverse_geocode_lookups", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // look up a latitude and longitude
            const ReverseGeocodeLookup = new lob_typescript_sdk_1.ReverseGeocodeLookupsApi(av_config);
            const coordinates = {
                latitude: 37.777456,
                longitude: -122.393039
            };
            try {
                const geocode = yield ReverseGeocodeLookup.lookup(coordinates);
                res.render("reverse_geocode_lookups", {
                    geocode: geocode
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        router.get("/zip_lookups", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // look up a zip code
            const ZipLookup = new lob_typescript_sdk_1.ZipLookupsApi(av_config);
            const zipRequest = {
                zip_code: "07090"
            };
            try {
                const zipLookup = yield ZipLookup.lookup(zipRequest);
                console.log("Result of Zip Lookup: ", zipLookup);
                res.render("zip_lookups", {
                    lookup: zipLookup
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
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
