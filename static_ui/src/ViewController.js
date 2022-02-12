class ViewController {
    _instance;

    handleNavigation(event) {
        console.log(event);
    }

    static get() {
        if (!ViewController._instance) {
            ViewController._instance = new ViewController();
        }

        return ViewController._instance;
    }
}

const NavTargets = {
    Addresses: 'ADDRESSES',
    BankAccounts: 'BANK_ACCOUNTS',
    Checks: 'CHECKS',
    Letters: 'LETTERS',
    Postcards: 'CHECKS',
    SelfMailers: 'SELF_MAILERS',
    Templates: 'TEMPLATES',
    TemplateVersions: 'TEMPLATE_VERSIONS',
};
