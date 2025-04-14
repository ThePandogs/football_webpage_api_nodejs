
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';

config();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,   
  connectionLimit: 10,       
  queueLimit: 0             
});

export const query = async (sql, params) => {
  const connection = await pool.getConnection(); 

  try {
    const [results] = await connection.query(sql, params); 
    return results;
  } catch (error) {
    console.error('Query Error:', error);
    throw error;
  } finally {
    connection.release(); 
  }
};

