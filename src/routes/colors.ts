import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const colors = db.collection("colors");

// Schemas
const ColorSchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  name_color: z.string().openapi({ example: "CMYK" }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreateColorSchema = z.object({
  name_color: z.string().openapi({ example: "CMYK" }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Color updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Color ID" }),
});

// GET all
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Colors"],
    summary: "Get all colors",
    responses: {
      200: { description: "List of colors", content: { "application/json": { schema: z.array(ColorSchema) } } },
    },
  }),
  async (c) => {
    const data = await colors.find().toArray();
    return c.json(data as any, 200);
  }
);

// GET by id
app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Colors"],
    summary: "Get a color by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Color found", content: { "application/json": { schema: ColorSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await colors.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Color not found" }, 404);
    return c.json(doc as any, 200);
  }
);

// CREATE
app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Colors"],
    summary: "Create a color",
    request: { body: { content: { "application/json": { schema: CreateColorSchema } } } },
    responses: {
      201: { description: "Color created", content: { "application/json": { schema: ColorSchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { name_color } = c.req.valid("json");
    if (!name_color) return c.json({ error: "name_color is required" }, 400);
    const result = await colors.insertOne({
      name_color, createdAt: new Date(), updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, name_color } as any, 201);
  }
);

// UPDATE
app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Colors"],
    summary: "Update a color",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreateColorSchema.partial() } } },
    },
    responses: {
      200: { description: "Color updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = c.req.valid("json");
    const result = await colors.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Color not found" }, 404);
    return c.json({ message: "Color updated" }, 200);
  }
);

// DELETE
app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Colors"],
    summary: "Delete a color",
    request: { params: IdParam },
    responses: {
      200: { description: "Color deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await colors.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Color not found" }, 404);
    return c.json({ message: "Color deleted" }, 200);
  }
);

export default app;
