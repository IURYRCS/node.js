import { DataSource } from "typeorm";
import { Categorie } from "../entity/Categories";

export default class CreateCategoriesSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'category'...");

        const categoryRepository = dataSource.getRepository(Categorie);

        const existingCount = await categoryRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'category' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const categories = [
            { name: "Eletrônicos" },
            { name: "Roupas" },
            { name: "Alimentos" },
        ];

        await categoryRepository.save(categories);

        console.log("Seed concluída com sucesso: categorias cadastradas!");
    }
}