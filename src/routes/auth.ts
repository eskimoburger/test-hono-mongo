import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { sign } from "hono/jwt";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const admins = db.collection("admins");

const JWT_SECRET = process.env.JWT_SECRET || "five-four-secret";

const LoginSchema = z.object({
  user_name: z.string().openapi({ example: "Admin" }),
  password: z.string().openapi({ example: "1234" }),
});

const TokenSchema = z.object({
  token: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIs..." }),
  user: z.object({
    _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
    user_name: z.string().openapi({ example: "Admin" }),
    role: z.string().openapi({ example: "Admin" }),
  }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

// LOGIN
app.openapi(
  createRoute({
    method: "post",
    path: "/login",
    tags: ["Auth"],
    summary: "Login and get JWT token",
    request: { body: { content: { "application/json": { schema: LoginSchema } } } },
    responses: {
      200: { description: "Login successful", content: { "application/json": { schema: TokenSchema } } },
      400: { description: "Missing fields", content: { "application/json": { schema: ErrorSchema } } },
      401: { description: "Invalid credentials", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { user_name, password } = c.req.valid("json");

    if (!user_name || !password) {
      return c.json({ error: "user_name and password are required" }, 400);
    }

    const admin = await admins.findOne({ user_name, password });

    if (!admin) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const payload = {
      sub: admin._id.toString(),
      user_name: admin.user_name,
      role: admin.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    };

    const token = await sign(payload, JWT_SECRET, "HS256");

    return c.json({
      token,
      user: {
        _id: admin._id.toString(),
        user_name: admin.user_name,
        role: admin.role,
      },
    }, 200);
  }
);

export default app;
