"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router_1 = require("./routes/router");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", router_1.router);
app.listen(3000, function () { return console.log("Servidor rodando na porta 3000 🚀"); });
