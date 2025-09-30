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

        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao listar situações de produto:", error);
        return res.status(500).json({ messagem: "Erro ao listar as situações de produto!" });
    }
});

// Buscar product situation por id
router.get("/productsituations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });

        if (!productSituation) {
            return res.status(404).json({ messagem: "Situação de produto não encontrada!" });
        }

        return res.status(200).json(productSituation);
    } catch (error) {
        console.error("Erro ao buscar situação de produto:", error);
        return res.status(500).json({ messagem: "Erro ao buscar a situação de produto!" });
    }
});

// Criar nova product situation
router.post("/productsituations", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        
        if (!data.name) {
            return res.status(400).json({ messagem: "O nome da situação de produto é obrigatório!" });
        }

        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Verifica se já existe situação com mesmo nome
        const existingSituation = await productSituationRepository.findOneBy({ name: data.name });
        if (existingSituation) {
            return res.status(409).json({ messagem: "Já existe uma situação de produto com esse nome!" });
        }

        const newProductSituation = productSituationRepository.create(data);
        await productSituationRepository.save(newProductSituation);

        return res.status(201).json({
            messagem: "Situação de produto cadastrada com sucesso!",
            productSituation: newProductSituation,
        });
    } catch (error) {
        console.error("Erro ao cadastrar situação de produto:", error);
        return res.status(500).json({ messagem: "Erro ao cadastrar a situação de produto!" });
    }
});

// Atualizar product situation
router.put("/productsituations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!data.name) {
            return res.status(400).json({ messagem: "O nome da situação de produto é obrigatório!" });
        }

        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });

        if (!productSituation) {
            return res.status(404).json({ messagem: "Situação de produto não encontrada!" });
        }

        // Verifica se já existe outra situação com mesmo nome
        const existingSituation = await productSituationRepository.findOneBy({ name: data.name });
        if (existingSituation && existingSituation.id !== parseInt(id)) {
            return res.status(409).json({ messagem: "Já existe uma situação de produto com esse nome!" });
        }

        productSituationRepository.merge(productSituation, data);
        const updatedProductSituation = await productSituationRepository.save(productSituation);

        return res.status(200).json({
            messagem: "Situação de produto atualizada com sucesso!",
            productSituation: updatedProductSituation,
        });
    } catch (error) {
        console.error("Erro ao atualizar situação de produto:", error);
        return res.status(500).json({ messagem: "Erro ao atualizar a situação de produto!" });
    }
});

// Deletar product situation
router.delete("/productsituations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });

        if (!productSituation) {
            return res.status(404).json({ messagem: "Situação de produto não encontrada!" });
        }

        await productSituationRepository.remove(productSituation);

        return res.status(200).json({ messagem: "Situação de produto removida com sucesso!" });
    } catch (error) {
        console.error("Erro ao remover situação de produto:", error);
        return res.status(500).json({ messagem: "Erro ao remover a situação de produto!" });
    }
});

export default router;
