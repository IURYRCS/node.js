import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Products } from "../entity/Products";
import { PaginationService } from "../services/PaginationService";
import { ProductSituation } from "../entity/ProductSituations";
import { Categorie } from "../entity/Categories";

const router = express.Router();

// Listar produtos com paginação
router.get("/products", async (req: Request, res: Response) => {
    try {
        const productsRepository = AppDataSource.getRepository(Products);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ mensagem: "Parâmetros de paginação inválidos!" });
        }

        const [items, total] = await productsRepository.findAndCount({
            relations: ["categorie", "productSituation"], 
            skip: (page - 1) * limit,
            take: limit,
            order: { id: "DESC" },
        });

        return res.status(200).json({
            data: items,
            total,
            page,
            last_page: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error("Erro ao listar os produtos:", error);
        return res.status(500).json({
            mensagem: "Erro ao listar os produtos!"
        });
    }
});


// Buscar produto por id
router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productsRepository = AppDataSource.getRepository(Products);

        const product = await productsRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["categorie", "productSituation"],
        });

        if (!product) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao buscar o produto!" });
    }
});

router.post("/products", async (req: Request, res: Response) => {
    try {
        const { nome, categorieId, productSituationId } = req.body;

        if (!nome || !categorieId || !productSituationId) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios (nome, categorieId, productSituationId) estão faltando!"
            });
        }

        const productsRepository = AppDataSource.getRepository(Products);
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);
        const categorieRepository = AppDataSource.getRepository(Categorie);

        const situation = await productSituationRepository.findOneBy({ id: productSituationId });
        const categorie = await categorieRepository.findOneBy({ id: categorieId });

        if (!situation) {
            return res.status(404).json({ mensagem: "Situação do produto não encontrada!" });
        }

        if (!categorie) {
            return res.status(404).json({ mensagem: "Categoria não encontrada!" });
        }

        const newProduct = productsRepository.create({
            nome,
            categorie: categorie, 
            productSituation: situation, 
        });

        await productsRepository.save(newProduct);

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            product: newProduct,
        });

    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar o produto!"
        });
    }
});

// Atualizar produto
router.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const productsRepository = AppDataSource.getRepository(Products);

        const product = await productsRepository.findOneBy({ id: parseInt(id) });

        if (!product) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }

        productsRepository.merge(product, data);
        const updatedProduct = await productsRepository.save(product);

        res.status(200).json({
            messagem: "Produto atualizado com sucesso!",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao atualizar o produto!" });
    }
});

// Deletar produto
router.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productsRepository = AppDataSource.getRepository(Products);

        const product = await productsRepository.findOneBy({ id: parseInt(id) });

        if (!product) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }

        await productsRepository.remove(product);

        res.status(200).json({ messagem: "Produto removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao remover o produto!" });
    }
});

export default router;