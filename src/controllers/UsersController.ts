import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import { Situation } from "../entity/Situations";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// Listar usuários com paginação
router.get("/users", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ mensagem: "Parâmetros de paginação inválidos!" });
        }

        const [users, total] = await userRepository.findAndCount({
            relations: ["situation"],
            order: { id: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            situationNome: user.situation?.nameSituation ?? null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        return res.status(200).json({
            page,
            limit,
            total,
            data: formattedUsers,
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao listar os usuários!" });
    }
});

// Buscar usuário por ID
router.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["situation"], 
        });

        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ mensagem: "Erro ao buscar o usuário!" });
    }
});

// Criar novo usuário
router.post("/users", async (req: Request, res: Response) => {
    try {
        const { nome, email, situationId } = req.body;

        if (!nome || !email || !situationId) {
            return res.status(400).json({ mensagem: "Campos obrigatórios (nome, email, situationId) estão faltando!" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id: situationId });

        if (!situation) {
            return res.status(404).json({ mensagem: "Situação não encontrada!" });
        }

        const newUser = userRepository.create({
            nome,
            email,
            situation,
        });

        await userRepository.save(newUser);

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            user: newUser,
        });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ mensagem: "Erro ao cadastrar o usuário!" });
    }
});

// Atualizar usuário por ID
router.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const { nome, email, situationId } = req.body;

        if (isNaN(userId)) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const situationRepository = AppDataSource.getRepository(Situation);

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["situation"],
        });

        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        if (nome) user.nome = nome;
        if (email) user.email = email;

        if (situationId) {
            const situation = await situationRepository.findOneBy({ id: situationId });

            if (!situation) {
                return res.status(404).json({ mensagem: "Situação não encontrada!" });
            }

            user.situation = situation;
        }

        const updatedUser = await userRepository.save(user);

        return res.status(200).json({
            mensagem: "Usuário atualizado com sucesso!",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ mensagem: "Erro ao atualizar o usuário!" });
    }
});

// Deletar usuário por ID
router.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        await userRepository.remove(user);

        return res.status(200).json({
            mensagem: "Usuário removido com sucesso!",
        });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).json({ mensagem: "Erro ao deletar o usuário!" });
    }
});

export default router;
