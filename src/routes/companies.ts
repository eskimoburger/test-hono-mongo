import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const companies = db.collection("companies");

// Schemas
const CompanySchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  company: z.string().openapi({ example: "ABC Co., Ltd." }),
  tax: z.string().nullable().openapi({ example: "0105561234567" }),
  count: z.number().openapi({ example: 0 }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreateCompanySchema = z.object({
  company: z.string().openapi({ example: "ABC Co., Ltd." }),
  tax: z.string().nullable().optional().openapi({ example: "0105561234567" }),
  count: z.number().optional().openapi({ example: 0 }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Company updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Company ID" }),
});

// GET all
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Companies"],
    summary: "Get all companies",
    responses: {
      200: { description: "List of companies", content: { "application/json": { schema: z.array(CompanySchema) } } },
    },
  }),
  async (c) => {
    const data = await companies.find().toArray();
    return c.json(data as any, 200);
  }
);

// GET by id
app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Companies"],
    summary: "Get a company by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Company found", content: { "application/json": { schema: CompanySchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await companies.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Company not found" }, 404);
    return c.json(doc as any, 200);
  }
);

// CREATE
app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Companies"],
    summary: "Create a company",
    request: { body: { content: { "application/json": { schema: CreateCompanySchema } } } },
    responses: {
      201: { description: "Company created", content: { "application/json": { schema: CompanySchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { company, tax, count } = c.req.valid("json");
    if (!company) return c.json({ error: "company is required" }, 400);
    const result = await companies.insertOne({
      company, tax: tax || null, count: count || 0, createdAt: new Date(), updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, company, tax, count } as any, 201);
  }
);

// UPDATE
app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Companies"],
    summary: "Update a company",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreateCompanySchema.partial() } } },
    },
    responses: {
      200: { description: "Company updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body = c.req.valid("json");
    const result = await companies.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Company not found" }, 404);
    return c.json({ message: "Company updated" }, 200);
  }
);

// DELETE
app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Companies"],
    summary: "Delete a company",
    request: { params: IdParam },
    responses: {
      200: { description: "Company deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await companies.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Company not found" }, 404);
    return c.json({ message: "Company deleted" }, 200);
  }
);

export default app;
