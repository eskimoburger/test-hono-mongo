import { Hono } from "hono";
import companies from "./routes/companies";
import admins from "./routes/admins";
import orders from "./routes/orders";
import printers from "./routes/printers";
import colors from "./routes/colors";
import typeWorks from "./routes/typeWorks";

const app = new Hono();

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

export default {
  port: 8080,
  fetch: app.fetch,
};

console.log("Server running on http://localhost:8080");
