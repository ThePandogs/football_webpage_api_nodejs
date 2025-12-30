-- MySQL initialization script for football_webpage_api_nodejs
-- Creates tables and stored procedures expected by the app
-- Run with: mysql -u root -p < db/mysql/init.sql

CREATE DATABASE IF NOT EXISTS football_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE football_db;

-- USERS table (note: we keep both username and `user` columns for compatibility)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NULL,
  username VARCHAR(200) NOT NULL UNIQUE,
  `user` VARCHAR(200) NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB;

-- SPONSORS
CREATE TABLE IF NOT EXISTS sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  url VARCHAR(500) NULL,
  imageUrl VARCHAR(500) NULL,
  importance INT NULL
) ENGINE=InnoDB;

-- TEAMS
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  categoryId INT NULL,
  categoryName VARCHAR(200) NULL,
  genreId INT NULL,
  genreName VARCHAR(200) NULL
) ENGINE=InnoDB;

-- PLAYERS
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  lastname VARCHAR(150) NOT NULL,
  position_id INT NULL,
  position_name VARCHAR(150) NULL,
  team_id INT NULL,
  team_name VARCHAR(200) NULL,
  genre_id INT NULL,
  genre_name VARCHAR(150) NULL,
  picture VARCHAR(500) NULL,
  birthdate DATE NULL,
  bornCity VARCHAR(200) NULL
) ENGINE=InnoDB;

-- DIRECTION
CREATE TABLE IF NOT EXISTS `direction` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  lastname VARCHAR(150) NOT NULL,
  position VARCHAR(200) NULL,
  startDate DATE NULL,
  imageUrl VARCHAR(500) NULL
) ENGINE=InnoDB;

-- BLOG ENTRIES
CREATE TABLE IF NOT EXISTS blog_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NULL,
  title VARCHAR(300) NOT NULL,
  content LONGTEXT NULL,
  resource VARCHAR(500) NULL,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Stored procedures
DELIMITER $$

-- Teams: select
DROP PROCEDURE IF EXISTS teams_select$$
CREATE PROCEDURE teams_select(
  IN p_id INT,
  IN p_name VARCHAR(200),
  IN p_category VARCHAR(200),
  IN p_genre VARCHAR(200),
  IN p_offset INT,
  IN p_limit INT
)
BEGIN
  SET p_offset = IFNULL(p_offset, 0);
  SET p_limit = IFNULL(p_limit, 500);
  SELECT * FROM teams t
  WHERE (p_id IS NULL OR t.id = p_id)
    AND (p_name IS NULL OR t.name LIKE CONCAT('%', p_name, '%'))
    AND (p_category IS NULL OR t.categoryName LIKE CONCAT('%', p_category, '%'))
    AND (p_genre IS NULL OR t.genreName LIKE CONCAT('%', p_genre, '%'))
  LIMIT p_offset, p_limit;
END$$

-- Teams: insert
DROP PROCEDURE IF EXISTS teams_insert$$
CREATE PROCEDURE teams_insert(
  IN p_name VARCHAR(200),
  IN p_category VARCHAR(200),
  IN p_genre VARCHAR(200)
)
BEGIN
  INSERT INTO teams (name, categoryName, genreName) VALUES (p_name, p_category, p_genre);
  SELECT LAST_INSERT_ID() AS insertId;
END$$

-- Teams: update
DROP PROCEDURE IF EXISTS teams_update$$
CREATE PROCEDURE teams_update(
  IN p_id INT,
  IN p_name VARCHAR(200),
  IN p_categoryId INT,
  IN p_categoryName VARCHAR(200),
  IN p_genreId INT,
  IN p_genreName VARCHAR(200)
)
BEGIN
  UPDATE teams SET
    name = COALESCE(p_name, name),
    categoryId = COALESCE(p_categoryId, categoryId),
    categoryName = COALESCE(p_categoryName, categoryName),
    genreId = COALESCE(p_genreId, genreId),
    genreName = COALESCE(p_genreName, genreName)
  WHERE id = p_id;
END$$

