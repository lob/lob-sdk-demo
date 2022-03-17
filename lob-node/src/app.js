
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const session = require("express-session");
const FileStore = require('session-file-store')(session);

const LobRaw = require('lob');
const Lob = LobRaw(process.env.LOB_API_KEY);

const packageJson = require('../package.json');

const GENERIC_ADDRESS = {
    name: "Test Address Name",
    address_line1: "1313 CEMETERY LN",
    address_city: "WESTFIELD",
    address_state: "NJ",
    address_zip: "07090"
};

class App {
    app;

    constructor() {
        this.app = express();
        const router = express.Router();

        this.config();
        this.routes(router);

        const fileStoreOptions = {}
        this.app.use(cors({origin: 'http://localhost:8081' }));
        this.app.use(session({
            secret: "dummy secret",
            store: new FileStore(fileStoreOptions),
            resave: false,
            saveUninitialized: false,
            cookie: { secure: true}
        }));
        this.app.use("/", router);
    }

    config() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use('/webhooks', bodyParser.raw({ type: 'application/json' }));
        this.app.use(bodyParser.json());
    }

    async deleteAddress(addressId) {
        try {
            await await Lob.addresses.delete(addressId);
        } catch (err) {
            console.error(err);
        }
    }

    routes(router) {

        router.get("/healthCheck", async (req, res) => {
            try {
                res.status(200).send({
                    ok: true,
                    sdk: 'node',
                    version: packageJson.dependencies["lob"]
                });
            } catch (err) {
                res.status(500).send();
            }
        });

        // Print and Mail
        router.post("/addresses", async (req, res) => {
            // create, get, list, delete address
            const addressData = req.body;
            try {
                // only create is assigned to a new object, as 
                const createAddress = await Lob.addresses.create(addressData);
                const getAddress = await Lob.addresses.retrieve(createAddress.id);
                const listAddresses = await Lob.addresses.list({ limit: 2 });
                const deleteAddress = await Lob.addresses.delete(createAddress.id);
                res.status(200).send({
                    createdAddress: createAddress,
                    retrievedAddress: getAddress,
                    listedAddresses: listAddresses,
                    deletedAddress: deleteAddress
                });
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.status_code || 500,
                    statusText: err._response.body.error.code || "Unknown_Error"
                });
            }
        });
        router.post("/address", async (req, res) => {
            // create, get, list, delete address
            const addressData = req.body;
            try {
                // only create is assigned to a new object, as
                const createAddress = await Lob.addresses.create(addressData);
                res.status(200).send(createAddress);
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.status_code || 500,
                    statusText: err._response.body.error.code || "Unknown_Error"
                });
            }
        });

        router.post("/bank_accounts", async (req, res) => {
            // create, get, list, delete bank account
            let bankData = {
                description: "Test Bank Account",
                routing_number: "322271627",
                account_number: "123456789",
                signatory: "Test Signatory",
                account_type: "individual"
            };
            const verify = req.body.amounts ? { amounts: req.body.amounts } : { amounts: [11, 35] };

            try {
                const createBankAccount = await Lob.bankAccounts.create(bankData);
                const verifyBankAccount = await Lob.bankAccounts.verify(createBankAccount.id, verify);
                const getBankAccount = await Lob.bankAccounts.retrieve(createBankAccount.id);
                const listBankAccounts = await Lob.bankAccounts.list({ limit: 2 });
                const deleteBankAccount = await Lob.bankAccounts.delete(createBankAccount.id);
                res.status(200).send({
                    createdAccount: createBankAccount,
                    verifiedAccount: verifyBankAccount,
                    retrievedAccount: getBankAccount,
                    listedAccounts: listBankAccounts,
                    deletedAccount: deleteBankAccount
                });
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.status_code || 500,
                    statusText: err._response.body.error.code || "Unknown_Error"
                });
            }
        });
        router.post("/check_bank_accounts", async (req, res) => {
            // create, get, list, delete bank account
            let bankData = {
                description: "Test Bank Account",
                routing_number: "322271627",
                account_number: "123456789",
                signatory: "Test Signatory",
                account_type: "individual"
            };
            const verify = req.body.amounts ? { amounts: req.body.amounts } : { amounts: [11, 35] };

            try {
                const createBankAccount = await Lob.bankAccounts.create(bankData);
                const verifyBankAccount = await Lob.bankAccounts.verify(createBankAccount.id, verify);
                res.status(200).send(verifyBankAccount);
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.response.status || 500,
                    statusText: err.response.statusText || "Unknown_Error"
                });
            }
        });

        router.post("/checks", async (req, res) => {
            const checkData = req.body;
            try {
                const createCheck = await Lob.checks.create(checkData);
                const getCheck = await Lob.checks.retrieve(createCheck.id);
                const listChecks = await Lob.checks.list({ limit: 2});
                const deleteCheck = await Lob.checks.delete(createCheck.id);
                res.status(200).send({
                    createdCheck: createCheck,
                    retrievedCheck: getCheck,
                    listedChecks: listChecks,
                    deletedCheck: deleteCheck
                });
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.response.status,
                    statusText: err.response.statusText
                });
            }
        });

        router.post("/letters", async (req, res) => {
            // create, get, list, cancel self-mailer
            const letterData = req.body;

            try {
                const createLetter = await Lob.letters.create(letterData);
                const getLetter = await Lob.letters.retrieve(createLetter.id);
                const listLetters = await Lob.letters.list({ limit: 2 });
                const deleteLetter = await Lob.letters.delete(createLetter.id);
                res.status(200).send({
                    createdLetter: createLetter,
                    retrievedLetter: getLetter,
                    listedLetters: listLetters,
                    deletedLetter: deleteLetter
                });
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.status_code || 500,
                    statusText: err._response.body.error.code || "Unknown_Error"
                });
            }
        });

        router.post("/postcards", async (req, res) => {
            // create, get, list, cancel postcard
            const postcardsData = req.body;

            try {
                // only create is assigned to a new object, as
                const createPostcard = await Lob.postcards.create(postcardsData);
                const getPostcard = await Lob.postcards.retrieve(createPostcard.id);
                const listPostcard = await Lob.postcards.list({ limit: 2 });
                const cancelPostcard = await Lob.postcards.delete(createPostcard.id);
                res.status(200).send({
                    createdPostcard: createPostcard,
                    retrievedPostcard: getPostcard,
                    listedPostcards: listPostcard,
                    deletedPostcard: cancelPostcard
                });
                await this.deleteAddress(postcardsData.to);
                await this.deleteAddress(postcardsData.from)
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.status_code || 500,
                    statusText: err._response.body.error.code || "Unknown_Error"
                });
            }
        });

        router.post("/self_mailers", async (req, res) => {
            // create, get, list, cancel self-mailer
            const selfMailerData = req.body;

            try {
                const createSelfMailer = await Lob.selfMailers.create(selfMailerData);
                const getSelfMailer = await Lob.selfMailers.retrieve(createSelfMailer.id);
                const listSelfMailer = await Lob.selfMailers.list({ limit: 2 });
                const deleteSelfMailer = await Lob.selfMailers.delete(createSelfMailer.id);
                res.status(200).send({
                    createdSelfMailer: createSelfMailer,
                    retrievedSelfMailer: getSelfMailer,
                    listedSelfMailers: listSelfMailer,
                    deletedSelfMailer: deleteSelfMailer
                });
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.status_code || 500,
                    statusText: err._response.body.error.code || "Unknown_Error"
                });
            }
        });

        router.post("/templates", async (req, res) => {
            // create, get, update, list, delete template
            const templateData = req.body.html ?
                { description: req.body.description, html: req.body.html } :
                { description: "Newer Template", html: "<html>Updated HTML for {{name}}</html>"};

            try {
                const createTemplate = await Lob.templates.create(templateData);
                const getTemplate = await Lob.templates.retrieve(createTemplate.id);
                const listTemplates = await Lob.templates.list({ limit: 2 });

                const deleteTemplate = await Lob.templates.delete(createTemplate.id);
                res.status(200).send({
                    createdTemplate: createTemplate,
                    retrievedTemplate: getTemplate,
                    listedTemplates: listTemplates,
                    updatedTemplate: "Operation Not Implemented in lob-node",
                    deletedTemplate: deleteTemplate
                });
            } catch (err) {
                console.error(err.message);
                res.status(502).send({
                    message: err.message || "unknown error",
                    status: err.status_code || 500,
                    statusText: err._response.body.error.code || "Unknown_Error"
                });
            }
        });

        router.post("/template_versions", async (req, res) => {
            res.status(501).send({
                message: "Template Versions not implemented in lob-node",
                status: 501,
                statusText: "Not Implemented"
            });
        });

        // Address Verification
        // ToDo:
        // Not implemented: US Verifications
    }
}

module.exports = {
    App
};
