
import { createPool } from 'mysql2/promise';
import mssql from 'mssql';
import { config } from 'dotenv';

config();

const DB_TYPE = (process.env.DB_TYPE || 'mysql').toLowerCase();

let mysqlPool = null;
let mssqlPool = null;

if (DB_TYPE === 'mysql') {
  mysqlPool = createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

if (DB_TYPE === 'sqlserver') {
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
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };
  mssqlPool = new mssql.ConnectionPool(sqlConfig);
  mssqlPool.connect().catch(err => {
    console.error('MSSQL pool connection error:', err);
  });
}

// Unified query function supporting both MySQL (mysql2) and SQL Server (mssql).
// Supports promise API and callback style used in some models (e.g., blogEntries.select)
export const query = async (sql, params = [], callback) => {
  if (typeof params === 'function') {
    callback = params;
    params = [];
  }

  if (DB_TYPE === 'sqlserver') {
    try {
      console.log('🔵 SQL Server query starting:', sql.substring(0, 100));
      console.log('🔵 Params:', params);
      
      if (!mssqlPool || !mssqlPool.connected) {
        console.log('🔵 Connecting to SQL Server pool...');
        await mssqlPool.connect();
        console.log('✅ SQL Server pool connected');
      }

      const request = mssqlPool.request();
      const sqlTrim = (sql || '').trim();

      // Handle stored procedure calls written as: CALL proc_name(?, ?, ?)
      const callMatch = sqlTrim.match(/^CALL\s+([^(\s]+)\s*\((.*)\)\s*;?$/i);
      if (callMatch) {
        const procName = callMatch[1];
        
        // Discover the stored procedure parameter names from SQL Server metadata
        try {
          const paramQuery = `
            SELECT p.name, p.parameter_id 
            FROM sys.parameters p 
            WHERE p.object_id = OBJECT_ID(?)
            ORDER BY p.parameter_id
          `;
          const paramInfoRequest = mssqlPool.request();
          paramInfoRequest.input('procName', `dbo.${procName}`);
          const paramInfo = await paramInfoRequest.query(paramQuery);
          const paramNames = (paramInfo.recordset || []).map(r => r.name.replace(/^@/, ''));

          if (paramNames.length > 0 && paramNames.length >= params.length) {
            // Bind each provided param to the corresponding procedure parameter name
            params.forEach((p, i) => {
              request.input(paramNames[i], p);
            });
            const result = await request.execute(procName);
            const out = [result.recordset || []];
            if (callback) return callback(null, out);
            return out;
          }
        } catch (e) {
          console.warn('Could not discover proc parameters for', procName, ':', e.message);
        }

        // Fallback: if proc discovery failed, assume proc doesn't exist and throw clear error
        throw new Error(`Stored procedure ${procName} not found or parameter discovery failed. Consider using direct SQL queries instead of CALL statements.`);
      }

      // Replace positional '?' with named parameters @p1, @p2, ... and bind them
      let i = 0;
      const newSql = sql.replace(/\?/g, () => {
        i += 1;
        return `@p${i}`;
      });

      params.forEach((p, idx) => request.input(`p${idx + 1}`, p));
      
      console.log('🔵 Executing SQL:', newSql);
      const result = await request.query(newSql);
      console.log('✅ SQL Server query completed, rows:', result.recordset?.length || 0);
      
      const out = result.recordset || [];
      if (callback) return callback(null, out);
      return out;
    } catch (err) {
      console.error('❌ SQL Server Query Error:', err.message);
      console.error(err.stack);
      if (callback) return callback(err);
      throw err;
    }
  }

  // Default: MySQL
  const connection = await mysqlPool.getConnection();
  try {
    if (callback) {
      connection.query(sql, params, (err, results) => {
        connection.release();
        return callback(err, results);
      });
      return;
    }

    const [results] = await connection.query(sql, params);
    return results;
  } catch (error) {
    console.error('Query Error:', error);
    throw error;
  } finally {
    if (!callback) connection.release();
  }
};

// Helper to extract insert id from different DB result shapes
export const extractInsertId = (results) => {
  if (!results) return null;
  // MySQL style: results.insertId
  if (typeof results.insertId === 'number') return results.insertId;
  // Some mysql drivers return [result] or [{ insertId: ... }]
  if (Array.isArray(results) && results.length > 0) {
    const first = results[0];
    if (first && (first.insertId !== undefined)) return first.insertId;
    if (first && (first.id !== undefined)) return first.id;
  }
  // Fallback
  return null;
};

