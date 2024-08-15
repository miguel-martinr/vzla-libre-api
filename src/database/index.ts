import knex, { Knex } from "knex";

let dbConnection: Knex | null = null;

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error("Missing environment variables for database connection");
}

const buildConnection = () => knex({
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
});


export const getDbConnection = async () => {
  if (!dbConnection) dbConnection = buildConnection();
  return dbConnection;
}