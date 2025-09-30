import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categorie } from "../entity/Categories";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// Listar categorias com paginação
router.get("/categories", async (req: Request, res: Response) => {
    try {
        const categorieRepository = AppDataSource.getRepository(Categorie);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(categorieRepository, page, limit, { id: "DESC" });

        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao listar as categorias!"
        });
        return;
    }
});

// Buscar categoria por ID
router.get("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const categorieRepository = AppDataSource.getRepository(Categorie);

        const categorie = await categorieRepository.findOneBy({ id: parseInt(id) });

        if (!categorie) {
            res.status(404).json({
                messagem: "Categoria não encontrada!"
            });
            return;
        }

        res.status(200).json(categorie);
        return;
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao buscar a categoria!"
        });
        return;
    }
});

// Criar nova categoria
router.post("/categories", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (!data.name) {
            res.status(400).json({
                messagem: "O nome da categoria é obrigatório!"
            });
            return;
        }

        const categorieRepository = AppDataSource.getRepository(Categorie);

        const existingCategorie = await categorieRepository.findOneBy({ name: data.name });
        if (existingCategorie) {
            res.status(409).json({
                messagem: "Já existe uma categoria com esse nome!"
            });
            return;
        }

        const newCategorie = categorieRepository.create(data);
        await categorieRepository.save(newCategorie);

        res.status(201).json({
            messagem: "Categoria cadastrada com sucesso!",
            categorie: newCategorie
        });
        return;
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao cadastrar a categoria!"
        });
        return;
    }
});

// Atualizar categoria
router.put("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!data.name) {
            res.status(400).json({
                messagem: "O nome da categoria é obrigatório!"
            });
            return;
        }

        const categorieRepository = AppDataSource.getRepository(Categorie);

        const categorie = await categorieRepository.findOneBy({ id: parseInt(id) });

        if (!categorie) {
            res.status(404).json({
                messagem: "Categoria não encontrada!"
            });
            return;
        }

        const existingCategorie = await categorieRepository.findOneBy({ name: data.name });
        if (existingCategorie && existingCategorie.id !== parseInt(id)) {
            res.status(409).json({
                messagem: "Já existe uma categoria com esse nome!"
            });
            return;
        }

        categorieRepository.merge(categorie, data);
        const updatedCategorie = await categorieRepository.save(categorie);

        res.status(200).json({
            messagem: "Categoria atualizada com sucesso!",
            categorie: updatedCategorie
        });
        return;
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao atualizar a categoria!"
        });
        return;
    }
});

// Deletar categoria
router.delete("/categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const categorieRepository = AppDataSource.getRepository(Categorie);

        const categorie = await categorieRepository.findOneBy({ id: parseInt(id) });

        if (!categorie) {
            res.status(404).json({
                messagem: "Categoria não encontrada!"
            });
            return;
        }

        await categorieRepository.remove(categorie);

        res.status(200).json({
            messagem: "Categoria removida com sucesso!"
        });
        return;
    } catch (error) {
        res.status(500).json({
            messagem: "Erro ao remover a categoria!"
        });
        return;
    }
});

export default router;