-- Teams: delete
DROP PROCEDURE IF EXISTS teams_delete$$
CREATE PROCEDURE teams_delete(
  IN p_id INT,
  IN p_name VARCHAR(200),
  IN p_categoryId INT,
  IN p_categoryName VARCHAR(200),
  IN p_genreId INT,
  IN p_genreName VARCHAR(200)
)
BEGIN
  DELETE FROM teams
  WHERE (p_id IS NULL OR id = p_id)
    AND (p_name IS NULL OR name = p_name)
    AND (p_categoryId IS NULL OR categoryId = p_categoryId)
    AND (p_categoryName IS NULL OR categoryName = p_categoryName)
    AND (p_genreId IS NULL OR genreId = p_genreId)
    AND (p_genreName IS NULL OR genreName = p_genreName);
END$$

-- Players: select
DROP PROCEDURE IF EXISTS players_select$$
CREATE PROCEDURE players_select(
  IN p_id INT,
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position_id INT,
  IN p_position_name VARCHAR(150),
  IN p_team_id INT,
  IN p_team_name VARCHAR(200),
  IN p_genre_id INT,
  IN p_genre_name VARCHAR(150),
  IN p_birthdate DATE,
  IN p_bornCity VARCHAR(200),
  IN p_offset INT,
  IN p_limit INT
)
BEGIN
  SET p_offset = IFNULL(p_offset, 0);
  SET p_limit = IFNULL(p_limit, 500);
  SELECT * FROM players p
  WHERE (p_id IS NULL OR p.id = p_id)
    AND (p_name IS NULL OR p.name LIKE CONCAT('%', p_name, '%'))
    AND (p_lastname IS NULL OR p.lastname LIKE CONCAT('%', p_lastname, '%'))
    AND (p_position_id IS NULL OR p.position_id = p_position_id)
    AND (p_position_name IS NULL OR p.position_name LIKE CONCAT('%', p_position_name, '%'))
    AND (p_team_id IS NULL OR p.team_id = p_team_id)
    AND (p_team_name IS NULL OR p.team_name LIKE CONCAT('%', p_team_name, '%'))
    AND (p_genre_id IS NULL OR p.genre_id = p_genre_id)
    AND (p_genre_name IS NULL OR p.genre_name LIKE CONCAT('%', p_genre_name, '%'))
    AND (p_birthdate IS NULL OR p.birthdate = p_birthdate)
    AND (p_bornCity IS NULL OR p.bornCity LIKE CONCAT('%', p_bornCity, '%'))
  LIMIT p_offset, p_limit;
END$$

-- Players: insert
DROP PROCEDURE IF EXISTS players_insert$$
CREATE PROCEDURE players_insert(
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position_id INT,
  IN p_position_name VARCHAR(150),
  IN p_team_id INT,
  IN p_team_name VARCHAR(200),
  IN p_genre_id INT,
  IN p_genre_name VARCHAR(150),
  IN p_picture VARCHAR(500),
  IN p_birthdate DATE,
  IN p_bornCity VARCHAR(200)
)
BEGIN
  INSERT INTO players (name, lastname, position_id, position_name, team_id, team_name, genre_id, genre_name, picture, birthdate, bornCity)
  VALUES (p_name, p_lastname, p_position_id, p_position_name, p_team_id, p_team_name, p_genre_id, p_genre_name, p_picture, p_birthdate, p_bornCity);
  SELECT LAST_INSERT_ID() AS insertId;
END$$

-- Players: update
DROP PROCEDURE IF EXISTS players_update$$
CREATE PROCEDURE players_update(
  IN p_id INT,
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position_id INT,
  IN p_position_name VARCHAR(150),
  IN p_team_id INT,
  IN p_team_name VARCHAR(200),
  IN p_genre_id INT,
  IN p_genre_name VARCHAR(150),
  IN p_picture VARCHAR(500),
  IN p_birthdate DATE,
  IN p_bornCity VARCHAR(200)
)
BEGIN
  UPDATE players SET
    name = COALESCE(p_name, name),
    lastname = COALESCE(p_lastname, lastname),
    position_id = COALESCE(p_position_id, position_id),
    position_name = COALESCE(p_position_name, position_name),
    team_id = COALESCE(p_team_id, team_id),
    team_name = COALESCE(p_team_name, team_name),
    genre_id = COALESCE(p_genre_id, genre_id),
    genre_name = COALESCE(p_genre_name, genre_name),
    picture = COALESCE(p_picture, picture),
    birthdate = COALESCE(p_birthdate, birthdate),
    bornCity = COALESCE(p_bornCity, bornCity)
  WHERE id = p_id;
