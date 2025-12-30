import mssql from 'mssql';
import { config } from 'dotenv';

config();

const sqlConfig = {
  server: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

(async () => {
  console.log('Attempting MSSQL connection with config:', {
    server: sqlConfig.server,
    port: sqlConfig.port,
    user: sqlConfig.user,
    database: sqlConfig.database
  });

  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool.request().query('SELECT 1 AS val');
    console.log('Query result:', result.recordset);
    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exit(1);
  }
})();