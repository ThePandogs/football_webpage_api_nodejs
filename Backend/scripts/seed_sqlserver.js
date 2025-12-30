import mssql from 'mssql';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

const cfg = {
  server: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: { trustServerCertificate: true }
};

(async () => {
  console.log('Connecting to', cfg.server, cfg.port, cfg.database);
  const pool = await mssql.connect(cfg);

  try {
    // Add compatibility columns to users if missing
    console.log('Ensuring users table has username and [user] columns...');
    await pool.request().query(`IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'username') ALTER TABLE users ADD username NVARCHAR(200) NULL;`);
    await pool.request().query(`IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'user') ALTER TABLE users ADD [user] NVARCHAR(200) NULL;`);
    await pool.request().query(`UPDATE users SET username = ISNULL(username, email), [user] = ISNULL([user], email) WHERE (username IS NULL OR [user] IS NULL);`);

    // Insert sample teams
    console.log('Inserting sample teams...');
    await pool.request().query(`INSERT INTO teams (name, categoryName, genreName) VALUES
      ('Lions FC', 'Senior', 'Male'),
      ('Tigers FC', 'Senior', 'Female'),
      ('Eagles Juniors', 'Junior', 'Male');`);

    // Insert sample players
    console.log('Inserting sample players...');
    await pool.request().query(`INSERT INTO players (name, position, dorsal, status) VALUES
      ('John Doe', 'Forward', 9, 'active'),
      ('Jane Smith', 'Midfield', 8, 'active'),
      ('Bob Brown', 'Defense', 4, 'injured');`);

    // Insert direction entries
    console.log('Inserting sample direction...');
    await pool.request().query(`INSERT INTO direction (name, lastname, position, startDate, imageUrl) VALUES
      ('Alice','Johnson','Head Coach','2020-08-01',NULL),
      ('Mark','Davis','Physio','2021-01-15',NULL);`);

    // Insert sponsors
    console.log('Inserting sample sponsors...');
    await pool.request().query(`INSERT INTO sponsors (name, url, imageUrl, importance) VALUES
      ('Acme Corp','https://acme.example','/images/acme.png',1),
      ('Sportify','https://sportify.example','/images/sportify.png',2);`);

    // Create admin user with bcrypt password
    const adminPassword = 'admin123';
    const hash = await bcrypt.hash(adminPassword, 10);
    console.log('Creating admin user (username: admin, password: admin123)');

    await pool.request()
      .input('name', mssql.NVarChar, 'Administrator')
      .input('email', mssql.NVarChar, 'admin@example.com')
      .input('username', mssql.NVarChar, 'admin')
      .input('user', mssql.NVarChar, 'admin')
      .input('password', mssql.NVarChar, hash)
      .input('role', mssql.NVarChar, 'admin')
      .query(`IF NOT EXISTS (SELECT 1 FROM users WHERE email = @email OR username = @username)
        INSERT INTO users (name, email, username, [user], password, role, created_at)
        VALUES (@name, @email, @username, @user, @password, @role, GETDATE());`);

    // Get admin id
    const admin = await pool.request().input('email', mssql.NVarChar, 'admin@example.com').query('SELECT id FROM users WHERE email = @email');
    const adminId = admin.recordset.length ? admin.recordset[0].id : null;

    // Insert sample blog entries
    console.log('Inserting sample blog entries...');
    if (adminId) {
      await pool.request().input('adminId', mssql.Int, adminId).query(`INSERT INTO blog_entries (userId, title, content, resource, visible, date_create)
        VALUES (@adminId, 'Welcome', 'Welcome to the Sports Manager API', NULL, 1, GETDATE());`);
    }

    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.close();
  }
})();