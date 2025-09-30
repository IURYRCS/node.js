import { AppDataSource } from "./data-source"
import CreateCategoriesSeeds from "./seeds/CreateCategoriesSeeds";
import CreateProductSituationsSeeds from "./seeds/CreateProductSituationsSeeds";
import CreateProductsSeeds from "./seeds/CreateProductsSeeds";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateUsersSeeds from "./seeds/CreateUsersSeeds";

const runSeeds = async() => {
    console.log("Conectando com o banco de dados...")

    await AppDataSource.initialize();

    console.log("Banco de dados conectados!")

    try{
        const situationsSeeds = new CreateSituationsSeeds();
        const usersSeeds = new CreateUsersSeeds();
        const categoriesSeeds = new CreateCategoriesSeeds();
        const productSituationsSeeds = new CreateProductSituationsSeeds();
        const productsSeeds = new CreateProductsSeeds();

        await situationsSeeds.run(AppDataSource);
        await usersSeeds.run(AppDataSource);
        await categoriesSeeds.run(AppDataSource);
        await productSituationsSeeds.run(AppDataSource);
        await productsSeeds.run(AppDataSource);

    }catch(error){

        console.log("Erro ao executar a seed", error);
    }finally{
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")
    }
};
runSeeds();