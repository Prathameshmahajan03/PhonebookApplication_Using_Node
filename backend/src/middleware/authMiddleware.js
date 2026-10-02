const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const token = authorizationHeader.substring("Bearer ".length).trim();

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        });

        next();
    } catch {
        return res.sendStatus(401);
    }
}

module.exports = authMiddleware;