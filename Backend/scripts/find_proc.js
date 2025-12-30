import mssql from 'mssql';

const config = {
  server: 'localhost',
  port: 19000,
  user: 'sa',
  password: '5drosUj*',
  database: 'master',
  options: { trustServerCertificate: true }
};

(async () => {
  try {
    const pool = await mssql.connect(config);
    const dbs = await pool.request().query("SELECT name FROM sys.databases WHERE state = 0");
    for (const row of dbs.recordset) {
      const db = row.name;
      try {
        const q = await pool.request().query(`SELECT name FROM [${db}].sys.procedures WHERE name = 'teams_select'`);
        if (q.recordset.length > 0) {
          console.log('Found in DB:', db, q.recordset);
        }
      } catch (e) {
        // skip
      }
    }
    await pool.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();