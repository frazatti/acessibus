const jwt = require('jsonwebtoken');

class OptionalAuthMiddleware {

    validation = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            req.userId = null;
            return next();
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            req.userId = null;
            return next();
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            req.userId = null;
            return next();
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                req.userId = null;
                return next();
            }
            req.userId = decoded.id;
            return next();
        });
    }
}

module.exports = new OptionalAuthMiddleware();