END$$

-- Players: delete
DROP PROCEDURE IF EXISTS players_delete$$
CREATE PROCEDURE players_delete(
  IN p_id INT,
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position_id INT,
  IN p_position_name VARCHAR(150),
  IN p_team_id INT,
  IN p_team_name VARCHAR(200),
  IN p_genre_id INT,
  IN p_genre_name VARCHAR(150),
  IN p_birthdate DATE,
  IN p_bornCity VARCHAR(200)
)
BEGIN
  DELETE FROM players
  WHERE (p_id IS NULL OR id = p_id)
    AND (p_name IS NULL OR name = p_name)
    AND (p_lastname IS NULL OR lastname = p_lastname)
    AND (p_position_id IS NULL OR position_id = p_position_id)
    AND (p_position_name IS NULL OR position_name = p_position_name)
    AND (p_team_id IS NULL OR team_id = p_team_id)
    AND (p_team_name IS NULL OR team_name = p_team_name)
    AND (p_genre_id IS NULL OR genre_id = p_genre_id)
    AND (p_genre_name IS NULL OR genre_name = p_genre_name)
    AND (p_birthdate IS NULL OR birthdate = p_birthdate)
    AND (p_bornCity IS NULL OR bornCity = p_bornCity);
END$$

-- Direction: select
DROP PROCEDURE IF EXISTS direction_select$$
CREATE PROCEDURE direction_select(
  IN p_id INT,
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position VARCHAR(200),
  IN p_startDate DATE,
  IN p_imageUrl VARCHAR(500),
  IN p_offset INT,
  IN p_limit INT
)
BEGIN
  SET p_offset = IFNULL(p_offset, 0);
  SET p_limit = IFNULL(p_limit, 500);
  SELECT * FROM `direction` d
  WHERE (p_id IS NULL OR d.id = p_id)
    AND (p_name IS NULL OR d.name LIKE CONCAT('%', p_name, '%'))
    AND (p_lastname IS NULL OR d.lastname LIKE CONCAT('%', p_lastname, '%'))
    AND (p_position IS NULL OR d.position LIKE CONCAT('%', p_position, '%'))
    AND (p_startDate IS NULL OR d.startDate = p_startDate)
    AND (p_imageUrl IS NULL OR d.imageUrl LIKE CONCAT('%', p_imageUrl, '%'))
  LIMIT p_offset, p_limit;
END$$

-- Direction: insert
DROP PROCEDURE IF EXISTS direction_insert$$
CREATE PROCEDURE direction_insert(
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position VARCHAR(200),
  IN p_startDate DATE,
  IN p_imageUrl VARCHAR(500)
)
BEGIN
  INSERT INTO `direction` (name, lastname, position, startDate, imageUrl)
  VALUES (p_name, p_lastname, p_position, p_startDate, p_imageUrl);
  SELECT LAST_INSERT_ID() AS insertId;
END$$

-- Direction: update
DROP PROCEDURE IF EXISTS direction_update$$
CREATE PROCEDURE direction_update(
  IN p_id INT,
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position VARCHAR(200),
  IN p_startDate DATE,
  IN p_imageUrl VARCHAR(500)
)
BEGIN
  UPDATE `direction` SET
    name = COALESCE(p_name, name),
    lastname = COALESCE(p_lastname, lastname),
    position = COALESCE(p_position, position),
    startDate = COALESCE(p_startDate, startDate),
    imageUrl = COALESCE(p_imageUrl, imageUrl)
  WHERE id = p_id;
END$$

