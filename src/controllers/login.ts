import express, {Request, Response} from "express";

import { AppDataSource } from "../data-source";
import { error } from "console";

const router = express.Router();

AppDataSource.initialize().then(()=>{
console.log("conexão do banco de dados realizado com sucesso!")
} ).catch((error)=>{
console.log("erro na conexao com o banco de dados")
})

router.get("/",(req:Request, res:Response) => {
res.send("Bem-v indo pessoal!!!")
})

export default router