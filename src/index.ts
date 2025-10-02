import express from "express";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

import AuthController from"./controllers/AuthController";
import SituationsController from"./controllers/SituationsController";
import UsersController from "./controllers/UsersController";
import CategoriesController from "./controllers/CategoriesController";
import ProductsController from "./controllers/ProductsController"
import ProductSituationController from "./controllers/ProductSituationController"

app.use('/', AuthController)
app.use('/', SituationsController)
app.use('/', UsersController)
app.use('/', CategoriesController)
app.use('/', ProductSituationController)
app.use('/', ProductsController)

app.listen(process.env.PORT, () => {
    console.log( `Servidor Iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});