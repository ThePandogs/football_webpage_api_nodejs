import fs from 'fs';
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
    const sql = fs.readFileSync('db/sqlserver/sample_data.sql', 'utf8');
    const batches = sql.split(/^\s*GO\s*$/gim).map(s => s.trim()).filter(Boolean);
    const pool = await mssql.connect(config);
    for (const b of batches) {
      console.log('Running batch...');
      try {
        await pool.request().batch(b);
      } catch (err) {
        console.error('Batch error:', err.message);
      }
    }
    await pool.close();
    console.log('Sample data loaded successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();