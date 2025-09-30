import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categorie } from "../entity/Categories";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// Listar categorias com paginação
router.get("/categories", async (req: Request, res: Response) => {
    try {
        const categoryRepository = AppDataSource.getRepository(Categorie);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(categoryRepository, page, limit, { id: "DESC" });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao listar as categorias!" });
    }
});

// Buscar categoria por id
router.get("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoryRepository = AppDataSource.getRepository(Categorie);

        const category = await categoryRepository.findOneBy({ id: parseInt(id) });

        if (!category) {
            res.status(404).json({ messagem: "Categoria não encontrada!" });
            return;
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao buscar a categoria!" });
    }
});

// Criar nova categoria
router.post("/categories", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const categoryRepository = AppDataSource.getRepository(Categorie);

        const newCategory = categoryRepository.create(data);
        await categoryRepository.save(newCategory);

        res.status(201).json({
            messagem: "Categoria cadastrada com sucesso!",
            category: newCategory,
        });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao cadastrar a categoria!" });
    }
});

// Atualizar categoria
router.put("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const categoryRepository = AppDataSource.getRepository(Categorie);

        const category = await categoryRepository.findOneBy({ id: parseInt(id) });

        if (!category) {
            res.status(404).json({ messagem: "Categoria não encontrada!" });
            return;
        }

        categoryRepository.merge(category, data);
        const updatedCategory = await categoryRepository.save(category);

        res.status(200).json({
            messagem: "Categoria atualizada com sucesso!",
            category: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao atualizar a categoria!" });
    }
});

// Deletar categoria
router.delete("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoryRepository = AppDataSource.getRepository(Categorie);

        const category = await categoryRepository.findOneBy({ id: parseInt(id) });

        if (!category) {
            res.status(404).json({ messagem: "Categoria não encontrada!" });
            return;
        }

        await categoryRepository.remove(category);

        res.status(200).json({ messagem: "Categoria removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao remover a categoria!" });
    }
});

export default router;