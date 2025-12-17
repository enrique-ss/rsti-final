import db from '../database/connection';

export const index = async (req: any, res: any) => {
  const entregas = await db('demandas')
  .select('demandas.*', 'tipo_servico.nome as tipo_nome', 'usuario.nome as cliente_nome')
  .leftJoin('tipo_servico', 'demandas.tipo_servico_id', 'tipo_servico.id')
  .leftJoin('usuario', 'demandas.cliente_id', 'usuario.id')
  .where("status_servico", "CONCLUÍDO")
  .orWhere("status_servico", "CANCELADO");
  return res.json(entregas);
};

export const listarEntregas = index;