const { sql, poolPromise } = require("../config/db");

class UserRepository {
    async getUserForLogin(username) {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("Username", sql.NVarChar(100), username)
            .execute("dbo.sp_GetUserForLogin");

        if (!result.recordset || result.recordset.length === 0) {
            return null;
        }

        const row = result.recordset[0];

        return {
            id: row.Id,
            username: row.Username,
            passwordHash: row.PasswordHash
        };
    }

    async insertUserIfNotExists(user) {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("Username", sql.NVarChar(100), user.username)
            .input("PasswordHash", sql.NVarChar(512), user.passwordHash)
            .execute("dbo.sp_InsertUserIfNotExists");

        return Number(result.recordset?.[0]?.WasCreated) === 1;
    }
}

module.exports = UserRepository;