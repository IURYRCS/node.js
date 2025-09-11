"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var data_source_1 = require("../data-source");
var router = express_1.default.Router();
data_source_1.AppDataSource.initialize().then(function () {
    console.log("conexão do banco de dados realizado com sucesso!");
}).catch(function (error) {
    console.log("erro na conexao com o banco de dados");
});
router.get("/", function (req, res) {
    res.send("Bem-v indo pessoal!!!");
});
exports.default = router;
