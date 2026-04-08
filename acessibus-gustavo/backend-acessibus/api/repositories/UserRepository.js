const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserRepository {
    async create(data) {
        return await prisma.usuarios.create({
            data: data
        })
    }

    async update(id, data) {
        return await prisma.usuarios.update({
            where: { id: Number(id) },
            data: data
        })
    }

    async findUserByEmail(email) {
        return await prisma.usuarios.findUnique({
            where: { email }
        });
    }

    async getAllUsers() {
        return await prisma.usuarios.findMany()
    }

    async findUserById(id) {
        return await prisma.usuarios.findUnique({
            where: { id: Number(id) }
        })
    }
}

module.exports = new UserRepository();