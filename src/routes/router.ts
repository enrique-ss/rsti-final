import { Router } from "express";
import { criarUsuario, listarCliente } from "../controllers/usuario.controller";
import { atualizarDemandas, criarDemandas, listarDemandas } from "../controllers/demanda.controller";
import { listarEntregas } from "../controllers/entregas.controller";


export const router = Router();

// usuario
router.post('/criar-usuario', criarUsuario);
router.get('/listar-cliente', listarCliente);

// demanda
router.post('/demandas', criarDemandas);
router.get('/demandas', listarDemandas);
router.put('/demandas/:id', atualizarDemandas);

// entrega
router.get('/entregas', listarEntregas);

