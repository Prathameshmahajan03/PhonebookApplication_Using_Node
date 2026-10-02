
const { poolPromise } = require("./src/config/db");

async function testConnection() {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(
            "SELECT DB_NAME() AS databaseName"
        );

        console.log("Database connection successful!");
        console.log("Connected Database:", result.recordset[0].databaseName);

        await pool.close();
        process.exit(0);

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

testConnection();