-- Direction: delete
DROP PROCEDURE IF EXISTS direction_delete$$
CREATE PROCEDURE direction_delete(
  IN p_id INT,
  IN p_name VARCHAR(150),
  IN p_lastname VARCHAR(150),
  IN p_position VARCHAR(200),
  IN p_startDate DATE,
  IN p_imageUrl VARCHAR(500)
)
BEGIN
  DELETE FROM `direction`
  WHERE (p_id IS NULL OR id = p_id)
    AND (p_name IS NULL OR name = p_name)
    AND (p_lastname IS NULL OR lastname = p_lastname)
    AND (p_position IS NULL OR position = p_position)
    AND (p_startDate IS NULL OR startDate = p_startDate)
    AND (p_imageUrl IS NULL OR imageUrl = p_imageUrl);
END$$

-- Blog entries: select
DROP PROCEDURE IF EXISTS blog_entries_select$$
CREATE PROCEDURE blog_entries_select(
  IN p_id INT,
  IN p_user VARCHAR(200),
  IN p_title VARCHAR(300),
  IN p_content LONGTEXT,
  IN p_resource VARCHAR(500),
  IN p_visible INT,
  IN p_date_create DATETIME,
  IN p_offset INT,
  IN p_limite INT
)
BEGIN
  SET p_offset = IFNULL(p_offset, 0);
  SET p_limite = IFNULL(p_limite, 100);
  SELECT b.*, u.username FROM blog_entries b
  LEFT JOIN users u ON b.userId = u.id
  WHERE (p_id IS NULL OR b.id = p_id)
    AND (p_user IS NULL OR u.username = p_user)
    AND (p_title IS NULL OR b.title LIKE CONCAT('%', p_title, '%'))
    AND (p_content IS NULL OR b.content LIKE CONCAT('%', p_content, '%'))
    AND (p_resource IS NULL OR b.resource LIKE CONCAT('%', p_resource, '%'))
    AND (p_visible IS NULL OR b.visible = p_visible)
    AND (p_date_create IS NULL OR DATE(b.date_create) = DATE(p_date_create))
  LIMIT p_offset, p_limite;
END$$

-- Blog entries: insert
DROP PROCEDURE IF EXISTS blog_entries_insert$$
CREATE PROCEDURE blog_entries_insert(
  IN p_user VARCHAR(200),
  IN p_title VARCHAR(300),
  IN p_content LONGTEXT,
  IN p_resource VARCHAR(500),
  IN p_visible TINYINT(1)
)
BEGIN
  DECLARE v_userId INT;
  SELECT id INTO v_userId FROM users WHERE username = p_user OR `user` = p_user LIMIT 1;
  INSERT INTO blog_entries (userId, title, content, resource, visible)
  VALUES (v_userId, p_title, p_content, p_resource, p_visible);
  SELECT LAST_INSERT_ID() AS insertId;
END$$

-- Blog entries: update
DROP PROCEDURE IF EXISTS blog_entries_update$$
CREATE PROCEDURE blog_entries_update(
  IN p_id INT,
  IN p_user VARCHAR(200),
  IN p_title VARCHAR(300),
  IN p_content LONGTEXT,
  IN p_resource VARCHAR(500),
  IN p_visible TINYINT(1)
)
BEGIN
  DECLARE v_userId INT;
  IF p_user IS NOT NULL THEN
    SELECT id INTO v_userId FROM users WHERE username = p_user OR `user` = p_user LIMIT 1;
  ELSE
    SET v_userId = NULL;
  END IF;
  UPDATE blog_entries
  SET userId = COALESCE(v_userId, userId),
      title = COALESCE(p_title, title),
      content = COALESCE(p_content, content),
      resource = COALESCE(p_resource, resource),
      visible = COALESCE(p_visible, visible)
  WHERE id = p_id;
END$$

-- Blog entries: delete
DROP PROCEDURE IF EXISTS blog_entries_delete$$
CREATE PROCEDURE blog_entries_delete(IN p_id INT)
BEGIN
  DELETE FROM blog_entries WHERE id = p_id;
END$$

DELIMITER ;

-- Optional sample admin user (password placeholder, replace with bcrypt hash)
INSERT IGNORE INTO users (name, username, `user`, password, role)
VALUES ('Administrator', 'admin', 'admin', 'CHANGE_ME', 'admin');

-- Done
SELECT 'MySQL initialization script completed.' AS message;
