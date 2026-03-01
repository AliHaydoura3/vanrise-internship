IF DB_ID('DeviceInventoryDb') IS NULL
BEGIN
    CREATE DATABASE DeviceInventoryDb;
END
GO

USE DeviceInventoryDb;
GO

-- wipe existing data for clean reseed
IF OBJECT_ID('dbo.PhoneNumberReservations','U') IS NOT NULL
BEGIN
    DROP TABLE dbo.PhoneNumberReservations;
END
IF OBJECT_ID('dbo.PhoneNumbers','U') IS NOT NULL
BEGIN
    DROP TABLE dbo.PhoneNumbers;
END
IF OBJECT_ID('dbo.Clients','U') IS NOT NULL
BEGIN
    DROP TABLE dbo.Clients;
END
IF OBJECT_ID('dbo.Devices','U') IS NOT NULL
BEGIN
    DROP TABLE dbo.Devices;
END
IF OBJECT_ID('dbo.Users','U') IS NOT NULL
BEGIN
    DROP TABLE dbo.Users;
END
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

-- additional sample clients
IF NOT EXISTS(SELECT 1 FROM dbo.Clients WHERE Name = 'Bob')
    INSERT INTO dbo.Clients (Name, [Type], BirthDate) VALUES ('Bob', 0, '1985-11-20');
IF NOT EXISTS(SELECT 1 FROM dbo.Clients WHERE Name = 'Acme Corp')
    INSERT INTO dbo.Clients (Name, [Type], BirthDate) VALUES ('Acme Corp', 1, NULL);


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

-- additional sample devices and numbers
IF NOT EXISTS(SELECT 1 FROM dbo.Devices WHERE Name='Modem')
    INSERT INTO dbo.Devices (Name) VALUES('Modem');
IF NOT EXISTS(SELECT 1 FROM dbo.Devices WHERE Name='Gateway')
    INSERT INTO dbo.Devices (Name) VALUES('Gateway');

IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumbers WHERE Number = '+1 (555) 555-0001')
BEGIN
    INSERT INTO dbo.PhoneNumbers (Number, DeviceId)
    SELECT '+1 (555) 555-0001', d.Id
    FROM dbo.Devices d
    WHERE d.Name = 'Modem';
END
IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumbers WHERE Number = '+1 (555) 555-0002')
BEGIN
    INSERT INTO dbo.PhoneNumbers (Number, DeviceId)
    SELECT '+1 (555) 555-0002', d.Id
    FROM dbo.Devices d
    WHERE d.Name = 'Gateway';
END

-- ============================================================
-- PhoneNumberReservations table
-- ============================================================
IF OBJECT_ID('dbo.PhoneNumberReservations', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PhoneNumberReservations
    (
        Id            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ClientId      INT NOT NULL,
        PhoneNumberId INT NOT NULL,
        BED           DATETIME NOT NULL,
        EED           DATETIME NULL,
        CONSTRAINT FK_Reservations_Client      FOREIGN KEY (ClientId)      REFERENCES dbo.Clients(Id),
        CONSTRAINT FK_Reservations_PhoneNumber FOREIGN KEY (PhoneNumberId) REFERENCES dbo.PhoneNumbers(Id)
    );
END
GO

-- Insert reservation stored procedure
IF OBJECT_ID('dbo.sp_InsertPhoneNumberReservation', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_InsertPhoneNumberReservation;
GO

CREATE PROCEDURE dbo.sp_InsertPhoneNumberReservation
    @ClientId      INT,
    @PhoneNumberId INT,
    @BED           DATETIME,
    @EED           DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.PhoneNumberReservations (ClientId, PhoneNumberId, BED, EED)
    VALUES (@ClientId, @PhoneNumberId, @BED, @EED);
    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
GO

-- Delete reservation stored procedure
IF OBJECT_ID('dbo.sp_DeletePhoneNumberReservation', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_DeletePhoneNumberReservation;
GO

CREATE PROCEDURE dbo.sp_DeletePhoneNumberReservation
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.PhoneNumberReservations WHERE Id = @Id;
END
GO

-- seed some reservations (active and ended)
IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumberReservations WHERE ClientId = 1 AND PhoneNumberId = 1)
BEGIN
    INSERT INTO dbo.PhoneNumberReservations (ClientId, PhoneNumberId, BED, EED)
    VALUES (1, 1, '2024-01-01', NULL); -- Alice active
END

IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumberReservations WHERE ClientId = 2 AND PhoneNumberId = 2)
BEGIN
    INSERT INTO dbo.PhoneNumberReservations (ClientId, PhoneNumberId, BED, EED)
    VALUES (2, 2, '2023-06-01', '2024-12-31'); -- Contoso historical
END

IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumberReservations WHERE ClientId = 3 AND PhoneNumberId = 3)
BEGIN
    INSERT INTO dbo.PhoneNumberReservations (ClientId, PhoneNumberId, BED, EED)
    VALUES (3, 3, '2025-02-15', NULL); -- Bob active
