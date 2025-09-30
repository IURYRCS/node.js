import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductSituationsSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'productsituation'...");

        const productSituationRepository = dataSource.getRepository(ProductSituation);

        const existingCount = await productSituationRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'productsituation' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const productSituations = [
            { name: "Disponível" },
            { name: "Indisponível" },
            { name: "Esgotado" },
        ];

        await productSituationRepository.save(productSituations);

        console.log("Seed concluída com sucesso: situações de produto cadastradas!");
    }
}