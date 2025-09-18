import "reflect-metadata";
import { DataSource } from "typeorm";
import { Situation } from "./entity/Situations";
import { User } from "./entity/Users";

import dotenv from "dotenv";
dotenv.config();

    const dialect = process.env.DB_DIALECT ?? "mysql";

export const AppDataSource = new DataSource({
    type: dialect as "mysql" | "mariadb" | "postgres" | "mongodb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situation, User],
    subscribers: [],
    migrations: [__dirname+ "/migration/*.js"],
})

AppDataSource.initialize().then(()=>{
console.log("conexão do banco de dados realizado com sucesso!")
} ).catch((error)=>{
console.log("erro na conexao com o banco de dados")
})