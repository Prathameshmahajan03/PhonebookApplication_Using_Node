const AuthService = require("../services/authService");

const authService = new AuthService();

class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body ?? {};

            if (
                typeof username !== "string" ||
                username.trim().length === 0 ||
                username.length > 100 ||
                typeof password !== "string" ||
                password.length === 0 ||
                password.length > 256
            ) {
                return res.status(400).json({
                    message: "Invalid username or password."
                });
            }

            const response = await authService.login({
                username,
                password
            });

            if (!response) {
                return res.sendStatus(401);
            }

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();