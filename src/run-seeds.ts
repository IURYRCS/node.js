import { AppDataSource } from "./data-source"
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async() => {
    console.log("Conectando com o banco de dados...")

    await AppDataSource.initialize();

    console.log("Banco de dados conectados!")

    try{
        const situationsSeeds = new CreateSituationsSeeds();

        await situationsSeeds.run(AppDataSource);

    }catch(error){

        console.log("Erro ao executar a seed", error);
    }finally{
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")
    }
};
runSeeds();