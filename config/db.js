import pg from 'pg'
const { Pool } = pg

// Simulação de conexão com o banco
const pool = new Pool({
  user: "PostgreSQL 17",
  host: "localhost",
  database: "postgres",
  password: "admin",
  port: 5432, 
})

export default pool