import { DataSource } from "typeorm";
import { Categorie } from "../entity/Categories";

export default class CreateCategoriesSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'categories'...");

        const categorieRepository = dataSource.getRepository(Categorie);

        const existingCount = await categorieRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'categorie' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const categories = [
            { name: "Eletrônicos" },
            { name: "Roupas" },
            { name: "Alimentos" },
        ];

        await categorieRepository.save(categories);

        console.log("Seed concluída com sucesso: categorias cadastradas!");
    }
}