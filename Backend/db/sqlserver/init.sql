-- Initialization script for SQL Server to support the football_webpage_api_nodejs project
-- Creates tables and stored procedures used by the project's models and routes
-- NOTE: Adjust types, lengths and indexes as needed for production

SET NOCOUNT ON;

-- === TABLES ===

IF OBJECT_ID('dbo.users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NULL,
        username NVARCHAR(200) NOT NULL UNIQUE,
        [user] NVARCHAR(200) NULL, -- compatibility with code that references `user`
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) NOT NULL DEFAULT('user')
    );
END

IF OBJECT_ID('dbo.sponsors', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.sponsors (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        url NVARCHAR(500) NULL,
        imageUrl NVARCHAR(500) NULL,
        importance INT NULL
    );
END

IF OBJECT_ID('dbo.teams', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.teams (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        categoryId INT NULL,
        categoryName NVARCHAR(200) NULL,
        genreId INT NULL,
        genreName NVARCHAR(200) NULL
    );
END

IF OBJECT_ID('dbo.players', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.players (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        lastname NVARCHAR(150) NOT NULL,
        position_id INT NULL,
        position_name NVARCHAR(150) NULL,
        team_id INT NULL,
        team_name NVARCHAR(200) NULL,
        genre_id INT NULL,
        genre_name NVARCHAR(150) NULL,
        picture NVARCHAR(500) NULL,
        birthdate DATE NULL,
        bornCity NVARCHAR(200) NULL
    );
END

IF OBJECT_ID('dbo.direction', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.direction (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        lastname NVARCHAR(150) NOT NULL,
        position NVARCHAR(200) NULL,
        startDate DATE NULL,
        imageUrl NVARCHAR(500) NULL
    );
END

IF OBJECT_ID('dbo.blog_entries', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.blog_entries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NULL,
        title NVARCHAR(300) NOT NULL,
        content NVARCHAR(MAX) NULL,
        resource NVARCHAR(500) NULL,
        visible BIT NOT NULL DEFAULT 1,
        date_create DATETIME NOT NULL DEFAULT GETDATE()
    );
END

-- === STORED PROCEDURES ===

-- Teams: select
IF OBJECT_ID('dbo.teams_select', 'P') IS NOT NULL DROP PROCEDURE dbo.teams_select;
GO
CREATE PROCEDURE dbo.teams_select
    @id INT = NULL,
    @name NVARCHAR(200) = NULL,
    @category NVARCHAR(200) = NULL,
    @genre NVARCHAR(200) = NULL,
    @offset INT = 0,
    @limit INT = 500
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM dbo.teams t
    WHERE (@id IS NULL OR t.id = @id)
      AND (@name IS NULL OR t.name LIKE '%' + @name + '%')
      AND (@category IS NULL OR t.categoryName LIKE '%' + @category + '%')
      AND (@genre IS NULL OR t.genreName LIKE '%' + @genre + '%')
    ORDER BY t.id
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
END
GO

-- Teams: insert
IF OBJECT_ID('dbo.teams_insert', 'P') IS NOT NULL DROP PROCEDURE dbo.teams_insert;
GO
CREATE PROCEDURE dbo.teams_insert
    @name NVARCHAR(200),
    @category NVARCHAR(200) = NULL,
    @genre NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.teams (name, categoryName, genreName)
    VALUES (@name, @category, @genre);

    SELECT SCOPE_IDENTITY() AS insertId;
END
GO

-- Teams: update
IF OBJECT_ID('dbo.teams_update', 'P') IS NOT NULL DROP PROCEDURE dbo.teams_update;
GO
CREATE PROCEDURE dbo.teams_update
    @id INT,
    @name NVARCHAR(200) = NULL,
    @categoryId INT = NULL,
    @categoryName NVARCHAR(200) = NULL,
    @genreId INT = NULL,
    @genreName NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.teams
    SET name = COALESCE(@name, name),
        categoryId = COALESCE(@categoryId, categoryId),
        categoryName = COALESCE(@categoryName, categoryName),
        genreId = COALESCE(@genreId, genreId),
        genreName = COALESCE(@genreName, genreName)
    WHERE id = @id;
END
GO

-- Teams: delete
IF OBJECT_ID('dbo.teams_delete', 'P') IS NOT NULL DROP PROCEDURE dbo.teams_delete;
GO
CREATE PROCEDURE dbo.teams_delete
    @id INT = NULL,
    @name NVARCHAR(200) = NULL,
    @categoryId INT = NULL,
    @categoryName NVARCHAR(200) = NULL,
    @genreId INT = NULL,
    @genreName NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.teams
    WHERE (@id IS NULL OR id = @id)
      AND (@name IS NULL OR name = @name)
      AND (@categoryId IS NULL OR categoryId = @categoryId)
      AND (@categoryName IS NULL OR categoryName = @categoryName)
      AND (@genreId IS NULL OR genreId = @genreId)
      AND (@genreName IS NULL OR genreName = @genreName);
END
GO


-- Players: select
IF OBJECT_ID('dbo.players_select', 'P') IS NOT NULL DROP PROCEDURE dbo.players_select;
GO
CREATE PROCEDURE dbo.players_select
    @id INT = NULL,
    @name NVARCHAR(150) = NULL,
    @lastname NVARCHAR(150) = NULL,
    @position_id INT = NULL,
    @position_name NVARCHAR(150) = NULL,
    @team_id INT = NULL,
    @team_name NVARCHAR(200) = NULL,
    @genre_id INT = NULL,
    @genre_name NVARCHAR(150) = NULL,
    @birthdate DATE = NULL,
    @bornCity NVARCHAR(200) = NULL,
    @offset INT = 0,
    @limit INT = 500
AS
BEGIN
    SET NOCOUNT ON;
    SELECT *
    FROM dbo.players p
    WHERE (@id IS NULL OR p.id = @id)
      AND (@name IS NULL OR p.name LIKE '%' + @name + '%')
      AND (@lastname IS NULL OR p.lastname LIKE '%' + @lastname + '%')
      AND (@position_id IS NULL OR p.position_id = @position_id)
      AND (@position_name IS NULL OR p.position_name LIKE '%' + @position_name + '%')
      AND (@team_id IS NULL OR p.team_id = @team_id)
      AND (@team_name IS NULL OR p.team_name LIKE '%' + @team_name + '%')
      AND (@genre_id IS NULL OR p.genre_id = @genre_id)
      AND (@genre_name IS NULL OR p.genre_name LIKE '%' + @genre_name + '%')
      AND (@birthdate IS NULL OR p.birthdate = @birthdate)
      AND (@bornCity IS NULL OR p.bornCity LIKE '%' + @bornCity + '%')
    ORDER BY p.id
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
END
GO

-- Players: insert
IF OBJECT_ID('dbo.players_insert', 'P') IS NOT NULL DROP PROCEDURE dbo.players_insert;
GO
CREATE PROCEDURE dbo.players_insert
    @name NVARCHAR(150),
    @lastname NVARCHAR(150),
    @position_id INT = NULL,
    @position_name NVARCHAR(150) = NULL,
    @team_id INT = NULL,
    @team_name NVARCHAR(200) = NULL,
    @genre_id INT = NULL,
    @genre_name NVARCHAR(150) = NULL,
    @picture NVARCHAR(500) = NULL,
    @birthdate DATE = NULL,
    @bornCity NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.players (name, lastname, position_id, position_name, team_id, team_name, genre_id, genre_name, picture, birthdate, bornCity)
    VALUES (@name, @lastname, @position_id, @position_name, @team_id, @team_name, @genre_id, @genre_name, @picture, @birthdate, @bornCity);

    SELECT SCOPE_IDENTITY() AS insertId;
END
GO

-- Players: update
IF OBJECT_ID('dbo.players_update', 'P') IS NOT NULL DROP PROCEDURE dbo.players_update;
GO
CREATE PROCEDURE dbo.players_update
    @id INT,
    @name NVARCHAR(150) = NULL,
    @lastname NVARCHAR(150) = NULL,
    @position_id INT = NULL,
    @position_name NVARCHAR(150) = NULL,
    @team_id INT = NULL,
    @team_name NVARCHAR(200) = NULL,
    @genre_id INT = NULL,
    @genre_name NVARCHAR(150) = NULL,
    @picture NVARCHAR(500) = NULL,
    @birthdate DATE = NULL,
    @bornCity NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.players
    SET name = COALESCE(@name, name),
        lastname = COALESCE(@lastname, lastname),
        position_id = COALESCE(@position_id, position_id),
        position_name = COALESCE(@position_name, position_name),
        team_id = COALESCE(@team_id, team_id),
        team_name = COALESCE(@team_name, team_name),
        genre_id = COALESCE(@genre_id, genre_id),
        genre_name = COALESCE(@genre_name, genre_name),
        picture = COALESCE(@picture, picture),
        birthdate = COALESCE(@birthdate, birthdate),
        bornCity = COALESCE(@bornCity, bornCity)
    WHERE id = @id;
END
GO

-- Players: delete
IF OBJECT_ID('dbo.players_delete', 'P') IS NOT NULL DROP PROCEDURE dbo.players_delete;
GO
CREATE PROCEDURE dbo.players_delete
    @id INT = NULL,
    @name NVARCHAR(150) = NULL,
    @lastname NVARCHAR(150) = NULL,
    @position_id INT = NULL,
    @position_name NVARCHAR(150) = NULL,
    @team_id INT = NULL,
    @team_name NVARCHAR(200) = NULL,
    @genre_id INT = NULL,
    @genre_name NVARCHAR(150) = NULL,
    @birthdate DATE = NULL,
    @bornCity NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.players
    WHERE (@id IS NULL OR id = @id)
      AND (@name IS NULL OR name = @name)
      AND (@lastname IS NULL OR lastname = @lastname)
      AND (@position_id IS NULL OR position_id = @position_id)
      AND (@position_name IS NULL OR position_name = @position_name)
      AND (@team_id IS NULL OR team_id = @team_id)
      AND (@team_name IS NULL OR team_name = @team_name)
      AND (@genre_id IS NULL OR genre_id = @genre_id)
      AND (@genre_name IS NULL OR genre_name = @genre_name)
      AND (@birthdate IS NULL OR birthdate = @birthdate)
      AND (@bornCity IS NULL OR bornCity = @bornCity);
END
GO


-- Direction: select
IF OBJECT_ID('dbo.direction_select', 'P') IS NOT NULL DROP PROCEDURE dbo.direction_select;
GO
CREATE PROCEDURE dbo.direction_select
    @id INT = NULL,
    @name NVARCHAR(150) = NULL,
    @lastname NVARCHAR(150) = NULL,
    @position NVARCHAR(200) = NULL,
    @startDate DATE = NULL,
    @imageUrl NVARCHAR(500) = NULL,
    @offset INT = 0,
    @limit INT = 500
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM dbo.direction d
    WHERE (@id IS NULL OR d.id = @id)
      AND (@name IS NULL OR d.name LIKE '%' + @name + '%')
      AND (@lastname IS NULL OR d.lastname LIKE '%' + @lastname + '%')
      AND (@position IS NULL OR d.position LIKE '%' + @position + '%')
      AND (@startDate IS NULL OR d.startDate = @startDate)
      AND (@imageUrl IS NULL OR d.imageUrl LIKE '%' + @imageUrl + '%')
    ORDER BY d.id
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
END
GO

-- Direction: insert
IF OBJECT_ID('dbo.direction_insert', 'P') IS NOT NULL DROP PROCEDURE dbo.direction_insert;
GO
CREATE PROCEDURE dbo.direction_insert
    @name NVARCHAR(150),
    @lastname NVARCHAR(150),
    @position NVARCHAR(200),
    @startDate DATE,
    @imageUrl NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.direction (name, lastname, position, startDate, imageUrl)
    VALUES (@name, @lastname, @position, @startDate, @imageUrl);
    SELECT SCOPE_IDENTITY() AS insertId;
END
GO

-- Direction: update
IF OBJECT_ID('dbo.direction_update', 'P') IS NOT NULL DROP PROCEDURE dbo.direction_update;
GO
CREATE PROCEDURE dbo.direction_update
    @id INT,
    @name NVARCHAR(150) = NULL,
    @lastname NVARCHAR(150) = NULL,
    @position NVARCHAR(200) = NULL,
    @startDate DATE = NULL,
    @imageUrl NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.direction
    SET name = COALESCE(@name, name),
        lastname = COALESCE(@lastname, lastname),
        position = COALESCE(@position, position),
        startDate = COALESCE(@startDate, startDate),
        imageUrl = COALESCE(@imageUrl, imageUrl)
    WHERE id = @id;
END
GO

-- Direction: delete
IF OBJECT_ID('dbo.direction_delete', 'P') IS NOT NULL DROP PROCEDURE dbo.direction_delete;
GO
CREATE PROCEDURE dbo.direction_delete
    @id INT = NULL,
    @name NVARCHAR(150) = NULL,
    @lastname NVARCHAR(150) = NULL,
    @position NVARCHAR(200) = NULL,
    @startDate DATE = NULL,
    @imageUrl NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.direction
    WHERE (@id IS NULL OR id = @id)
      AND (@name IS NULL OR name = @name)
      AND (@lastname IS NULL OR lastname = @lastname)
      AND (@position IS NULL OR position = @position)
      AND (@startDate IS NULL OR startDate = @startDate)
      AND (@imageUrl IS NULL OR imageUrl = @imageUrl);
END
GO


-- Blog entries: select
IF OBJECT_ID('dbo.blog_entries_select', 'P') IS NOT NULL DROP PROCEDURE dbo.blog_entries_select;
GO
CREATE PROCEDURE dbo.blog_entries_select
    @id INT = NULL,
    @user NVARCHAR(200) = NULL,
    @title NVARCHAR(300) = NULL,
    @content NVARCHAR(MAX) = NULL,
    @resource NVARCHAR(500) = NULL,
    @visible INT = NULL,
    @date_create DATETIME = NULL,
    @offset INT = 0,
    @limite INT = 100
AS
BEGIN
    SET NOCOUNT ON;
    SELECT b.*, u.username
    FROM dbo.blog_entries b
    LEFT JOIN dbo.users u ON b.userId = u.id
    WHERE (@id IS NULL OR b.id = @id)
      AND (@user IS NULL OR u.username = @user)
      AND (@title IS NULL OR b.title LIKE '%' + @title + '%')
      AND (@content IS NULL OR b.content LIKE '%' + @content + '%')
      AND (@resource IS NULL OR b.resource LIKE '%' + @resource + '%')
      AND (@visible IS NULL OR b.visible = CASE WHEN @visible = 1 THEN 1 ELSE 0 END)
      AND (@date_create IS NULL OR CONVERT(DATE, b.date_create) = CONVERT(DATE, @date_create))
    ORDER BY b.id
    OFFSET @offset ROWS FETCH NEXT @limite ROWS ONLY;
END
GO

-- Blog entries: insert
IF OBJECT_ID('dbo.blog_entries_insert', 'P') IS NOT NULL DROP PROCEDURE dbo.blog_entries_insert;
GO
CREATE PROCEDURE dbo.blog_entries_insert
    @user NVARCHAR(200), -- expects username
    @title NVARCHAR(300),
    @content NVARCHAR(MAX) = NULL,
    @resource NVARCHAR(500) = NULL,
    @visible BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @userId INT = NULL;
    SELECT @userId = id FROM dbo.users WHERE username = @user OR [user] = @user;

    INSERT INTO dbo.blog_entries (userId, title, content, resource, visible)
    VALUES (@userId, @title, @content, @resource, @visible);

    SELECT SCOPE_IDENTITY() AS insertId;
END
GO

-- Blog entries: update
IF OBJECT_ID('dbo.blog_entries_update', 'P') IS NOT NULL DROP PROCEDURE dbo.blog_entries_update;
GO
CREATE PROCEDURE dbo.blog_entries_update
    @id INT,
    @user NVARCHAR(200) = NULL,
    @title NVARCHAR(300) = NULL,
    @content NVARCHAR(MAX) = NULL,
    @resource NVARCHAR(500) = NULL,
    @visible BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @userId INT = NULL;
    IF @user IS NOT NULL
        SELECT @userId = id FROM dbo.users WHERE username = @user OR [user] = @user;

    UPDATE dbo.blog_entries
    SET userId = COALESCE(@userId, userId),
        title = COALESCE(@title, title),
        content = COALESCE(@content, content),
        resource = COALESCE(@resource, resource),
        visible = COALESCE(@visible, visible)
    WHERE id = @id;
END
GO

-- Blog entries: delete
IF OBJECT_ID('dbo.blog_entries_delete', 'P') IS NOT NULL DROP PROCEDURE dbo.blog_entries_delete;
GO
CREATE PROCEDURE dbo.blog_entries_delete
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.blog_entries WHERE id = @id;
END
GO

-- Sponsors: no stored procedures required (models use direct SELECT/INSERT/UPDATE/DELETE), but create a helper procedure if desired

-- === SAMPLE DATA (optional) ===
-- Add an admin user (password must be bcrypt hashed by your app). For convenience we add a placeholder password invite to change it.
IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE username = 'admin')
BEGIN
    INSERT INTO dbo.users (name, username, [user], password, role)
    VALUES ('Administrator', 'admin', 'admin', 'change_me', 'admin');
END

PRINT 'Database initialization script completed.';
GO
