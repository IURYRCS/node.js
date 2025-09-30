import { DataSource } from "typeorm";
import { User } from "../entity/Users";
import { Situation } from "../entity/Situations"; // Importe a entidade Situation

export default class CreateUsersSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a seed para a tabela 'users'...");

        const userRepository = dataSource.getRepository(User);
        const situationRepository = dataSource.getRepository(Situation);

        const existingCount = await userRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const situationAtivo = await situationRepository.findOneBy({ id: 1 });
        const situationInativo = await situationRepository.findOneBy({ id: 2 });
        const situationPendente = await situationRepository.findOneBy({ id: 3 });

        if (!situationAtivo || !situationInativo || !situationPendente) {
            throw new Error("Situações necessárias não encontradas no banco.");
        }

        const users = [
            { nome: "João Silva", email: "joao.silva@email.com", situation: situationAtivo },
            { nome: "Maria Oliveira", email: "maria.oliveira@email.com", situation: situationInativo },
            { nome: "Pedro Santos", email: "pedro.santos@email.com", situation: situationPendente },
            { nome: "Ana Costa", email: "ana.costa@email.com", situation: situationAtivo },
        ];

        await userRepository.save(users);

        console.log("Seed concluída com sucesso: usuários cadastrados!");
    }
}