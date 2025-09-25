import { DataSource } from "typeorm";
import { User } from "../entity/Users"; // Ajuste o path conforme sua estrutura (baseado no seu controller)

export default class CreateUsersSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'users'...");

        const userRepository = dataSource.getRepository(User);

        const existingCount = await userRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const users = [
            { nome: "João Silva", email: "joao.silva@email.com", situationId: 1 }, // Ativo
            { nome: "Maria Oliveira", email: "maria.oliveira@email.com", situationId: 2 }, // Inativo
            { nome: "Pedro Santos", email: "pedro.santos@email.com", situationId: 3 }, // Pendente
            { nome: "Ana Costa", email: "ana.costa@email.com", situationId: 1 }, // Ativo
        ];

        await userRepository.save(users);

        console.log("Seed concluída com sucesso: usuários cadastrados!");
    }
}