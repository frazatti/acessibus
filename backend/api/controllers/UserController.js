const userService = require('../services/UserService');
const authService = require('../services/AuthService')

class UserController {
    register = async (req, res) => {
        const { nome, email, senha, foto } = req.body;
        console.log("[CONTROLLER] Iniciando registro...");

        try {
            const user = await userService.registerUser(nome, email, senha, foto);
            console.log("[CONTROLLER] Usuário criado com sucesso!");
            return res.status(201).json(user);
        } catch (error) {
            console.log("[CONTROLLER] 🔴 Erro no registro:", error.message);
            if (error.message === "Já existe um usuário com este email") {
                return res.status(400).json({ error: error.message });
            }
            console.log(error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    update = async (req, res) => {
        try {
            const userId = req.userId;
            const { nome, email, senha, foto } = req.body;

            const updatedUser = await userService.updateUser(userId, {
                nome, email, senha, foto
            });

            return res.json(updatedUser);

        } catch (error) {
            console.log("Erro ao atualizar", error);
            if (error.message === "Este email já está em uso por outra pessoa") {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro ao atualizar perfil" });
        }
    }

    login = async (req, res) => {
        const { email, senha } = req.body;
        console.log(`[CONTROLLER] Login solicitado para: ${email}`);

        try {
            const data = await authService.login(email, senha);
            console.log("[CONTROLLER] ✅ Login autorizado. Token gerado.");
            return res.status(200).json(data)
        } catch (error) {
            console.log("[CONTROLLER] 🔴 Falha no login:", error.message);
            if (error.message === "Email ou senha inválidos") {
                return res.status(401).json({ error: error.message });
            }
            console.log(error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    getProfile = async (req, res) => {
        try {
            const userId = req.userId
            const user = await userService.getUserById(userId)
            return res.json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao buscar perfil" })
        }
    }
}

module.exports = new UserController();