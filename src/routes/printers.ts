import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const printers = db.collection("printers");

// Schemas
const PrinterSchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  name_printer: z.string().openapi({ example: "Epson L3210" }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreatePrinterSchema = z.object({
  name_printer: z.string().openapi({ example: "Epson L3210" }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Printer updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Printer ID" }),
});

// GET all
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Printers"],
    summary: "Get all printers",
    responses: {
      200: { description: "List of printers", content: { "application/json": { schema: z.array(PrinterSchema) } } },
    },
  }),
  async (c) => {
    const data = await printers.find().toArray();
    return c.json(data as any, 200);
  }
);

// GET by id
app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Printers"],
    summary: "Get a printer by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Printer found", content: { "application/json": { schema: PrinterSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await printers.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Printer not found" }, 404);
    return c.json(doc as any, 200);
  }
);

// CREATE
app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Printers"],
    summary: "Create a printer",
    request: { body: { content: { "application/json": { schema: CreatePrinterSchema } } } },
    responses: {
      201: { description: "Printer created", content: { "application/json": { schema: PrinterSchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { name_printer } = c.req.valid("json");
    if (!name_printer) return c.json({ error: "name_printer is required" }, 400);
    const result = await printers.insertOne({
      name_printer, createdAt: new Date(), updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, name_printer } as any, 201);
  }
);

// UPDATE
app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Printers"],
    summary: "Update a printer",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreatePrinterSchema.partial() } } },
    },
    responses: {
      200: { description: "Printer updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = c.req.valid("json");
    const result = await printers.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Printer not found" }, 404);
    return c.json({ message: "Printer updated" }, 200);
  }
);

// DELETE
app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Printers"],
    summary: "Delete a printer",
    request: { params: IdParam },
    responses: {
      200: { description: "Printer deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await printers.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Printer not found" }, 404);
    return c.json({ message: "Printer deleted" }, 200);
  }
);

export default app;
