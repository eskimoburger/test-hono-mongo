# Five-Four API Documentation

**Base URL:** `http://localhost:8080`

---

## Health Check

### `GET /`

**Response:**
```json
{ "message": "Five-Four API" }
```

---

## Companies

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

**Response:** `200 OK`
```json
{
  "_id": "67b1a...",
  "company": "ABC Co., Ltd.",
  "tax": "0105561234567",
  "count": 0,
  "createdAt": "2026-02-16T00:00:00.000Z",
  "updatedAt": "2026-02-16T00:00:00.000Z"
}
```

**Errors:**
- `400` — Invalid ID
- `404` — Company not found

---

### `POST /companies`

Create a new company.

**Request Body:**
| Field     | Type     | Required | Description                        |
|-----------|----------|----------|------------------------------------|
| company   | string   | Yes      | Company name                       |
| tax       | string   | No       | Tax ID (nullable)                  |
| count     | number   | No       | Number of times customer has visited (default: 0) |

**Example:**
```json
{
  "company": "ABC Co., Ltd.",
  "tax": "0105561234567",
  "count": 0
}
```

**Response:** `201 Created`
```json
{
  "_id": "67b1a...",
  "company": "ABC Co., Ltd.",
  "tax": "0105561234567",
  "count": 0
}
```

**Errors:**
- `400` — company is required

---

### `PUT /companies/:id`

Update a company.

**Request Body:** Any fields from `company`, `tax`, `count`.

**Example:**
```json
{ "company": "New Name Co., Ltd.", "count": 5 }
```

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

## Admins

### `GET /admins`

Get all admins.

**Response:** `200 OK`
```json
[
  {
    "_id": "67b1a...",
    "user_name": "Admin",
    "password": "1234",
    "role": "Admin",
    "createdAt": "2026-02-16T00:00:00.000Z",
    "updatedAt": "2026-02-16T00:00:00.000Z"
  }
]
```

---

### `GET /admins/:id`

Get a single admin by ID.

**Response:** `200 OK`
```json
{
  "_id": "67b1a...",
  "user_name": "Admin",
  "password": "1234",
  "role": "Admin",
  "createdAt": "2026-02-16T00:00:00.000Z",
  "updatedAt": "2026-02-16T00:00:00.000Z"
}
```

**Errors:**
- `400` — Invalid ID
- `404` — Admin not found

---

### `POST /admins`

Create a new admin.

**Request Body:**
| Field     | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| user_name | string | Yes      | Username                             |
| password  | string | Yes      | Password                             |
| role      | string | Yes      | Role: `"Admin"` or `"SuperAdmin"`    |

**Example:**
```json
{
  "user_name": "Admin",
  "password": "1234",
  "role": "Admin"
}
```

**Response:** `201 Created`
```json
{
  "_id": "67b1a...",
  "user_name": "Admin",
  "role": "Admin"
}
```

**Errors:**
- `400` — user_name, password, and role are required
- `400` — role must be Admin or SuperAdmin

---

### `PUT /admins/:id`

Update an admin.

**Request Body:** Any fields from `user_name`, `password`, `role`.

**Example:**
```json
{ "password": "newpass123" }
```

**Response:** `200 OK`
```json
{ "message": "Admin updated" }
```

**Errors:**
- `400` — Invalid ID
- `400` — role must be Admin or SuperAdmin
- `404` — Admin not found

---

### `DELETE /admins/:id`

Delete an admin.

