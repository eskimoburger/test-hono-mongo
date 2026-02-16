import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new Hono();
const db = await connectDB();
const orders = db.collection("orders");

// GET all
app.get("/", async (c) => {
  const data = await orders.find().toArray();
  return c.json(data);
});

// GET by id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const doc = await orders.findOne({ _id: new ObjectId(id) });
  if (!doc) return c.json({ error: "Order not found" }, 404);

  return c.json(doc);
});

// CREATE
app.post("/", async (c) => {
  const {
    id_company,
    customer_name,
    phone,
    email,
    line,
    address,
    start_date,
    end_date,
    type_work,
    count_work,
    detail_work,
    file,
  } = await c.req.json();

  if (!customer_name || !id_company) {
    return c.json({ error: "id_company and customer_name are required" }, 400);
  }

  const result = await orders.insertOne({
    id_company: new ObjectId(id_company),
    customer_name,
    phone: phone || null,
    email: email || null,
    line: line || null,
    address: address || null,
    start_date: start_date ? new Date(start_date) : null,
    end_date: end_date ? new Date(end_date) : null,
    type_work: type_work || null,
    count_work: count_work || 0,
    detail_work: detail_work || null,
    file: file || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ _id: result.insertedId, customer_name }, 201);
});

// UPDATE
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();

  if (body.id_company) body.id_company = new ObjectId(body.id_company);
  if (body.start_date) body.start_date = new Date(body.start_date);
  if (body.end_date) body.end_date = new Date(body.end_date);

  const result = await orders.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) return c.json({ error: "Order not found" }, 404);
  return c.json({ message: "Order updated" });
});

// DELETE
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const result = await orders.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return c.json({ error: "Order not found" }, 404);

  return c.json({ message: "Order deleted" });
});

export default app;
