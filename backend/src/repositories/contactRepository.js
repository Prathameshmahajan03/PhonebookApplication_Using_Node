const { sql, poolPromise } = require("../config/db");

class ContactRepository {

    async getContactsForExport() {
        const pool = await poolPromise;

        const result = await pool.request()
            .execute("sp_GetContactsForExport");

        return result.recordset.map(row => ({
            id: row.Id,
            name: row.Name,
            phoneNumber: row.PhoneNumber,
            email: row.Email ?? null,
            address: row.Address ?? null
        }));
    }

    async getContactById(id) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("Id", sql.Int, id)
            .execute("sp_GetContactById");

        if (!result.recordset || result.recordset.length === 0) {
            return null;
        }

        const row = result.recordset[0];

        return {
            id: row.Id,
            name: row.Name,
            phoneNumber: row.PhoneNumber,
            email: row.Email ?? null,
            address: row.Address ?? null,
            createdAt: row.CreatedAt ?? null
        };
    }

    async insertContact(contact) {
        const pool = await poolPromise;

        try {
            const result = await pool.request()
                .input("Name", sql.NVarChar, contact.name)
                .input("PhoneNumber", sql.NVarChar, contact.phoneNumber)
                .input("Email", sql.NVarChar, contact.email ?? null)
                .input("Address", sql.NVarChar(sql.MAX), contact.address ?? null)
                .execute("sp_InsertContact");

            return result.recordset[0].Id;

        } catch (error) {
            if (error.number === 2601 || error.number === 2627) {
                const duplicateError = new Error("Phone number already exists.");
                duplicateError.name = "DuplicatePhoneError";
                throw duplicateError;
            }

            throw error;
        }
    }

    async updateContact(id, contact) {
        const pool = await poolPromise;

        try {
            const result = await pool.request()
                .input("Id", sql.Int, id)
                .input("Name", sql.NVarChar, contact.name)
                .input("PhoneNumber", sql.NVarChar, contact.phoneNumber)
                .input("Email", sql.NVarChar, contact.email ?? null)
                .input("Address", sql.NVarChar(sql.MAX), contact.address ?? null)
                .execute("sp_UpdateContact");

            const rowsAffected = result.recordset[0].RowsAffected;

            return rowsAffected > 0;

        } catch (error) {
            if (error.number === 2601 || error.number === 2627) {
                const duplicateError = new Error("Phone number already exists.");
                duplicateError.name = "DuplicatePhoneError";
                throw duplicateError;
            }

            throw error;
        }
    }

    async deleteContact(id) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("Id", sql.Int, id)
            .execute("sp_DeleteContact");

        const rowsAffected = result.recordset[0].RowsAffected;

        return rowsAffected > 0;
    }

    async getContactsPaged(pageNumber, pageSize, searchTerm) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("PageNumber", sql.Int, pageNumber)
            .input("PageSize", sql.Int, pageSize)
            .input("SearchTerm", sql.NVarChar(255), searchTerm ?? null)
            .execute("sp_GetContactsPaged");

        const contacts = result.recordsets[0].map(row => ({
            id: row.Id,
            name: row.Name,
            phoneNumber: row.PhoneNumber,
            email: row.Email ?? null,
            address: row.Address ?? null,
            createdAt: row.CreatedAt ?? null
        }));

        const totalCount = result.recordsets[1][0].TotalCount;

        return {
            items: contacts,
            totalCount,
            currentPage: pageNumber,
            pageSize
        };
    }
}

module.exports = ContactRepository;