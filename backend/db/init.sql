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

-- PhoneNumbers table
IF OBJECT_ID('dbo.PhoneNumbers', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PhoneNumbers
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Number NVARCHAR(20) NOT NULL,
        DeviceId INT NOT NULL,
        FOREIGN KEY (DeviceId) REFERENCES dbo.Devices(Id)
    );
END
GO

-- Insert phone number stored procedure
IF OBJECT_ID('dbo.sp_InsertPhoneNumber', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_InsertPhoneNumber;
GO

CREATE PROCEDURE dbo.sp_InsertPhoneNumber
    @Number NVARCHAR(20),
    @DeviceId INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.PhoneNumbers (Number, DeviceId) VALUES (@Number, @DeviceId);
    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
GO

-- Update phone number stored procedure
IF OBJECT_ID('dbo.sp_UpdatePhoneNumber', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_UpdatePhoneNumber;
GO

CREATE PROCEDURE dbo.sp_UpdatePhoneNumber
    @Id INT,
    @Number NVARCHAR(20),
    @DeviceId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.PhoneNumbers SET Number = @Number, DeviceId = @DeviceId WHERE Id = @Id;
END
GO

-- Delete phone number stored procedure
IF OBJECT_ID('dbo.sp_DeletePhoneNumber', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_DeletePhoneNumber;
GO

CREATE PROCEDURE dbo.sp_DeletePhoneNumber
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.PhoneNumbers WHERE Id = @Id;
END
GO

-- Seed sample phone numbers (use device name to find DeviceId so seeds are idempotent and won't break FK)
IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumbers WHERE Number = '+1 (555) 123-4567')
BEGIN
    INSERT INTO dbo.PhoneNumbers (Number, DeviceId)
    SELECT '+1 (555) 123-4567', d.Id
    FROM dbo.Devices d
    WHERE d.Name = 'Router';
END

IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumbers WHERE Number = '+1 (555) 987-6543')
BEGIN
    INSERT INTO dbo.PhoneNumbers (Number, DeviceId)
    SELECT '+1 (555) 987-6543', d.Id
    FROM dbo.Devices d
    WHERE d.Name = 'Sensor';
END
