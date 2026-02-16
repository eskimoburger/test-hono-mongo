# Five-Four Printing API

REST API for Five-Four Printing Shop Management built with [Hono](https://hono.dev) + [MongoDB Atlas](https://www.mongodb.com/atlas) + JWT Auth running on [Bun](https://bun.sh).

## Prerequisites

- [Bun](https://bun.sh) installed
- MongoDB Atlas account with a cluster

## Setup

```bash
bun install
```

Copy the example env and fill in your credentials:

```bash
cp .env.example .env
```

```env
# SRV format (default)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0

# Standard format (use this if SRV DNS fails on Windows)
# MONGODB_URI=mongodb://<username>:<password>@<cluster>.mongodb.net:27017/?tls=true&authSource=admin

DB_NAME=test-hono-mongo
JWT_SECRET=your-secret-key-here
```

## Seed Default Admins

Before using the API, seed default admin accounts:

```bash
bun run seed
```

This creates two admins:
- `Admin` / `1234` (role: Admin)
- `SuperAdmin` / `4321` (role: SuperAdmin)

## Run

```bash
# development (hot reload)
bun run dev

# production
bun run start
```

Server runs on `http://localhost:8080`

## Documentation

- **Swagger UI:** http://localhost:8080/swagger
- **OpenAPI JSON:** http://localhost:8080/doc

## Authentication

All CRUD endpoints require a JWT token. Use the login endpoint to get one.

### 1. Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_name": "Admin", "password": "1234"}'
```

Response:
```json
{
  "token": "eyJhbG...",
  "user": { "_id": "...", "user_name": "Admin", "role": "Admin" }
}
```

### 2. Use Token

Add the `Authorization: Bearer <token>` header to all requests:

```bash
curl http://localhost:8080/companies \
  -H "Authorization: Bearer eyJhbG..."
```

### Swagger UI

Click the **Authorize** button in Swagger UI and paste your token.

## API Endpoints

### Public

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| `GET`  | `/`            | Health check         |
| `POST` | `/auth/login`  | Login, get JWT token |
| `GET`  | `/swagger`     | Swagger UI           |
| `GET`  | `/doc`         | OpenAPI JSON spec    |

### Protected (JWT required)

Each resource has full CRUD: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

| Route         | Collection   | Fields                                          |
|---------------|--------------|-------------------------------------------------|
| `/companies`  | companies    | company, tax (nullable), count                  |
| `/admins`     | admins       | user_name, password, role (Admin/SuperAdmin)     |
| `/orders`     | orders       | id_company (FK), customer_name, phone, email, line, address, start_date, end_date, type_work (FK), count_work, detail_work, file |
| `/printers`   | printers     | name_printer                                    |
| `/colors`     | colors       | name_color                                      |
| `/type-works` | type_works   | name_tw                                         |

## Test Scripts

### Bash (macOS/Linux)

```bash
./test-create.sh    # Login + create sample data
./test-delete.sh    # Login + delete all data
```

### PowerShell (Windows)

```powershell
.\test-create.ps1   # Login + create sample data
.\test-delete.ps1   # Login + delete all data
```
