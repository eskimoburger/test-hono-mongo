import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import auth from "./routes/auth";
import companies from "./routes/companies";
import admins from "./routes/admins";
import orders from "./routes/orders";
import printers from "./routes/printers";
import colors from "./routes/colors";
import typeWorks from "./routes/typeWorks";

const JWT_SECRET = process.env.JWT_SECRET || "five-four-secret";

const app = new OpenAPIHono();

// Allow all origins
app.use("*", cors());

// Health check
app.get("/", (c) => {
  return c.json({ message: "Five-Four API" });
});

// Public routes
app.route("/auth", auth);

// Swagger UI (public)
app.get("/swagger", swaggerUI({ url: "/doc" }));

// OpenAPI JSON spec (public)
app.doc("/doc", {
  openapi: "3.1.0",
  info: {
    title: "Five-Four Printing API",
    version: "1.0.0",
    description: "REST API for Five-Four Printing Shop Management",
  },
  security: [{ Bearer: [] }],
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// JWT middleware — protects all routes below
const jwtMiddleware = jwt({ secret: JWT_SECRET, alg: "HS256" });
app.use("/companies/*", jwtMiddleware);
app.use("/companies", jwtMiddleware);
app.use("/admins/*", jwtMiddleware);
app.use("/admins", jwtMiddleware);
app.use("/orders/*", jwtMiddleware);
app.use("/orders", jwtMiddleware);
app.use("/printers/*", jwtMiddleware);
app.use("/printers", jwtMiddleware);
app.use("/colors/*", jwtMiddleware);
app.use("/colors", jwtMiddleware);
app.use("/type-works/*", jwtMiddleware);
app.use("/type-works", jwtMiddleware);

// Protected routes
app.route("/companies", companies);
app.route("/admins", admins);
app.route("/orders", orders);
app.route("/printers", printers);
app.route("/colors", colors);
app.route("/type-works", typeWorks);

export default {
  port: 8080,
  fetch: app.fetch,
};

console.log("Server running on http://localhost:8080");
console.log("Swagger UI: http://localhost:8080/swagger");
