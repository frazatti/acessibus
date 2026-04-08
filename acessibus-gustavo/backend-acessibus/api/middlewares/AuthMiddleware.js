const jwttoken = require('jsonwebtoken');

class AuthMiddleware {
    validation = async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({ error: "Acesso negado. É preciso fazer login para continuar" });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ error: "Erro no formato do token" });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: "Token malformatado "});
        } 

        jwttoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Token inválido" });
            }
            req.userId = decoded.id;
            return next();
        });

    }
}

module.exports = new AuthMiddleware();