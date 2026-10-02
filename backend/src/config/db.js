
const sql = require("mssql/msnodesqlv8");

const dbConfig = {
    connectionString:
        "Driver={ODBC Driver 17 for SQL Server};Server=.\\SQLEXPRESS;Database=PhonebookDB_TestRestore;Trusted_Connection=Yes;TrustServerCertificate=Yes;"
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("Connected to SQL Server successfully!");
        return pool;
    })
    .catch(error => {
        console.error("Database connection failed:", error.message);
        throw error;
    });

module.exports = {
    sql,
    poolPromise
};