**Response:** `200 OK`
```json
{ "message": "Admin deleted" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Admin not found

---

## Orders

### `GET /orders`

Get all orders.

**Response:** `200 OK`
```json
[
  {
    "_id": "67b1a...",
    "id_company": "67b1a...",
    "customer_name": "Somchai Jaidee",
    "phone": "0812345678",
    "email": "somchai@email.com",
    "line": "somchai_line",
    "address": "123 Sukhumvit Rd, Bangkok",
    "start_date": "2026-02-16T00:00:00.000Z",
    "end_date": "2026-02-20T00:00:00.000Z",
    "type_work": "67b1a...",
    "count_work": 500,
    "detail_work": "Business Card 2 sides CMYK",
    "file": "namecard.pdf",
    "createdAt": "2026-02-16T00:00:00.000Z",
    "updatedAt": "2026-02-16T00:00:00.000Z"
  }
]
```

---

### `GET /orders/:id`

Get a single order by ID.

**Errors:**
- `400` — Invalid ID
- `404` — Order not found

---

### `POST /orders`

Create a new order.

**Request Body:**
| Field          | Type   | Required | Description                    |
|----------------|--------|----------|--------------------------------|
| id_company     | string | Yes      | Company ObjectId (FK)          |
| customer_name  | string | Yes      | Customer name                  |
| phone          | string | No       | Phone number                   |
| email          | string | No       | Email address                  |
| line           | string | No       | LINE ID                        |
| address        | string | No       | Address                        |
| start_date     | string | No       | Start date (ISO 8601)          |
| end_date       | string | No       | End date (ISO 8601)            |
| type_work      | string | No       | Type Work ObjectId (FK)        |
| count_work     | number | No       | Number of items (default: 0)   |
| detail_work    | string | No       | Work description               |
| file           | string | No       | File name                      |

**Example:**
```json
{
  "id_company": "67b1a...",
  "customer_name": "Somchai Jaidee",
  "phone": "0812345678",
  "email": "somchai@email.com",
  "line": "somchai_line",
  "address": "123 Sukhumvit Rd, Bangkok",
  "start_date": "2026-02-16",
  "end_date": "2026-02-20",
  "type_work": "67b1a...",
  "count_work": 500,
  "detail_work": "Business Card 2 sides CMYK",
  "file": "namecard.pdf"
}
```

**Response:** `201 Created`
```json
{
  "_id": "67b1a...",
  "customer_name": "Somchai Jaidee"
}
```

**Errors:**
- `400` — id_company and customer_name are required

---

### `PUT /orders/:id`

Update an order.

**Request Body:** Any fields from the order schema.

**Example:**
```json
{ "count_work": 1000, "detail_work": "Updated description" }
```

**Response:** `200 OK`
```json
{ "message": "Order updated" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Order not found

---

### `DELETE /orders/:id`

Delete an order.

**Response:** `200 OK`
```json
{ "message": "Order deleted" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Order not found

---

## Printers

### `GET /printers`

Get all printers.

**Response:** `200 OK`
```json
[
  {
    "_id": "67b1a...",
    "name_printer": "Epson L3210",
    "createdAt": "2026-02-16T00:00:00.000Z",
    "updatedAt": "2026-02-16T00:00:00.000Z"
  }
]
```

---

### `GET /printers/:id`

Get a single printer by ID.

**Errors:**
- `400` — Invalid ID
- `404` — Printer not found

---

### `POST /printers`

Create a new printer.

**Request Body:**
| Field        | Type   | Required | Description  |
|--------------|--------|----------|--------------|
| name_printer | string | Yes      | Printer name |

**Example:**
```json
{ "name_printer": "Epson L3210" }
```

**Response:** `201 Created`
```json
{
  "_id": "67b1a...",
  "name_printer": "Epson L3210"
}
```

**Errors:**
- `400` — name_printer is required

---

### `PUT /printers/:id`

Update a printer.

**Request Body:**
```json
{ "name_printer": "New Printer Name" }
```

**Response:** `200 OK`
```json
{ "message": "Printer updated" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Printer not found

---

### `DELETE /printers/:id`

Delete a printer.

**Response:** `200 OK`
```json
{ "message": "Printer deleted" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Printer not found

---

## Colors

### `GET /colors`

Get all colors.

**Response:** `200 OK`
```json
[
  {
    "_id": "67b1a...",
    "name_color": "CMYK",
    "createdAt": "2026-02-16T00:00:00.000Z",
    "updatedAt": "2026-02-16T00:00:00.000Z"
  }
]
```

---

### `GET /colors/:id`

Get a single color by ID.

**Errors:**
- `400` — Invalid ID
- `404` — Color not found

---

### `POST /colors`

Create a new color.

**Request Body:**
| Field      | Type   | Required | Description |
|------------|--------|----------|-------------|
| name_color | string | Yes      | Color name  |

**Example:**
```json
{ "name_color": "CMYK" }
```

**Response:** `201 Created`
```json
{
  "_id": "67b1a...",
  "name_color": "CMYK"
}
```

**Errors:**
- `400` — name_color is required

---

### `PUT /colors/:id`

Update a color.

**Request Body:**
```json
{ "name_color": "Pantone" }
```

**Response:** `200 OK`
```json
{ "message": "Color updated" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Color not found

---

### `DELETE /colors/:id`

Delete a color.

**Response:** `200 OK`
```json
{ "message": "Color deleted" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Color not found

---

## Type Works

### `GET /type-works`

Get all type works.

**Response:** `200 OK`
```json
[
  {
    "_id": "67b1a...",
    "name_tw": "Business Card",
    "createdAt": "2026-02-16T00:00:00.000Z",
    "updatedAt": "2026-02-16T00:00:00.000Z"
  }
]
```

---

### `GET /type-works/:id`

Get a single type work by ID.

**Errors:**
- `400` — Invalid ID
- `404` — Type Work not found

---

### `POST /type-works`

Create a new type work.

**Request Body:**
| Field   | Type   | Required | Description    |
|---------|--------|----------|----------------|
| name_tw | string | Yes      | Type work name |

**Example:**
```json
{ "name_tw": "Business Card" }
```

**Response:** `201 Created`
```json
{
  "_id": "67b1a...",
  "name_tw": "Business Card"
}
```

**Errors:**
- `400` — name_tw is required

---

### `PUT /type-works/:id`

Update a type work.

**Request Body:**
```json
{ "name_tw": "Brochure" }
```

**Response:** `200 OK`
```json
{ "message": "Type Work updated" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Type Work not found

---

### `DELETE /type-works/:id`

Delete a type work.

**Response:** `200 OK`
```json
{ "message": "Type Work deleted" }
```

**Errors:**
- `400` — Invalid ID
- `404` — Type Work not found

---

## Error Response Format

All errors follow this format:

```json
{ "error": "Error message here" }
```

| Status | Description              |
|--------|--------------------------|
| 400    | Bad request / Invalid ID |
| 404    | Resource not found       |
