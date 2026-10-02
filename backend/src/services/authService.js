const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");
const PasswordService = require("./passwordService");

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
        this.passwordService = new PasswordService();
    }

    async login(request) {
        const user = await this.userRepository.getUserForLogin(
            request.username
        );

        if (
            !user ||
            !this.passwordService.verifyPassword(
                user.passwordHash,
                request.password
            )
        ) {
            return null;
        }

        const issuer = process.env.JWT_ISSUER;
        const audience = process.env.JWT_AUDIENCE;
        const signingKey = process.env.JWT_SECRET;

        if (!issuer || !audience || !signingKey) {
            throw new Error("JWT configuration is missing.");
        }

        if (Buffer.byteLength(signingKey, "utf8") < 32) {
            throw new Error("JWT_SECRET must contain at least 32 bytes.");
        }

        const issuedAt = Math.floor(Date.now() / 1000);
        const expiresAt = new Date((issuedAt + 3600) * 1000);

        const token = jwt.sign(
            {
                nameid: String(user.id),
                unique_name: user.username
            },
            signingKey,
            {
                algorithm: "HS256",
                issuer,
                audience,
                expiresIn: "1h",
                notBefore: 0
            }
        );

        return {
            token,
            username: user.username,
            expiresAt: expiresAt.toISOString()
        };
    }
}

module.exports = AuthService;