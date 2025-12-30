-- Sample data for FooballWebpage database
USE FooballWebpage;
GO

-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (name, username, [user], password, role) VALUES
('Admin User', 'admin', 'admin', '$2b$10$YQpFdx7qJZGKjxvN7XwHcOKTxP1AzLm8yLHx5LKZvGxQgVPXqWGKW', 'admin'),
('Editor User', 'editor', 'editor', '$2b$10$YQpFdx7qJZGKjxvN7XwHcOKTxP1AzLm8yLHx5LKZvGxQgVPXqWGKW', 'editor'),
('Viewer User', 'viewer', 'viewer', '$2b$10$YQpFdx7qJZGKjxvN7XwHcOKTxP1AzLm8yLHx5LKZvGxQgVPXqWGKW', 'viewer');
GO

-- Insert sample sponsors
INSERT INTO sponsors (name, url, imageUrl, importance) VALUES
('Sponsor A', 'https://www.sponsora.com', 'https://via.placeholder.com/200x100?text=Sponsor+A', 1),
('Sponsor B', 'https://www.sponsorb.com', 'https://via.placeholder.com/200x100?text=Sponsor+B', 2),
('Sponsor C', 'https://www.sponsorc.com', 'https://via.placeholder.com/200x100?text=Sponsor+C', 3);
GO

-- Insert sample teams
INSERT INTO teams (name, categoryId, categoryName, genreId, genreName) VALUES
('Equipo A', 1, 'Senior', 1, 'Masculino'),
('Equipo B', 2, 'Juvenil', 1, 'Masculino'),
('Equipo C', 1, 'Senior', 2, 'Femenino');
GO

-- Insert sample players (matching the actual schema: name, lastname, position_id, position_name, team_id, team_name, genre_id, genre_name, picture, birthdate, bornCity)
INSERT INTO players (name, lastname, position_id, position_name, team_id, team_name, genre_id, genre_name, picture, birthdate, bornCity) VALUES
('Juan', 'Pérez', 1, 'Delantero', 1, 'Equipo A', 1, 'Masculino', 'https://via.placeholder.com/150?text=Juan+Perez', '1995-03-15', 'Madrid'),
('Carlos', 'González', 2, 'Portero', 1, 'Equipo A', 1, 'Masculino', 'https://via.placeholder.com/150?text=Carlos+Gonzalez', '1998-07-22', 'Barcelona'),
('María', 'López', 3, 'Defensa', 3, 'Equipo C', 2, 'Femenino', 'https://via.placeholder.com/150?text=Maria+Lopez', '1997-11-08', 'Valencia'),
('Ana', 'Martínez', 4, 'Centrocampista', 3, 'Equipo C', 2, 'Femenino', 'https://via.placeholder.com/150?text=Ana+Martinez', '1999-02-14', 'Sevilla'),
('Pedro', 'Sánchez', 1, 'Delantero', 2, 'Equipo B', 1, 'Masculino', 'https://via.placeholder.com/150?text=Pedro+Sanchez', '2003-05-30', 'Bilbao');
GO

-- Insert sample direction
INSERT INTO direction (name, lastname, position, startDate, imageUrl) VALUES
('Roberto', 'García', 'Director Técnico', '2023-01-15', 'https://via.placeholder.com/150?text=Roberto+Garcia'),
('Laura', 'Fernández', 'Secretaria General', '2022-06-01', 'https://via.placeholder.com/150?text=Laura+Fernandez');
GO

-- Insert sample blog entries
DECLARE @adminId INT;
SELECT @adminId = id FROM users WHERE username = 'admin';

INSERT INTO blog_entries (userId, title, content, resource, visible, date_create) VALUES
(@adminId, 'Primera entrada del blog', 'Este es el contenido de la primera entrada del blog de nuestro club.', 'https://via.placeholder.com/600x400?text=Blog+Image+1', 1, GETDATE()),
(@adminId, 'Victoria en el último partido', 'Nuestro equipo ganó 3-1 en un emocionante partido.', 'https://via.placeholder.com/600x400?text=Blog+Image+2', 1, DATEADD(day, -1, GETDATE())),
(@adminId, 'Nuevos fichajes', 'Anunciamos la llegada de tres nuevos jugadores al club.', 'https://via.placeholder.com/600x400?text=Blog+Image+3', 1, DATEADD(day, -3, GETDATE()));
GO

PRINT 'Sample data inserted successfully.';
GO