END


-- Seed sample reservations (idempotent)
IF NOT EXISTS(SELECT 1 FROM dbo.PhoneNumberReservations)
BEGIN
    -- Alice reserves the Router phone number with no end date
    INSERT INTO dbo.PhoneNumberReservations (ClientId, PhoneNumberId, BED, EED)
    SELECT c.Id, pn.Id, '2024-01-01', NULL
    FROM dbo.Clients c
    CROSS JOIN dbo.PhoneNumbers pn
    WHERE c.Name = 'Alice' AND pn.Number = '+1 (555) 123-4567';

    -- Contoso reserves the Sensor phone number with an end date
    INSERT INTO dbo.PhoneNumberReservations (ClientId, PhoneNumberId, BED, EED)
    SELECT c.Id, pn.Id, '2023-06-01', '2024-12-31'
    FROM dbo.Clients c
    CROSS JOIN dbo.PhoneNumbers pn
    WHERE c.Name = 'Contoso Ltd' AND pn.Number = '+1 (555) 987-6543';
END

-- ============================================================
-- sp_GetActiveReservationsByClient
-- Returns reservations effective at the current moment.
-- Active iff GETDATE() > BED AND (EED IS NULL OR GETDATE() < EED)
-- @ClientId = NULL means return all active reservations.
-- ============================================================
IF OBJECT_ID('dbo.sp_GetActiveReservationsByClient', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetActiveReservationsByClient;
GO

CREATE PROCEDURE dbo.sp_GetActiveReservationsByClient
    @ClientId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT r.Id,
           r.ClientId,
           c.Name  AS ClientName,
           r.PhoneNumberId,
           pn.Number AS PhoneNumber,
           r.BED,
           r.EED
    FROM   dbo.PhoneNumberReservations r
    LEFT JOIN dbo.Clients      c  ON c.Id  = r.ClientId
    LEFT JOIN dbo.PhoneNumbers pn ON pn.Id = r.PhoneNumberId
    WHERE  GETDATE() > r.BED
      AND  (r.EED IS NULL OR GETDATE() < r.EED)
      AND  (@ClientId IS NULL OR r.ClientId = @ClientId)
    ORDER BY r.Id;
END
GO

-- ============================================================
-- sp_UnreservePhoneNumber
-- Sets EED = GETDATE() on the single active reservation for
-- the given ClientId + PhoneNumberId pair.
-- Returns the number of rows updated (1 on success, 0 if not found).
-- ============================================================
IF OBJECT_ID('dbo.sp_UnreservePhoneNumber', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_UnreservePhoneNumber;
GO

CREATE PROCEDURE dbo.sp_UnreservePhoneNumber
    @ClientId      INT,
    @PhoneNumberId INT
AS
BEGIN
    SET NOCOUNT OFF;
    UPDATE dbo.PhoneNumberReservations
    SET    EED = GETDATE()
    WHERE  ClientId      = @ClientId
      AND  PhoneNumberId = @PhoneNumberId
      AND  GETDATE() > BED
      AND  (EED IS NULL OR GETDATE() < EED);

    SELECT @@ROWCOUNT;
END
GO

-- ============================================================
-- sp_GetClientsCountByType
-- Report: number of clients per type.
-- @Type = NULL returns all types.
-- ============================================================
IF OBJECT_ID('dbo.sp_GetClientsCountByType', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetClientsCountByType;
GO

CREATE PROCEDURE dbo.sp_GetClientsCountByType
    @Type INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT [Type],
           CASE [Type]
               WHEN 0 THEN 'Individual'
               WHEN 1 THEN 'Organization'
               ELSE 'Unknown'
           END AS TypeName,
           COUNT(*) AS NoOfClients
    FROM   dbo.Clients
    WHERE  (@Type IS NULL OR [Type] = @Type)
    GROUP BY [Type]
    ORDER BY [Type];
END
GO

-- ============================================================
-- sp_GetPhoneNumberStatusByDevice
-- Report: count of Reserved/Unreserved phone numbers per device.
-- A phone number is "Reserved" when there is an active reservation
-- (GETDATE() > BED AND (EED IS NULL OR GETDATE() < EED)).
-- @DeviceId = NULL  -> all devices
-- @Status   = NULL  -> both statuses; 'Reserved' or 'Unreserved' to filter.
-- ============================================================
IF OBJECT_ID('dbo.sp_GetPhoneNumberStatusByDevice', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetPhoneNumberStatusByDevice;
GO

CREATE PROCEDURE dbo.sp_GetPhoneNumberStatusByDevice
    @DeviceId INT          = NULL,
    @Status   NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    WITH PhoneNumberStatus AS
    (
        SELECT pn.Id AS PhoneNumberId,
               pn.DeviceId,
               d.Name AS DeviceName,
               CASE
                   WHEN EXISTS (
                       SELECT 1
                       FROM   dbo.PhoneNumberReservations r
                       WHERE  r.PhoneNumberId = pn.Id
                         AND  GETDATE() > r.BED
                         AND  (r.EED IS NULL OR GETDATE() < r.EED)
                   ) THEN 'Reserved'
                   ELSE 'Unreserved'
               END AS [Status]
        FROM dbo.PhoneNumbers pn
        JOIN dbo.Devices      d ON d.Id = pn.DeviceId
        WHERE (@DeviceId IS NULL OR pn.DeviceId = @DeviceId)
    )
    SELECT DeviceId,
           DeviceName,
           [Status],
           COUNT(*) AS NoOfPhoneNumbers
    FROM   PhoneNumberStatus
    WHERE  (@Status IS NULL OR [Status] = @Status)
    GROUP BY DeviceId, DeviceName, [Status]
    ORDER BY DeviceName, [Status];
END
GO

-- ════════════════════════════════════════════════════════════════
-- Authentication tables
-- ════════════════════════════════════════════════════════════════
CREATE TABLE dbo.Users
(
    Id           INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Username     NVARCHAR(100)     NOT NULL,
    PasswordHash NVARCHAR(64)      NOT NULL  -- SHA-256 lowercase hex (64 chars)
);
GO

IF OBJECT_ID('dbo.sp_LoginUser','P') IS NOT NULL
    DROP PROCEDURE dbo.sp_LoginUser;
GO

CREATE PROCEDURE dbo.sp_LoginUser
    @Username     NVARCHAR(100),
    @PasswordHash NVARCHAR(64)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Username
    FROM   dbo.Users
    WHERE  Username     = @Username
      AND  PasswordHash = @PasswordHash;
END
GO

-- Seed: username=admin / password=admin123
-- PasswordHash = SHA-256('admin123') computed via SQL HASHBYTES
INSERT INTO dbo.Users (Username, PasswordHash)
VALUES (
    'admin',
    LOWER(CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', 'admin123'), 2))
);
GO