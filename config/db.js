import pg from 'pg'
const { Pool } = pg

// Realizando a conexão com o banco de dados
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Votacao',
  password: 'admin',
  port: 5432,
})

export default pool
