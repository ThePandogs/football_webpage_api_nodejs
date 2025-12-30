import mssql from 'mssql';
import bcrypt from 'bcrypt';

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
    console.log('Connected to SQL Server. Inserting sample data...\n');

    // Insert sample users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@football.com')
      INSERT INTO users (name, email, password, role, created_at)
      VALUES ('Admin User', 'admin@football.com', '${hashedPassword}', 'admin', GETDATE())
    `);
    console.log('✓ User inserted');

    // Insert sample teams
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM teams WHERE name = 'Equipo A')
      INSERT INTO teams (name, categoryId, categoryName, genreId, genreName)
      VALUES 
        ('Equipo A', 1, 'Senior', 1, 'Masculino'),
        ('Equipo B', 2, 'Junior', 1, 'Masculino'),
        ('Equipo C', 1, 'Senior', 2, 'Femenino')
    `);
    console.log('✓ Teams inserted');

    // Insert sample players
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM players WHERE name = 'Juan')
      INSERT INTO players (name, position, dorsal, status)
      VALUES 
        ('Juan Pérez', 'Delantero', 9, 'active'),
        ('María García', 'Defensa', 4, 'active'),
        ('Carlos López', 'Portero', 1, 'active'),
        ('Ana Martínez', 'Centrocampista', 8, 'active')
    `);
    console.log('✓ Players inserted');

    // Insert sample direction
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM direction WHERE name = 'Roberto')
      INSERT INTO direction (name, lastname, position, startDate, imageUrl)
      VALUES 
        ('Roberto', 'Fernández', 'Director Técnico', '2024-01-01', 'https://via.placeholder.com/150'),
        ('Laura', 'Sánchez', 'Entrenadora Principal', '2024-06-01', 'https://via.placeholder.com/150')
    `);
    console.log('✓ Direction inserted');

    // Insert sample sponsors
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM sponsors WHERE name = 'Sponsor A')
      INSERT INTO sponsors (name, url, imageUrl, importance)
      VALUES 
        ('Sponsor A', 'https://www.sponsora.com', 'https://via.placeholder.com/200', 1),
        ('Sponsor B', 'https://www.sponsorb.com', 'https://via.placeholder.com/200', 2),
        ('Sponsor C', 'https://www.sponsorc.com', 'https://via.placeholder.com/200', 3)
    `);
    console.log('✓ Sponsors inserted');

    // Insert sample blog entries
    const userResult = await pool.request().query("SELECT id FROM users WHERE email = 'admin@football.com'");
    const userId = userResult.recordset[0]?.id;
    
    if (userId) {
      await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM blog_entries WHERE title = 'Bienvenida')
        INSERT INTO blog_entries (userId, title, content, resource, visible, date_create)
        VALUES 
          (${userId}, 'Bienvenida', 'Este es el primer post del blog de fútbol', NULL, 1, GETDATE()),
          (${userId}, 'Próximo partido', 'Información sobre el próximo encuentro', NULL, 1, GETDATE())
      `);
      console.log('✓ Blog entries inserted');
    }

    await pool.close();
    console.log('\n✅ Sample data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting sample data:', err);
    process.exit(1);
  }
})();