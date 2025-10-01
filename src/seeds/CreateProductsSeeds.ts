import { DataSource } from "typeorm";
import { Products } from "../entity/Products";
import { Categorie } from "../entity/Categories";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductsSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'products'...");

        const productsRepository = dataSource.getRepository(Products);
        const categoriesRepository = dataSource.getRepository(Categorie);
        const productSituationRepository = dataSource.getRepository(ProductSituation);

        const existingCount = await productsRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const categorieEletronicos = await categoriesRepository.findOneBy({ name: "Eletrônicos" });
        const categorieRoupas = await categoriesRepository.findOneBy({ name: "Roupas" });

        const situationDisponivel = await productSituationRepository.findOneBy({ name: "Disponível" });
        const situationEsgotado = await productSituationRepository.findOneBy({ name: "Esgotado" });

        if (!categorieEletronicos || !categorieRoupas || !situationDisponivel || !situationEsgotado) {
            throw new Error("Categorias ou situações de produto necessárias não encontradas para a seed de produtos.");
        }

        const products = [
            {
                nome: "Smartphone XYZ",
                categorie: categorieEletronicos,
                productSituation: situationDisponivel,
            },
            {
                nome: "Camiseta Azul",
                categorie: categorieRoupas,
                productSituation: situationDisponivel,
            },
            {
                nome: "Notebook ABC",
                categorie: categorieEletronicos,
                productSituation: situationEsgotado,
            },
        ];

        await productsRepository.save(products);

        console.log("Seed concluída com sucesso: produtos cadastrados!");
    }
}