import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import companies from "./routes/companies";
import admins from "./routes/admins";
import orders from "./routes/orders";
import printers from "./routes/printers";
import colors from "./routes/colors";
import typeWorks from "./routes/typeWorks";

const app = new OpenAPIHono();

// Health check
app.get("/", (c) => {
  return c.json({ message: "Five-Four API" });
});

// Routes
app.route("/companies", companies);
app.route("/admins", admins);
app.route("/orders", orders);
app.route("/printers", printers);
app.route("/colors", colors);
app.route("/type-works", typeWorks);

// Swagger UI
app.get("/swagger", swaggerUI({ url: "/doc" }));

// OpenAPI JSON spec
app.doc("/doc", {
  openapi: "3.1.0",
  info: {
    title: "Five-Four Printing API",
    version: "1.0.0",
    description: "REST API for Five-Four Printing Shop Management",
  },
});

export default {
  port: 8080,
  fetch: app.fetch,
};

console.log("Server running on http://localhost:8080");
console.log("Swagger UI: http://localhost:8080/swagger");
