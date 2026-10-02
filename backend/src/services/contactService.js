const ContactRepository = require("../repositories/contactRepository");

class ContactService {
    constructor() {
        this.contactRepository = new ContactRepository();
    }

    getContactsPaged(pageNumber, pageSize, searchTerm) {
        return this.contactRepository.getContactsPaged(
            pageNumber,
            pageSize,
            searchTerm
        );
    }

    getContactsForExport() {
        return this.contactRepository.getContactsForExport();
    }

    getContactById(id) {
        return this.contactRepository.getContactById(id);
    }

    createContact(contact) {
        return this.contactRepository.insertContact(contact);
    }

    updateContact(id, contact) {
        return this.contactRepository.updateContact(id, contact);
    }

    deleteContact(id) {
        return this.contactRepository.deleteContact(id);
    }
}

module.exports = ContactService;