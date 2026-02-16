import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new OpenAPIHono();
const db = await connectDB();
const orders = db.collection("orders");

// Schemas
const OrderSchema = z.object({
  _id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1" }),
  id_company: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d2" }),
  customer_name: z.string().openapi({ example: "Somchai Jaidee" }),
  phone: z.string().nullable().openapi({ example: "0812345678" }),
  email: z.string().nullable().openapi({ example: "somchai@email.com" }),
  line: z.string().nullable().openapi({ example: "somchai_line" }),
  address: z.string().nullable().openapi({ example: "123 Sukhumvit Rd, Bangkok" }),
  start_date: z.string().nullable().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  end_date: z.string().nullable().openapi({ example: "2026-02-20T00:00:00.000Z" }),
  type_work: z.string().nullable().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d3" }),
  count_work: z.number().openapi({ example: 500 }),
  detail_work: z.string().nullable().openapi({ example: "Business Card 2 sides CMYK" }),
  file: z.string().nullable().openapi({ example: "namecard.pdf" }),
  createdAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2026-02-16T00:00:00.000Z" }),
});

const CreateOrderSchema = z.object({
  id_company: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d2" }),
  customer_name: z.string().openapi({ example: "Somchai Jaidee" }),
  phone: z.string().optional().openapi({ example: "0812345678" }),
  email: z.string().optional().openapi({ example: "somchai@email.com" }),
  line: z.string().optional().openapi({ example: "somchai_line" }),
  address: z.string().optional().openapi({ example: "123 Sukhumvit Rd, Bangkok" }),
  start_date: z.string().optional().openapi({ example: "2026-02-16" }),
  end_date: z.string().optional().openapi({ example: "2026-02-20" }),
  type_work: z.string().optional().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d3" }),
  count_work: z.number().optional().openapi({ example: 500 }),
  detail_work: z.string().optional().openapi({ example: "Business Card 2 sides CMYK" }),
  file: z.string().optional().openapi({ example: "namecard.pdf" }),
});

const ErrorSchema = z.object({
  error: z.string().openapi({ example: "Error message" }),
});

const MessageSchema = z.object({
  message: z.string().openapi({ example: "Order updated" }),
});

const IdParam = z.object({
  id: z.string().openapi({ example: "67b1a2b3c4d5e6f7a8b9c0d1", description: "Order ID" }),
});

// GET all
app.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Orders"],
    summary: "Get all orders",
    responses: {
      200: { description: "List of orders", content: { "application/json": { schema: z.array(OrderSchema) } } },
    },
  }),
  async (c) => {
    const data = await orders.find().toArray();
    return c.json(data as any, 200);
  }
);

// GET by id
app.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Orders"],
    summary: "Get an order by ID",
    request: { params: IdParam },
    responses: {
      200: { description: "Order found", content: { "application/json": { schema: OrderSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const doc = await orders.findOne({ _id: new ObjectId(id) });
    if (!doc) return c.json({ error: "Order not found" }, 404);
    return c.json(doc as any, 200);
  }
);

// CREATE
app.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Orders"],
    summary: "Create an order",
    request: { body: { content: { "application/json": { schema: CreateOrderSchema } } } },
    responses: {
      201: { description: "Order created", content: { "application/json": { schema: OrderSchema.partial() } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");
    if (!body.customer_name || !body.id_company) {
      return c.json({ error: "id_company and customer_name are required" }, 400);
    }
    const result = await orders.insertOne({
      id_company: new ObjectId(body.id_company),
      customer_name: body.customer_name,
      phone: body.phone || null,
      email: body.email || null,
      line: body.line || null,
      address: body.address || null,
      start_date: body.start_date ? new Date(body.start_date) : null,
      end_date: body.end_date ? new Date(body.end_date) : null,
      type_work: body.type_work || null,
      count_work: body.count_work || 0,
      detail_work: body.detail_work || null,
      file: body.file || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return c.json({ _id: result.insertedId, customer_name: body.customer_name } as any, 201);
  }
);

// UPDATE
app.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    tags: ["Orders"],
    summary: "Update an order",
    request: {
      params: IdParam,
      body: { content: { "application/json": { schema: CreateOrderSchema.partial() } } },
    },
    responses: {
      200: { description: "Order updated", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const body: Record<string, any> = { ...c.req.valid("json") };
    if (body.id_company) body.id_company = new ObjectId(body.id_company);
    if (body.start_date) body.start_date = new Date(body.start_date);
    if (body.end_date) body.end_date = new Date(body.end_date);
    const result = await orders.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return c.json({ error: "Order not found" }, 404);
    return c.json({ message: "Order updated" }, 200);
  }
);

// DELETE
app.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Orders"],
    summary: "Delete an order",
    request: { params: IdParam },
    responses: {
      200: { description: "Order deleted", content: { "application/json": { schema: MessageSchema } } },
      400: { description: "Invalid ID", content: { "application/json": { schema: ErrorSchema } } },
      404: { description: "Not found", content: { "application/json": { schema: ErrorSchema } } },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);
    const result = await orders.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return c.json({ error: "Order not found" }, 404);
    return c.json({ message: "Order deleted" }, 200);
  }
);

export default app;
