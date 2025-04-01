// models/VotoPublicoConvidado.js
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  // Configurações do seu banco PostgreSQL
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco',
  password: 'sua_senha',
  port: 5432,
});

export const registrarVotoConvidado = async (votoData) => {
  const { nome_social, celular, data_nascimento, chave_acesso, voto } = votoData;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Verificar se o convidado existe
    const visitanteRes = await client.query(
      'SELECT id_visitante FROM Visitantes WHERE nome_social = $1 AND celular = $2 AND chave_acesso = $3',
      [nome_social, celular, chave_acesso]
    );
    
    if (visitanteRes.rows.length === 0) {
      throw new Error('Convidado não encontrado ou chave de acesso inválida');
    }
    
    const id_visitante = visitanteRes.rows[0].id_visitante;
    
    // Registrar o voto
    await client.query(
      'INSERT INTO Votos_Convidados (id_visitante, voto, data_voto) VALUES ($1, $2, NOW())',
      [id_visitante, voto]
    );
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};