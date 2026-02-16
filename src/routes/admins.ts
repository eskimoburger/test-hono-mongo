import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const admins = db.collection("admins");

// Schemas
const RoleEnum = z.enum(["Admin", "SuperAdmin"]);

const AdminSchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  user_name: z.string().openapi({ example: "Admin" }),
  password: z.string().openapi({ example: "1234" }),
  role: RoleEnum.openapi({ example: "Admin" }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreateAdminSchema = z.object({
  user_name: z.string().openapi({ example: "Admin" }),
  password: z.string().openapi({ example: "1234" }),
  role: RoleEnum.openapi({ example: "Admin" }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Admin updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Admin ID" }),
});

// GET all
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Admins"],
    summary: "Get all admins",
    responses: {
      200: { description: "List of admins", content: { "application/json": { schema: z.array(AdminSchema) } } },
    },
  }),
  async (c) => {
    const data = await admins.find().toArray();
    return c.json(data as any, 200);
  }
);

// GET by id
app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Admins"],
    summary: "Get an admin by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Admin found", content: { "application/json": { schema: AdminSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await admins.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Admin not found" }, 404);
    return c.json(doc as any, 200);
  }
);

// CREATE
app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Admins"],
    summary: "Create an admin",
    request: { body: { content: { "application/json": { schema: CreateAdminSchema } } } },
    responses: {
      201: { description: "Admin created", content: { "application/json": { schema: AdminSchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { user_name, password, role } = c.req.valid("json");
    if (!user_name || !password || !role) {
      return c.json({ error: "user_name, password, and role are required" }, 400);
    }
    const result = await admins.insertOne({
      user_name, password, role, createdAt: new Date(), updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, user_name, role } as any, 201);
  }
);

// UPDATE
app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Admins"],
    summary: "Update an admin",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreateAdminSchema.partial() } } },
    },
    responses: {
      200: { description: "Admin updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID or role", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = c.req.valid("json");
    if (body.role && !["Admin", "SuperAdmin"].includes(body.role)) {
      return c.json({ error: "role must be Admin or SuperAdmin" }, 400);
    }
    const result = await admins.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Admin not found" }, 404);
    return c.json({ message: "Admin updated" }, 200);
  }
);

// DELETE
app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Admins"],
    summary: "Delete an admin",
    request: { params: IdParam },
    responses: {
      200: { description: "Admin deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await admins.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Admin not found" }, 404);
    return c.json({ message: "Admin deleted" }, 200);
  }
);

export default app;
