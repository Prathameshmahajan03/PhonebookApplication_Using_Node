class ContactExportService {
    createCsv(contacts) {
        const headers = ["Id", "Name", "PhoneNumber", "Email", "Address"];

        const escapeCsv = (value) => {
            if (value === null || value === undefined || value === "") {
                return "";
            }

            const text = String(value);

            const requiresQuotes =
                text.includes(",") ||
                text.includes('"') ||
                text.includes("\r") ||
                text.includes("\n");

            if (!requiresQuotes) {
                return text;
            }

            return `"${text.replace(/"/g, '""')}"`;
        };

        const rows = contacts.map((contact) =>
            [
                contact.id,
                contact.name,
                contact.phoneNumber,
                contact.email,
                contact.address
            ]
                .map(escapeCsv)
                .join(",")
        );

        return Buffer.from(
            [headers.join(","), ...rows].join("\r\n") + "\r\n",
            "utf8"
        );
    }

    createJson(contacts) {
        return Buffer.from(JSON.stringify(contacts), "utf8");
    }
}

module.exports = ContactExportService;