const ContactRepository = require("./src/repositories/contactRepository");

async function testRepository() {
    const repository = new ContactRepository();

    try {
        console.log("\n--- Testing getContactsPaged ---");

        const pagedResult = await repository.getContactsPaged(1, 10, "Sebastian");
        console.log(JSON.stringify(pagedResult, null, 2));

        console.log("\n--- Testing getContactsForExport ---");

        const exportResult = await repository.getContactsForExport();
        console.log(JSON.stringify(exportResult, null, 2));

        console.log("\n--- Testing getContactById ---");

      const contact = await repository.getContactById(99999999);
        console.log(JSON.stringify(contact, null, 2));

        console.log("\nRead-only repository tests completed.");
    } catch (error) {
        console.error("Repository test failed:", error);
    }

    process.exit();
}

testRepository();