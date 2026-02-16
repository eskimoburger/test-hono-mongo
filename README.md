# test-hono-mongo

Basic CRUD REST API built with [Hono](https://hono.dev) + [MongoDB Atlas](https://www.mongodb.com/atlas) running on [Bun](https://bun.sh).

## Prerequisites

- [Bun](https://bun.sh) installed
- MongoDB Atlas account with a cluster

## Setup

```bash
bun install
```

Copy the example env and fill in your MongoDB Atlas credentials:

```bash
cp .env.example .env
```

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
DB_NAME=test-hono-mongo
```

## Run

```bash
# development (hot reload)
bun run dev

# production
bun run start
```

Server runs on `http://localhost:8080`

## API Endpoints

| Method   | Endpoint      | Description    |
|----------|---------------|----------------|
| `GET`    | `/`           | Health check   |
| `GET`    | `/posts`      | Get all posts  |
| `GET`    | `/posts/:id`  | Get a post     |
| `POST`   | `/posts`      | Create a post  |
| `PUT`    | `/posts/:id`  | Update a post  |
| `DELETE` | `/posts/:id`  | Delete a post  |

### Example

```bash
# Create
curl -X POST http://localhost:8080/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello", "content": "World"}'

# Get all
curl http://localhost:8080/posts

# Get one
curl http://localhost:8080/posts/<id>

# Update
curl -X PUT http://localhost:8080/posts/<id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated", "content": "New content"}'

# Delete
curl -X DELETE http://localhost:8080/posts/<id>
```

## Test Scripts

```bash
# Create posts & test CRUD
./test-create.sh

# Delete all posts
./test-delete.sh
```
