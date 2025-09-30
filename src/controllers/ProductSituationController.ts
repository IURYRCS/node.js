import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituations";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// Listar product situations com paginação
router.get("/productsituations", async (req: Request, res: Response) => {
    try {
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(productSituationRepository, page, limit, { id: "DESC" });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao listar as situações de produto!" });
    }
});

// Buscar product situation por id
router.get("/productsituations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });

        if (!productSituation) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }

        res.status(200).json(productSituation);
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao buscar a situação de produto!" });
    }
});

// Criar nova product situation
router.post("/productsituations", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const newProductSituation = productSituationRepository.create(data);
        await productSituationRepository.save(newProductSituation);

        res.status(201).json({
            messagem: "Situação de produto cadastrada com sucesso!",
            productSituation: newProductSituation,
        });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao cadastrar a situação de produto!" });
    }
});

// Atualizar product situation
router.put("/productsituations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });

        if (!productSituation) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }

        productSituationRepository.merge(productSituation, data);
        const updatedProductSituation = await productSituationRepository.save(productSituation);

        res.status(200).json({
            messagem: "Situação de produto atualizada com sucesso!",
            productSituation: updatedProductSituation,
        });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao atualizar a situação de produto!" });
    }
});

// Deletar product situation
router.delete("/productsituations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });

        if (!productSituation) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }

        await productSituationRepository.remove(productSituation);

        res.status(200).json({ messagem: "Situação de produto removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ messagem: "Erro ao remover a situação de produto!" });
    }
});

export default router;