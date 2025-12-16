import knex from "knex";

export const db = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "senacrs",
    database: "rsti_final",
  },
});
