import fs from 'fs';
import mssql from 'mssql';

const config = {
  server: 'localhost',
  port: 19000,
  user: 'sa',
  password: '5drosUj*',
  database: process.env.TARGET_DB || 'master',
  options: { trustServerCertificate: true }
};

(async () => {
  try {
    const sql = fs.readFileSync('db/sqlserver/init.sql', 'utf8');
    const batches = sql.split(/^\s*GO\s*$/gim).map(s => s.trim()).filter(Boolean);
    const pool = await mssql.connect(config);
    for (const b of batches) {
      console.log('Running batch (first 120 chars):', b.slice(0,120).replace(/\n/g,' '));
      try {
        await pool.request().batch(b);
      } catch (err) {
        console.error('Batch error:', err.message);
        // continue on error to attempt to create other objects
      }
    }
    await pool.close();
    console.log('Done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();