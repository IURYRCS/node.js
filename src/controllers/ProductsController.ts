import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Products } from "../entity/Products";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// Listar produtos com paginação
router.get("/products", async (req: Request, res: Response) => {
    try {
        const productsRepository = AppDataSource.getRepository(Products);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // Para trazer as relações category e productSituation, usar findAndCount com relations
        const [items, total] = await productsRepository.findAndCount({
            relations: ["category", "productSituation"],
            skip: (page - 1) * limit,
            take: limit,
            order: { id: "DESC" },
        });

        res.status(200).json({
            data: items,
            total,
            page,
            last_page: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao listar os produtos!" });
    }
});

// Buscar produto por id
router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productsRepository = AppDataSource.getRepository(Products);

        const product = await productsRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["category", "productSituation"],
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

// Criar novo produto
router.post("/products", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const productsRepository = AppDataSource.getRepository(Products);

        // Criar o produto (assumindo que data.category e data.productSituation são ids)
        const product = productsRepository.create(data);

        await productsRepository.save(product);

        res.status(201).json({
            messagem: "Produto cadastrado com sucesso!",
            product,
        });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao cadastrar o produto!" });
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