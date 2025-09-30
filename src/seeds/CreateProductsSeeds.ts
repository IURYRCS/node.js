import { DataSource } from "typeorm";
import { Products } from "../entity/Products";
import { Categorie } from "../entity/Categories";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductsSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'products'...");

        const productsRepository = dataSource.getRepository(Products);
        const categoryRepository = dataSource.getRepository(Categorie);
        const productSituationRepository = dataSource.getRepository(ProductSituation);

        const existingCount = await productsRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const categoryEletronicos = await categoryRepository.findOneBy({ name: "Eletrônicos" });
        const categoryRoupas = await categoryRepository.findOneBy({ name: "Roupas" });

        const situationDisponivel = await productSituationRepository.findOneBy({ name: "Disponível" });
        const situationEsgotado = await productSituationRepository.findOneBy({ name: "Esgotado" });

        if (!categoryEletronicos || !categoryRoupas || !situationDisponivel || !situationEsgotado) {
            throw new Error("Categorias ou situações de produto necessárias não encontradas para a seed de produtos.");
        }

        const products = [
            {
                nome: "Smartphone XYZ",
                category: categoryEletronicos,
                productSituation: situationDisponivel,
            },
            {
                nome: "Camiseta Azul",
                category: categoryRoupas,
                productSituation: situationDisponivel,
            },
            {
                nome: "Notebook ABC",
                category: categoryEletronicos,
                productSituation: situationEsgotado,
            },
        ];

        await productsRepository.save(products);

        console.log("Seed concluída com sucesso: produtos cadastrados!");
    }
}