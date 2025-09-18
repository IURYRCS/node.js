import express from "express";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

import AuthController from"./controllers/AuthController";
import SituationsController from"./controllers/SituationsController"

app.use('/', AuthController)
app.use('/', SituationsController)

app.listen(process.env.PORT, () => {
    console.log( `Servidor Iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});