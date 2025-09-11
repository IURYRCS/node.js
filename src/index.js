"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var app = (0, express_1.default)();
var login_1 = require("./controllers/login");
app.use('/', login_1.default);
app.listen(process.env.PORT, function () {
    console.log("Servidor Iniciado na porta ".concat(process.env.PORT, ": http://localhost:").concat(process.env.PORT));
});
