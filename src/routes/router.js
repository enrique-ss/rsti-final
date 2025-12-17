"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var usuario_controller_1 = require("../controllers/usuario.controller");
var demanda_controller_1 = require("../controllers/demanda.controller");
exports.router = (0, express_1.Router)();
// usuario
exports.router.post('/criar-usuario', usuario_controller_1.criarUsuario);
exports.router.get('/listar-clientes', usuario_controller_1.listarCliente);
// tipo_servico
// demanda
exports.router.get('/demandas', demanda_controller_1.listarDemandas);
exports.router.post('/demandas', demanda_controller_1.criarDemandas);
