import pg from 'pg';

const { Pool } = pg;

const db = new Pool({
  user: 'postgres',       // Ex: postgres
  host: 'localhost',
  database: 'Votacao',
  password: 'admin',
  port: 5432,
});

export default db;
