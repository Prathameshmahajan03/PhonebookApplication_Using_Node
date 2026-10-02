const ContactService = require("../services/contactService");
const ContactExportService = require("../services/contactExportService");

const contactService = new ContactService();
const contactExportService = new ContactExportService();

class ContactController {
    async getContacts(req, res, next) {
        try {
            const pageNumber = Number(req.query.pageNumber ?? 1);
            const pageSize = Number(req.query.pageSize ?? 10);
            const searchTerm = req.query.searchTerm ?? null;

            if (!Number.isInteger(pageNumber) || pageNumber < 1) {
                return res
                    .status(400)
                    .send("Page number must be greater than or equal to 1.");
            }

            if (!Number.isInteger(pageSize) || pageSize < 1) {
                return res
                    .status(400)
                    .send("Page size must be greater than or equal to 1.");
            }

            const result = await contactService.getContactsPaged(
                pageNumber,
                pageSize,
                searchTerm
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getContactById(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.sendStatus(404);
            }

            const contact = await contactService.getContactById(id);

            if (!contact) {
                return res.sendStatus(404);
            }

            return res.status(200).json(contact);
        } catch (error) {
            next(error);
        }
    }

    async createContact(req, res, next) {
        try {
            const newId = await contactService.createContact(req.body);
            const createdContact = await contactService.getContactById(newId);

            return res
                .status(201)
                .location(`/api/contacts/${newId}`)
                .json(createdContact);
        } catch (error) {
            if (error.name === "DuplicatePhoneError") {
                return res.status(400).send(error.message);
            }

            next(error);
        }
    }

    async updateContact(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.sendStatus(404);
            }

            const updated = await contactService.updateContact(id, req.body);

            if (!updated) {
                return res.sendStatus(404);
            }

            return res.sendStatus(200);
        } catch (error) {
            if (error.name === "DuplicatePhoneError") {
                return res.status(400).send(error.message);
            }

            next(error);
        }
    }

    async deleteContact(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.sendStatus(404);
            }

            const deleted = await contactService.deleteContact(id);

            if (!deleted) {
                return res.sendStatus(404);
            }

            return res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    async exportContactsCsv(req, res, next) {
        try {
            const contacts = await contactService.getContactsForExport();
            const file = contactExportService.createCsv(contacts);

            return res
                .status(200)
                .type("text/csv; charset=utf-8")
                .attachment("contacts.csv")
                .send(file);
        } catch (error) {
            next(error);
        }
    }

    async exportContactsJson(req, res, next) {
        try {
            const contacts = await contactService.getContactsForExport();
            const file = contactExportService.createJson(contacts);

            return res
                .status(200)
                .type("application/json; charset=utf-8")
                .attachment("contacts.json")
                .send(file);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ContactController();