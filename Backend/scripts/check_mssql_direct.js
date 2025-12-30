import mssql from 'mssql';

const config = {
  server: 'localhost',
  port: 19000,
  user: 'sa',
  password: '5drosUj*',
  database: 'SportsManager',
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
  console.log('Trying connection to SQL Server with:', { server: config.server, port: config.port, user: config.user, database: config.database });
  try {
    const pool = await mssql.connect(config);
    const res1 = await pool.request().query('SELECT 1 AS val');
    console.log('SELECT 1 result:', res1.recordset);

    // Check the database exists
    const res2 = await pool.request().query("SELECT name FROM sys.databases WHERE name = 'SportsManager'");
    console.log('Database check:', res2.recordset.length ? res2.recordset[0] : 'Not found');

    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
})();