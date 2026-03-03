import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const units = db.collection("units");

const UnitSchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  name_unit: z.string().openapi({ example: "แผ่น" }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreateUnitSchema = z.object({
  name_unit: z.string().openapi({ example: "แผ่น" }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Unit updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Unit ID" }),
});

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Units"],
    summary: "Get all units",
    responses: {
      200: { description: "List of units", content: { "application/json": { schema: z.array(UnitSchema) } } },
    },
  }),
  async (c) => {
    const data = await units.find().toArray();
    return c.json(data as any, 200);
  }
);

app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Units"],
    summary: "Get a unit by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Unit found", content: { "application/json": { schema: UnitSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await units.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Unit not found" }, 404);
    return c.json(doc as any, 200);
  }
);

app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Units"],
    summary: "Create a unit",
    request: { body: { content: { "application/json": { schema: CreateUnitSchema } } } },
    responses: {
      201: { description: "Unit created", content: { "application/json": { schema: UnitSchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { name_unit } = c.req.valid("json");
    if (!name_unit) return c.json({ error: "name_unit is required" }, 400);
    const result = await units.insertOne({
      name_unit, createdAt: new Date(), updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, name_unit } as any, 201);
  }
);

app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Units"],
    summary: "Update a unit",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreateUnitSchema.partial() } } },
    },
    responses: {
      200: { description: "Unit updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = c.req.valid("json");
    const result = await units.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Unit not found" }, 404);
    return c.json({ message: "Unit updated" }, 200);
  }
);

app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Units"],
    summary: "Delete a unit",
    request: { params: IdParam },
    responses: {
      200: { description: "Unit deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await units.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Unit not found" }, 404);
    return c.json({ message: "Unit deleted" }, 200);
  }
);

export default app;
