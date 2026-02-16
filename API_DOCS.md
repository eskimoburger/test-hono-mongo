# Five-Four API Documentation

**Base URL:** `http://localhost:8080`

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Auth

### `POST /auth/login`

Login and get a JWT token (24h expiry).

**Request Body:**
| Field     | Type   | Required | Description |
|-----------|--------|----------|-------------|
| user_name | string | Yes      | Username    |
| password  | string | Yes      | Password    |

**Example:**
```json
{ "user_name": "Admin", "password": "1234" }
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "67b1a...",
    "user_name": "Admin",
    "role": "Admin"
  }
}
```

**Errors:**
- `400` — user_name and password are required
- `401` — Invalid credentials

---

## Companies (Protected)

### `GET /companies`

Get all companies.

**Response:** `200 OK`
```json
[
  {
    "_id": "67b1a...",
    "company": "ABC Co., Ltd.",
    "tax": "0105561234567",
    "count": 0,
    "createdAt": "2026-02-16T00:00:00.000Z",
    "updatedAt": "2026-02-16T00:00:00.000Z"
  }
]
```

---

### `GET /companies/:id`

Get a single company by ID.

**Errors:**
- `400` — Invalid ID
- `404` — Company not found

---

### `POST /companies`

Create a new company.

**Request Body:**
| Field   | Type   | Required | Description                                       |
|---------|--------|----------|---------------------------------------------------|
| company | string | Yes      | Company name                                      |
| tax     | string | No       | Tax ID (nullable)                                 |
| count   | number | No       | Number of times customer has visited (default: 0) |

**Example:**
```json
{ "company": "ABC Co., Ltd.", "tax": "0105561234567", "count": 0 }
```

**Response:** `201 Created`

**Errors:**
- `400` — company is required

---

### `PUT /companies/:id`

Update a company. Send any fields to update.

**Response:** `200 OK`
```json
{ "message": "Company updated" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Company not found

---

### `DELETE /companies/:id`

Delete a company.

**Response:** `200 OK`
```json
{ "message": "Company deleted" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Company not found

---

## Admins (Protected)

### `GET /admins`

Get all admins.

---

### `GET /admins/:id`

Get a single admin by ID.

---

### `POST /admins`

Create a new admin.

**Request Body:**
| Field     | Type   | Required | Description                       |
|-----------|--------|----------|-----------------------------------|
| user_name | string | Yes      | Username                          |
| password  | string | Yes      | Password                          |
| role      | string | Yes      | Role: `"Admin"` or `"SuperAdmin"` |

**Errors:**
- `400` — user_name, password, and role are required
- `400` — role must be Admin or SuperAdmin

---

### `PUT /admins/:id`

Update an admin.

**Errors:**
- `400` — Invalid ID
- `400` — role must be Admin or SuperAdmin
- `404` — Admin not found

---

### `DELETE /admins/:id`

Delete an admin.

---

## Orders (Protected)

### `GET /orders`

Get all orders.

---

### `GET /orders/:id`

Get a single order by ID.

---

### `POST /orders`

Create a new order.

**Request Body:**
| Field         | Type   | Required | Description             |
|---------------|--------|----------|-------------------------|
| id_company    | string | Yes      | Company ObjectId (FK)   |
| customer_name | string | Yes      | Customer name           |
| phone         | string | No       | Phone number            |
| email         | string | No       | Email address           |
| line          | string | No       | LINE ID                 |
| address       | string | No       | Address                 |
| start_date    | string | No       | Start date (ISO 8601)   |
| end_date      | string | No       | End date (ISO 8601)     |
| type_work     | string | No       | Type Work ObjectId (FK) |
| count_work    | number | No       | Number of items         |
| detail_work   | string | No       | Work description        |
| file          | string | No       | File name               |

**Errors:**
- `400` — id_company and customer_name are required

---

### `PUT /orders/:id`

Update an order. Send any fields to update.

---

### `DELETE /orders/:id`

Delete an order.

---

## Printers (Protected)

### `GET /printers`

Get all printers.

---

### `GET /printers/:id` | `POST /printers` | `PUT /printers/:id` | `DELETE /printers/:id`

**POST Body:**
| Field        | Type   | Required | Description  |
|--------------|--------|----------|--------------|
| name_printer | string | Yes      | Printer name |

---

## Colors (Protected)

### `GET /colors`

Get all colors.

---

### `GET /colors/:id` | `POST /colors` | `PUT /colors/:id` | `DELETE /colors/:id`

**POST Body:**
| Field      | Type   | Required | Description |
|------------|--------|----------|-------------|
| name_color | string | Yes      | Color name  |

---

## Type Works (Protected)

### `GET /type-works`

Get all type works.

---

### `GET /type-works/:id` | `POST /type-works` | `PUT /type-works/:id` | `DELETE /type-works/:id`

**POST Body:**
| Field   | Type   | Required | Description    |
|---------|--------|----------|----------------|
| name_tw | string | Yes      | Type work name |

---

## Error Response Format

All errors follow this format:

```json
{ "error": "Error message here" }
```

| Status | Description              |
|--------|--------------------------|
| 400    | Bad request / Invalid ID |
| 401    | Unauthorized (no/invalid JWT) |
| 404    | Resource not found       |

---

## Swagger UI

Interactive API documentation with "Try it out" is available at:

```
http://localhost:8080/swagger
```

Click **Authorize** and enter your JWT token to test protected endpoints.
