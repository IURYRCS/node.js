import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductSituationsSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'productsituations'...");

        const productSituationsRepository = dataSource.getRepository(ProductSituation);

        const existingCount = await productSituationsRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'productsituations' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const productSituations = [
            { name: "Disponível" },
            { name: "Indisponível" },
            { name: "Esgotado" },
        ];

        await productSituationsRepository.save(productSituations);

        console.log("Seed concluída com sucesso: situações de produto cadastradas!");
    }
}