import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new Hono();
const db = await connectDB();
const printers = db.collection("printers");

// GET all
app.get("/", async (c) => {
  const data = await printers.find().toArray();
  return c.json(data);
});

// GET by id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const doc = await printers.findOne({ _id: new ObjectId(id) });
  if (!doc) return c.json({ error: "Printer not found" }, 404);

  return c.json(doc);
});

// CREATE
app.post("/", async (c) => {
  const { name_printer } = await c.req.json();

  if (!name_printer) {
    return c.json({ error: "name_printer is required" }, 400);
  }

  const result = await printers.insertOne({
    name_printer,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ _id: result.insertedId, name_printer }, 201);
});

// UPDATE
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();
  const result = await printers.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) return c.json({ error: "Printer not found" }, 404);
  return c.json({ message: "Printer updated" });
});

// DELETE
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const result = await printers.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return c.json({ error: "Printer not found" }, 404);

  return c.json({ message: "Printer deleted" });
});

export default app;
