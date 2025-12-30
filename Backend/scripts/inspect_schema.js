import mssql from 'mssql';

const config = {
  server: 'localhost',
  port: 19000,
  user: 'sa',
  password: '5drosUj*',
  database: 'FooballWebpage',
  options: { trustServerCertificate: true }
};

(async () => {
  try {
    const pool = await mssql.connect(config);
    const tables = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'");
    console.log('Tables:', tables.recordset.map(r=>r.TABLE_NAME));
    for (const t of tables.recordset) {
      const cols = await pool.request().query(`SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${t.TABLE_NAME}'`);
      console.log('\nTable', t.TABLE_NAME, cols.recordset);
    }
    await pool.close();
  } catch (err) {
    console.error(err);
  }
})();