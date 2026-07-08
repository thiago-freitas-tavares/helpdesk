import 'dotenv/config'; // permite que o backend enxergue as variáveis do .env
import 'reflect-metadata'; // para poder usar os decorators
import { DataSource } from 'typeorm'; // para configurar e conectar com o banco

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

// checa se as variáveis de ambiente não são undefined, pois o typeORM espera uma string
if (!dbHost) throw new Error('DB_HOST is not defined');
if (!dbPort) throw new Error('DB_PORT is not defined');
if (!dbUsername) throw new Error('DB_USERNAME is not defined');
if (!dbPassword) throw new Error('DB_PASSWORD is not defined');
if (!dbDatabase) throw new Error('DB_DATABASE is not defined');

if (Number.isNaN(Number(dbPort))) throw new Error('DB_PORT must be a valid number');

// export torna o AppDataSource disponível para o resto do backend
export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: dbHost,
  port: Number(dbPort),
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
});
