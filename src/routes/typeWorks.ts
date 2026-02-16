import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const typeWorks = db.collection("type_works");

// Schemas
const TypeWorkSchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  name_tw: z.string().openapi({ example: "Business Card" }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreateTypeWorkSchema = z.object({
  name_tw: z.string().openapi({ example: "Business Card" }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Type Work updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Type Work ID" }),
});

// GET all
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Type Works"],
    summary: "Get all type works",
    responses: {
      200: { description: "List of type works", content: { "application/json": { schema: z.array(TypeWorkSchema) } } },
    },
  }),
  async (c) => {
    const data = await typeWorks.find().toArray();
    return c.json(data as any, 200);
  }
);

// GET by id
app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Type Works"],
    summary: "Get a type work by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Type Work found", content: { "application/json": { schema: TypeWorkSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await typeWorks.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Type Work not found" }, 404);
    return c.json(doc as any, 200);
  }
);

// CREATE
app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Type Works"],
    summary: "Create a type work",
    request: { body: { content: { "application/json": { schema: CreateTypeWorkSchema } } } },
    responses: {
      201: { description: "Type Work created", content: { "application/json": { schema: TypeWorkSchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { name_tw } = c.req.valid("json");
    if (!name_tw) return c.json({ error: "name_tw is required" }, 400);
    const result = await typeWorks.insertOne({
      name_tw, createdAt: new Date(), updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, name_tw } as any, 201);
  }
);

// UPDATE
app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Type Works"],
    summary: "Update a type work",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreateTypeWorkSchema.partial() } } },
    },
    responses: {
      200: { description: "Type Work updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = c.req.valid("json");
    const result = await typeWorks.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Type Work not found" }, 404);
    return c.json({ message: "Type Work updated" }, 200);
  }
);

// DELETE
app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Type Works"],
    summary: "Delete a type work",
    request: { params: IdParam },
    responses: {
      200: { description: "Type Work deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await typeWorks.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Type Work not found" }, 404);
    return c.json({ message: "Type Work deleted" }, 200);
  }
);

export default app;
