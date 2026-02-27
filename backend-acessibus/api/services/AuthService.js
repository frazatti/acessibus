const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async login(email, senha) {
        const user = await userRepository.findUserByEmail(email);
        
        if (!user) {
            throw new Error("Email ou senha inválidos");
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        
        if (!isMatch) {
            throw new Error("Email ou senha inválidos");
        }

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            foto: user.foto,
            token: token
        };
    }
}

module.exports = new AuthService();