import mssql from 'mssql';

const config = {
  server: 'localhost',
  port: 19000,
  user: 'sa',
  password: '5drosUj*',
  database: 'SportsManager',
  options: { trustServerCertificate: true }
};

(async () => {
  try {
    const pool = await mssql.connect(config);
    const procName = 'teams_select';

    const q1 = await pool.request().query(`SELECT OBJECT_SCHEMA_NAME(object_id) AS schema_name, OBJECT_NAME(object_id) AS proc_name, object_id FROM sys.procedures WHERE name = '${procName}'`);
    console.log('Procedures found:', q1.recordset);

    const q2 = await pool.request().query(`SELECT p.name, p.parameter_id, t.name AS type_name FROM sys.parameters p JOIN sys.types t ON p.user_type_id = t.user_type_id WHERE p.object_id = OBJECT_ID('${q1.recordset[0].schema_name}.${procName}') ORDER BY p.parameter_id`);
    console.log('Parameters:', q2.recordset);

    await pool.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();