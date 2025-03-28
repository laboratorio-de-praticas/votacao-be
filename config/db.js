import pg from "pg";

// Simulação de conexão com o banco
export const Pool = new pg.Pool({
  user: "seu_usuario",
  host: "localhost",
  database: "seu_banco",
  password: "sua_senha",
  port: 5432, 
});
