const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs')
const jwttoken = require('jsonwebtoken')

class UserService {

    async registerUser(nome, email, senha, foto) {
        const userExists = await UserRepository.findUserByEmail(email);

        if (userExists) {
            throw new Error("Já existe um usuário com este email");
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(senha, salt)
        if (foto == null) {
            foto = ""
        }
        const newUser = await UserRepository.create({
            nome,
            email,
            senha: hashedPassword,
            foto
        });

        const { senha: _, ...userOutput } = newUser;
        return userOutput;
    }

    async updateUser(id, data) {
        const user = UserRepository.findUserById(id);
        if (!user) {
            throw new Error("Usuário não encontrado.")
        }

        let updateData = {}

        if (data.nome) updateData.nome = data.nome

        if (data.foto) updateData.foto = data.foto;

        if (data.email && data.email !== user.email) {
            const emailExists = await UserRepository.findUserByEmail(data.email);
            if (emailExists && emailExists.id !== id) {
                throw new Error("Email inválido, por favor, insira outro email.");
            }
            updateData.email = data.email;
        }

        if (data.senha) {
            const salt = await bcrypt.genSalt(10)
            updateData.senha = await bcrypt.hash(data.senha, salt)
        }

        const updatedUser = await UserRepository.update(id, updateData);

        const { senha: _, ...userOutput } = updatedUser;
        return userOutput;
    }

    async getUserById(id) {
        const user = await UserRepository.findUserById(id);
        if (!user) {
            throw new Error("Não foi possível encontrar o usuário");
        }
        const { senha: _, ...userOutput } = user;
        return userOutput;
    }

}

module.exports = new UserService();