IF DB_ID('DeviceInventoryDb') IS NULL
BEGIN
    CREATE DATABASE DeviceInventoryDb;
END
GO

USE DeviceInventoryDb;
GO

IF OBJECT_ID('dbo.Devices', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Devices
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL
    );
END
GO

IF OBJECT_ID('dbo.sp_InsertDevice', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_InsertDevice;
GO

CREATE PROCEDURE dbo.sp_InsertDevice
    @Name NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Devices (Name) VALUES (@Name);
    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
GO

IF NOT EXISTS(SELECT 1 FROM dbo.Devices WHERE Name = 'Router')
    INSERT INTO dbo.Devices (Name) VALUES ('Router');
IF NOT EXISTS(SELECT 1 FROM dbo.Devices WHERE Name = 'Sensor')
    INSERT INTO dbo.Devices (Name) VALUES ('Sensor');

-- Clients table + stored proc
IF OBJECT_ID('dbo.Clients', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Clients
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        [Type] INT NOT NULL,
        BirthDate DATETIME NULL
    );
END
GO

IF OBJECT_ID('dbo.sp_InsertClient', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_InsertClient;
GO

CREATE PROCEDURE dbo.sp_InsertClient
    @Name NVARCHAR(200),
    @Type INT,
    @BirthDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Clients (Name, [Type], BirthDate) VALUES (@Name, @Type, @BirthDate);
    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
GO

-- seed clients (optional)
IF NOT EXISTS(SELECT 1 FROM dbo.Clients WHERE Name = 'Alice')
    INSERT INTO dbo.Clients (Name, [Type], BirthDate) VALUES ('Alice', 0, '1990-05-01');
IF NOT EXISTS(SELECT 1 FROM dbo.Clients WHERE Name = 'Contoso Ltd')
    INSERT INTO dbo.Clients (Name, [Type], BirthDate) VALUES ('Contoso Ltd', 1, NULL);
