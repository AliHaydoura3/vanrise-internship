# Device Inventory

Device inventory management system built as part of my Vanrise Software Engineering internship.

A full-stack CRUD application for managing devices, clients, and phone numbers:

- **Backend** — ASP.NET Core Web API (.NET 8) with SQL Server and stored procedures
- **Frontend** — Single-page app built with AngularJS and Bootstrap
- **Database** — SQL Server schema, stored procedures, and seed data in one idempotent script

## Project structure

```
backend/                 ASP.NET Core Web API (net8.0)
  Controllers/           REST endpoints for Devices, Clients, PhoneNumbers
  Data/                  Repository layer (Dapper-style SqlClient + stored procedures)
  Models/                Entities and DTOs
  Mappers/               Entity <-> DTO mapping
  db/init.sql            Database schema, stored procedures, and seed data
frontend/                AngularJS single-page app
  src/services/          API client services
  src/controllers/       View logic
  src/assets/            Styles
vanrise-internship.sln   Visual Studio solution
```

## Features

- CRUD for **Devices** (e.g. Router, Sensor)
- CRUD for **Clients** with type (Individual / Organization) and optional birth date
- CRUD for **Phone Numbers** linked to devices
- Search and filter by name/type
- Swagger UI (development only)

## Getting started

### Prerequisites

- .NET 8 SDK
- SQL Server running locally (`localhost,1433`)
- Any static file server for the frontend

### 1. Database

Run `backend/db/init.sql` in SQL Server Management Studio (or `sqlcmd`). The script creates the
`DeviceInventoryDb` database, its tables and stored procedures, and seeds sample data.

### 2. Backend

Set your local connection string in `backend/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=DeviceInventoryDb;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

> NOTE: `backend/appsettings.Development.json` is intentionally not tracked in git because it
> contains credentials. Create it locally (see the example above).

Then run the API:

```bash
cd backend
dotnet run
```

The API listens on `http://localhost:5297` (see `frontend/index.html` and
`backend/Properties/launchSettings.json`). Swagger UI is available at `/swagger` in development.

### 3. Frontend

Serve the `frontend` folder on port `8000` (the backend CORS policy allows `http://localhost:8000`):

```bash
cd frontend
python3 -m http.server 8000
```

Open http://localhost:8000 and manage devices, clients, and phone numbers.

## API endpoints

| Method | Route                    | Description                    |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/api/devices`           | List/search devices            |
| GET    | `/api/devices/{id}`      | Get a device by id             |
| POST   | `/api/devices`           | Create a device                |
| PUT    | `/api/devices/{id}`      | Update a device                |
| DELETE | `/api/devices/{id}`      | Delete a device                |
| GET    | `/api/clients`           | List/filter clients            |
| GET    | `/api/clients/{id}`      | Get a client by id             |
| POST   | `/api/clients`           | Create a client                |
| PUT    | `/api/clients/{id}`      | Update a client                |
| DELETE | `/api/clients/{id}`      | Delete a client                |
| GET    | `/api/phonenumbers`      | List phone numbers             |
| GET    | `/api/phonenumbers/{id}` | Get a phone number by id       |
| POST   | `/api/phonenumbers`      | Create a phone number          |
| PUT    | `/api/phonenumbers/{id}` | Update a phone number          |
| DELETE | `/api/phonenumbers/{id}` | Delete a phone number          |

## Author

Ali Haydoura — Vanrise Software Engineering Internship