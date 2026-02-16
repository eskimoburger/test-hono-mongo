import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new Hono();
const db = await connectDB();
const companies = db.collection("companies");

// GET all
app.get("/", async (c) => {
  const data = await companies.find().toArray();
  return c.json(data);
});

// GET by id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const doc = await companies.findOne({ _id: new ObjectId(id) });
  if (!doc) return c.json({ error: "Company not found" }, 404);

  return c.json(doc);
});

// CREATE
app.post("/", async (c) => {
  const { company, tax, count } = await c.req.json();

  if (!company) {
    return c.json({ error: "company is required" }, 400);
  }

  const result = await companies.insertOne({
    company,
    tax: tax || null,
    count: count || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ _id: result.insertedId, company, tax, count }, 201);
});

// UPDATE
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();
  const result = await companies.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) return c.json({ error: "Company not found" }, 404);
  return c.json({ message: "Company updated" });
});

// DELETE
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const result = await companies.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return c.json({ error: "Company not found" }, 404);

  return c.json({ message: "Company deleted" });
});

export default app;
