import { db } from "../database/connection";

export const listarDemandas = async (req: any, res: any) => {
    const demanda = await db('demandas').select('*')
    .innerJoin("tipo_servico", "demandas.tipo_servico_id", "tipo_servico.id")
    .innerJoin("cliente", "demandas.cliente_id", "cliente.id");

    return res.json(demanda);
};

export const criarDemandas = async (req: any, res: any) => {
    const { descricao, tipo_servico_id, cliente_id, orcamento, data_solicitacao, prazo, prioridade, status_servico, data_entrega } = req.body;
    const demanda = await db("demands").insert({
        descricao, 
        tipo_servico_id, 
        cliente_id, 
        orcamento, 
        data_solicitacao, 
        prazo, 
        prioridade, 
        status_servico, 
        data_entrega
    });
    return res.json(demanda);
};