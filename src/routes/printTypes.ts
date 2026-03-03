import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const printTypes = db.collection("print_types");

const PrintTypeSchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  name_print_type: z.string().openapi({ example: "Digital" }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreatePrintTypeSchema = z.object({
  name_print_type: z.string().openapi({ example: "Digital" }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Print type updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Print Type ID" }),
});

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Print Types"],
    summary: "Get all print types",
    responses: {
      200: { description: "List of print types", content: { "application/json": { schema: z.array(PrintTypeSchema) } } },
    },
  }),
  async (c) => {
    const data = await printTypes.find().toArray();
    return c.json(data as any, 200);
  }
);

app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Print Types"],
    summary: "Get a print type by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Print type found", content: { "application/json": { schema: PrintTypeSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await printTypes.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Print type not found" }, 404);
    return c.json(doc as any, 200);
  }
);

app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Print Types"],
    summary: "Create a print type",
    request: { body: { content: { "application/json": { schema: CreatePrintTypeSchema } } } },
    responses: {
      201: { description: "Print type created", content: { "application/json": { schema: PrintTypeSchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { name_print_type } = c.req.valid("json");
    if (!name_print_type) return c.json({ error: "name_print_type is required" }, 400);
    const result = await printTypes.insertOne({
      name_print_type, createdAt: new Date(), updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, name_print_type } as any, 201);
  }
);

app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Print Types"],
    summary: "Update a print type",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreatePrintTypeSchema.partial() } } },
    },
    responses: {
      200: { description: "Print type updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = c.req.valid("json");
    const result = await printTypes.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Print type not found" }, 404);
    return c.json({ message: "Print type updated" }, 200);
  }
);

app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Print Types"],
    summary: "Delete a print type",
    request: { params: IdParam },
    responses: {
      200: { description: "Print type deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await printTypes.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Print type not found" }, 404);
    return c.json({ message: "Print type deleted" }, 200);
  }
);

export default app;
