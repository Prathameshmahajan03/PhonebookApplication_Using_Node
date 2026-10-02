const crypto = require("crypto");

class PasswordService {
    verifyPassword(hashedPassword, providedPassword) {
        if (
            typeof hashedPassword !== "string" ||
            typeof providedPassword !== "string"
        ) {
            return false;
        }

        let decodedHash;

        try {
            decodedHash = Buffer.from(hashedPassword, "base64");
        } catch {
            return false;
        }

        if (decodedHash.length === 0) {
            return false;
        }

        const formatVersion = decodedHash[0];

        // ASP.NET Core Identity V2 format:
        // 0x00 + 16-byte salt + 32-byte subkey
        if (formatVersion === 0x00) {
            if (decodedHash.length !== 49) {
                return false;
            }

            const salt = decodedHash.subarray(1, 17);
            const expectedSubkey = decodedHash.subarray(17);

            const actualSubkey = crypto.pbkdf2Sync(
                providedPassword,
                salt,
                1000,
                32,
                "sha1"
            );

            return crypto.timingSafeEqual(actualSubkey, expectedSubkey);
        }

        // ASP.NET Core Identity V3 format:
        // 0x01 + PRF + iterations + salt length + salt + subkey
        if (formatVersion === 0x01) {
            if (decodedHash.length < 13) {
                return false;
            }

            const prf = decodedHash.readUInt32BE(1);
            const iterations = decodedHash.readUInt32BE(5);
            const saltLength = decodedHash.readUInt32BE(9);

            const saltStart = 13;
            const saltEnd = saltStart + saltLength;

            if (
                iterations <= 0 ||
                saltLength <= 0 ||
                saltEnd >= decodedHash.length
            ) {
                return false;
            }

            const salt = decodedHash.subarray(saltStart, saltEnd);
            const expectedSubkey = decodedHash.subarray(saltEnd);

            const digestAlgorithms = {
                0: "sha1",
                1: "sha256",
                2: "sha512"
            };

            const digest = digestAlgorithms[prf];

            if (!digest) {
                return false;
            }

            const actualSubkey = crypto.pbkdf2Sync(
                providedPassword,
                salt,
                iterations,
                expectedSubkey.length,
                digest
            );

            return crypto.timingSafeEqual(actualSubkey, expectedSubkey);
        }

        return false;
    }
}

module.exports = PasswordService;