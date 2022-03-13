require("dotenv").config();
import * as bodyParser from "body-parser";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";

const session = require("express-session");
var FileStore = require('session-file-store')(session);

import {
        Configuration,
        Address,
        AddressesApi, 
        AddressEditable, 
        AddressDeletion, 
        AddressList,
        BankAccountsApi, 
        BankAccountVerify,
        BankAccountWritable,
        BankTypeEnum,
        ChecksApi, 
        CheckEditable,
        IntlVerificationsApi, 
        IntlVerificationWritable, 
        CountryExtended,
        IntlVerificationsPayload,
        Letter,
        LetterList,
        LetterDeletion, 
        LettersApi, 
        LetterEditable,
        Postcard, 
        PostcardsApi, 
        PostcardList, 
        PostcardDeletion,
        ReverseGeocodeLookupsApi, 
        Location,
        SelfMailer, 
        SelfMailerList, 
        SelfMailerDeletion, 
        SelfMailersApi, 
        SelfMailerEditable,
        TemplatesApi, 
        TemplateWritable, 
        TemplateUpdate, 
        TemplateVersionWritable, 
        TemplateVersionUpdatable, 
        TemplateVersionsApi,
        USAutocompletionsApi, 
        UsAutocompletionsWritable,
        UsVerification, 
        UsVerifications, 
        USVerificationsApi,
        UsVerificationsWritable, 
        MultipleComponentsList, 
        MultipleComponents,
        ZipLookupsApi,
        Zip, 
        ZipEditable,
        MultipleComponentsIntl
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
        const router = express.Router();

        this.config();
        this.routes(router);

        const fileStoreOptions = {}
        this.app.use(cors({origin: 'http://localhost:3117' }));
        this.app.use(session({
            secret: "dummy secret",
            store: new FileStore(fileStoreOptions),
            resave: false,
            saveUninitialized: false,
            cookie: { secure: true}
        }));
        this.app.use("/", router);
        // this.app.use((req: Request, res: Response, next) => {
        //     console.log('cors hit');
        //     // Website you wish to allow to connect
        //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1337');
        //     // Pass to next layer of middleware
        //     next();
        // });
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
            address_zip: "07090"
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
            html: "<html>Updated HTML for {{name}}</html>"
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
            console.log(`Deleted Address ${addressId}`);
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
            account_type: BankTypeEnum.Individual
        };
        const verificationData: BankAccountVerify = {
          amounts: [11, 35]
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

    private routes(router: express.Router): void {

        router.get("/healthCheck", async (req: Request, res: Response) => {
            try {
                res.status(200).send({
                    ok: true
                });
            } catch (err: any) {
                // console.error(err);
                res.status(500).send();
            }
        });

        router.post("/addresses", async (req: Request, res: Response) => {
            // create, get, list, delete address
            const Addresses = new AddressesApi(config);
            const addressData = new AddressEditable(req.body);
            try {
                // only create is assigned to a new object, as 
                const createAddress : Address = await Addresses.create(addressData);
                const getAddress : Address = await Addresses.get(createAddress.id);
                const listAddresses : AddressList = await Addresses.list(2);
                const deleteAddress : AddressDeletion = await Addresses.delete(createAddress.id);
                res.status(200).send({
                    createdAddress: createAddress,
                    retrievedAddress: getAddress,
                    listedAddresses: listAddresses,
                    deletedAddress: deleteAddress
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
        router.post("/address", async (req: Request, res: Response) => {
            // create, get, list, delete address
            const Addresses = new AddressesApi(config);
            const addressData = new AddressEditable(req.body);
            try {
                // only create is assigned to a new object, as 
                const createAddress : Address = await Addresses.create(addressData);
                res.status(200).send(createAddress);
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });

        router.post("/postcards", async (req: Request, res: Response) => {
            console.log("PSTDATA",req.body)
            const postcardsData = req.body;
            // create, get, list, cancel postcard
            const postcardsApi = new PostcardsApi(config);
            // const postcardData : PostcardEditable = {
            //     to: addressId,
            //     from: addressId,
            //     front:
            //     "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf",
            //     back: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf"
            // }
            try {
                // only create is assigned to a new object, as 
                const createPostcard : Postcard = await postcardsApi.create(postcardsData);
                const getPostcard : Postcard = await postcardsApi.get(createPostcard.id);
                const listPostcard : PostcardList = await postcardsApi.list(2);
                const cancelPostcard : PostcardDeletion = await postcardsApi.cancel(createPostcard.id);
                res.status(200).send({
                    createdPostcard: createPostcard,
                    retrievedPostcard: getPostcard,
                    listedPostcards: listPostcard,
                    deletedPostcard: cancelPostcard
                });
                await this.deleteAddress(postcardsData.to);
                await this.deleteAddress(postcardsData.from)
            } catch (err: any) {
                console.error(err);
                res.status(500).send({message: err.message});
            }
        });
//DONE**
        router.get("/us_verifications", async (req: Request, res: Response) => {
            // verify a US address
           const UsVerifications = new USVerificationsApi(av_config);
           let verificationData1: UsVerificationsWritable = {  
               primary_line: "001 CEMETERY LANE",
               city: "WESTFIELD",
               state: "NJ",
               zip_code: "07090"
             };
             const verificationData2: UsVerificationsWritable = {
                primary_line: "1515 CEMETERY LN",
                city: "WESTFIELD",
                state: "NJ",
                zip_code: "07090"
            };
            let addressList = new MultipleComponentsList ({
            addresses: [verificationData1, verificationData2]
            });
           if (req.body.addresses) {
            addressList = new MultipleComponentsList (req.body);
           } else {
               verificationData1 = new MultipleComponents(req.body);
           }
            try {
                const singleVerified : UsVerification = await UsVerifications.verifySingle(verificationData1);
                const bulkVerified : UsVerifications = await UsVerifications.verifyBulk(addressList);
                res.status(200).send({
                    singleVerify: singleVerified,
                    bulkVerify: bulkVerified
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
//Done*
        router.post("/self_mailers", async (req: Request, res: Response) => {
            // create, get, list, cancel self-mailer
            const SelfMailers = new SelfMailersApi(config);
            const addressId = await this.createAddressForMailpieces();
            const selfMailerData = new SelfMailerEditable(req.body);
            // const selfMailerData : SelfMailerEditable = {
            //    to: addressId,
            //     from: addressId,
            //     inside:
            //         "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_inside.pdf",
            //     outside:
            //         "https://s3.us-west-2.amazonaws.com/public.lob.com/assets/templates/self_mailers/6x18_sfm_outside.pdf"
            // }

            try {
                const createSelfMailer : SelfMailer = await SelfMailers.create(selfMailerData);
                const getSelfMailer : SelfMailer = await SelfMailers.get(createSelfMailer.id);
                const listSelfMailer : SelfMailerList = await SelfMailers.list(2);
                const deleteSelfMailer : SelfMailerDeletion = await SelfMailers.delete(createSelfMailer.id);
                res.status(200).send({
                    createdSelfMailer: createSelfMailer,
                    retrievedSelfMailer: getSelfMailer,
                    listedSelfMailers: listSelfMailer,
                    deletedSelfMailer: deleteSelfMailer
                });
                await this.deleteAddress(addressId);
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
//Done*
        router.post("/letters", async (req: Request, res: Response) => {
            // create, get, list, cancel self-mailer
            const Letters = new LettersApi(config);
            const addressId = await this.createAddressForMailpieces();
            const letterData = new LetterEditable(req.body);
            // const letterData : LetterEditable = {
            //     to: addressId,
            //     from: addressId,
            //     color: true,
              // extra_service: LetterEditableExtraServiceEnum.Certified,
            //     file: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/us_letter_1pg.pdf"
            // }

            try {
                const createLetter : Letter = await Letters.create(letterData);
                const getLetter : Letter = await Letters.get(createLetter.id);
                const listLetters : LetterList = await Letters.list(2);
                const deleteLetter : LetterDeletion = await Letters.cancel(createLetter.id);
                res.status(200).send({
                    createdLetter: createLetter,
                    retrievedLetter: getLetter,
                    listedLetters: listLetters,
                    deletedLetter: deleteLetter
                });
                await this.deleteAddress(addressId);
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
//Done*

        router.post("/bank_accounts", async (req: Request, res: Response) => {
            // create, get, list, delete bank account
            const BankAccounts = new BankAccountsApi(config);
            let bankData = new BankAccountWritable({
                description: "Test Bank Account",
                routing_number: "322271627",
                account_number: "123456789",
                signatory: "Gomez Addams",
             account_type: BankTypeEnum.Individual
            });
            let verify = new BankAccountVerify({amounts: [11, 35]});

            if (req.params.amounts === undefined) {
               bankData = new BankAccountWritable(req.body); 
             } else {
                verify = new BankAccountVerify(req.body);
            }
            // // we might need to create new valid routing and account numbers
            // const bankData: BankAccountWritable = {
            //     description: "Test Bank Account",
            //     routing_number: "322271627",
            //     account_number: "123456789",
            //     signatory: "Morticia Addams",
            //  account_type: BankTypeEnum.Individual,
            // };
            // const verify: BankAccountVerify = {
            //   amounts: [11, 35],
            //  };

            try {
                const createBankAccount = await BankAccounts.create(bankData);
                const verifyBankAccount = await BankAccounts.verify(createBankAccount.id, verify);
                const getBankAccount = await BankAccounts.get(createBankAccount.id);
                const listBankAccounts = await BankAccounts.list(2);
                const deleteBankAccount = await BankAccounts.delete(createBankAccount.id);
                res.status(200).send({
                    createdAccount: createBankAccount,
                    verifiedAccount: verifyBankAccount,
                    retrievedAccount: getBankAccount,
                    listedAccounts: listBankAccounts,
                    deletedAccount: deleteBankAccount
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
        router.post("/check_bank_accounts", async (req: Request, res: Response) => {
            // create, get, list, delete bank account
            const BankAccounts = new BankAccountsApi(config);
            let bankData = new BankAccountWritable({
                description: "Test Bank Account",
                routing_number: "322271627",
                account_number: "123456789",
                signatory: "Gomez Addams",
                account_type: BankTypeEnum.Individual
            });
            let verify = new BankAccountVerify({amounts: [11, 35]});

            if (req.params.amounts === undefined) {
               bankData = new BankAccountWritable(req.body); 
             } else {
                verify = new BankAccountVerify(req.body);
            }
            // // we might need to create new valid routing and account numbers
            // const bankData: BankAccountWritable = {
            //     description: "Test Bank Account",
            //     routing_number: "322271627",
            //     account_number: "123456789",
            //     signatory: "Morticia Addams",
            //  account_type: BankTypeEnum.Individual,
            // };
            // const verify: BankAccountVerify = {
            //   amounts: [11, 35],
            //  };

            try {
                const createBankAccount = await BankAccounts.create(bankData);
                const verifyBankAccount = await BankAccounts.verify(createBankAccount.id, verify);
                const getBankAccount = await BankAccounts.get(createBankAccount.id);
                const listBankAccounts = await BankAccounts.list(2);
                //const deleteBankAccount = await BankAccounts.delete(createBankAccount.id);
                res.status(200).send({
                    createdAccount: createBankAccount,
                    verifiedAccount: verifyBankAccount,
                    retrievedAccount: getBankAccount,
                    listedAccounts: listBankAccounts,
                   // deletedAccount: deleteBankAccount
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
//Done*
        router.post("/checks", async (req: Request, res: Response) => {
            // create, get, list, cancel check
            const Checks = new ChecksApi(config);
            const bankAccountId = await this.createVerifiedBankAccount();
            const addressId = await this.createAddressForMailpieces();
            const checkData = new CheckEditable(req.body)
            
            // const checkData : CheckEditable = {
            //     to: addressId,
            //     from: addressId,
            //     bank_account: bankAccountId,
            //     amount: 100
            // }
            try {
                const createCheck = await Checks.create(checkData);
                const getCheck = await Checks.get(createCheck.id);
                const listChecks = await Checks.list(2);
                const deleteCheck = await Checks.cancel(createCheck.id);
                res.status(200).send({
                    createdCheck: createCheck,
                    retrievedCheck: getCheck,
                    listedChecks: listChecks,
                    deletedCheck: deleteCheck
                });
                await this.deleteAddress(req.body.from);
                await this.deleteBankAccount(req.body.bank_account);
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
//Done*
        router.post("/templates", async (req: Request, res: Response) => {
            // create, get, update, list, delete template
            const Templates = new TemplatesApi(config);
            let templateData = new TemplateWritable({
                description: "Newer Template",
                html: "<html>Updated HTML for {{name}}</html>"
            });
            
            if (req.body.html) {
                templateData = new TemplateWritable(req.body);
            }
            try {
                const createTemplate = await Templates.create(templateData);
                console.log("published version: ", createTemplate.published_version?.id);
                const getTemplate = await Templates.get(createTemplate.id);
                const listTemplates = await Templates.list(2);
                let updateData = new TemplateUpdate({
                    description: "updated template",
                    publishedVersion: createTemplate.published_version?.id as string
                });
                if (req.body.published_Version){
                    updateData = new TemplateUpdate(req.body)
                }
                const updateTemplate = await Templates.update(createTemplate.id, updateData);
                const deleteTemplate = await Templates.delete(createTemplate.id);
                res.status(200).send({
                    createdTemplate: createTemplate,
                    retrievedTemplate: getTemplate,
                    listedTemplates: listTemplates,
                    updatedTemplate: updateTemplate,
                    deletedTemplate: deleteTemplate
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send()
            }
        });
//Done*
        router.post("/template_versions", async (req: Request, res: Response) => {
            // create, get, update, list, delete template versions
            const TemplateVersions = new TemplateVersionsApi(config);
            const templateId = await this.createTemplateForVersions();
            let templateData = new TemplateVersionWritable({
                description: "Newer Template",
                html: "<html>Updated HTML for {{name}}</html>"
            });
            if (req.body.html) {
                templateData = new TemplateVersionWritable(req.body);
            }
            try {
                const createTemplateVersion = await TemplateVersions.create(templateId, templateData);
                const getTemplateVersion = await TemplateVersions.get(templateId, createTemplateVersion.id);
                const listTemplateVersions = await TemplateVersions.list(templateId);
                let updateData = new TemplateVersionUpdatable({
                    description: "updated template version"
                    //Should engine be here?
                });
                if (req.body.engine) {
                    updateData = new TemplateVersionUpdatable(req.body)
                }
                const updateTemplateVersion = await TemplateVersions.update(templateId, createTemplateVersion.id, updateData);
                const deleteTemplateVersion = await TemplateVersions.delete(templateId, createTemplateVersion.id);
                res.status(200).send({
                    createdVersion: createTemplateVersion,
                    retrievedVersion: getTemplateVersion,
                    listedVersions: listTemplateVersions,
                    updatedVersion: updateTemplateVersion,
                    deletedVersion: deleteTemplateVersion
                });
                this.deleteTemplate(templateId);
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
//DONE*
        router.get("/intl_verifications", async (req: Request, res: Response) => {
            // verify a non-US address
            const IntlVerifications = new IntlVerificationsApi(av_config);
            let verificationData1: IntlVerificationWritable = {
                primary_line: "370 WATER ST",
                postal_code: "C1N 1C4",
                country: CountryExtended.Ca
            };
            const verificationData2: IntlVerificationWritable = {
                primary_line: "012 PLACEHOLDER ST",
                postal_code: "F0O 8A2",
                country: CountryExtended.Ca
            };
            let addressList = new IntlVerificationsPayload({
                addresses: [verificationData1, verificationData2]
            });
            if (req.body.addresses) {
                addressList = new IntlVerificationsPayload(req.body);
               } else {
                   verificationData1 = new MultipleComponentsIntl(req.body);
               }
            try {
                const singleVerified = await IntlVerifications.verifySingle(verificationData1);
                const bulkVerified = await IntlVerifications.verifyBulk(addressList);
                res.status(200).send({
                    singleVerify: singleVerified,
                    bulkVerify: bulkVerified
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
 //DONE*
        router.get("/us_autocompletions", async (req: Request, res: Response) => {
            // autocomplete partial address data
            const UsAutocompletions = new USAutocompletionsApi(av_config);
            const autocompletionData = new UsAutocompletionsWritable(req.body);
            // const autocompletionData: UsAutocompletionsWritable = {
            //     address_prefix: "185 B",
            //     city: "SAN FRANCISCO"
            // };
            try {
                const autocompletedAddresses = await UsAutocompletions.autocomplete(autocompletionData);
                res.status(200).send( {
                    autocompleted: autocompletedAddresses
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();

            }
        });
//DONE*
        router.get("/reverse_geocode_lookups", async (req: Request, res: Response) => {
            // look up a latitude and longitude
            const ReverseGeocodeLookup = new ReverseGeocodeLookupsApi(av_config);
            const coordinates = new Location(req.body);
            // const coordinates: Location = {
            //     latitude: 37.777456,
            //     longitude: -122.393039
            //   };
            try {
                const geocode = await ReverseGeocodeLookup.lookup(coordinates);
                res.status(200).send( {
                    geocode: geocode
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
//DONE*
        router.get("/zip_lookups", async (req: Request, res: Response) => {
            // look up a zip code
            const ZipLookup = new ZipLookupsApi(av_config);
            const zipRequest: ZipEditable = req.body;
            // const zipRequest : ZipEditable = {
            //     zip_code: "07090"
            // }
            console.log("ZIP",zipRequest)
            try {
                const zipLookup : Zip = await ZipLookup.lookup(zipRequest);
                console.log("Result of Zip Lookup: ", zipLookup);
                res.status(200).send({
                    lookup: zipLookup
                });
            } catch (err: any) {
                console.error(err);
                res.status(500).send();
            }
        });
    }
}

export default new App().app;