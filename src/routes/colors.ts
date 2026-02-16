import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new Hono();
const db = await connectDB();
const colors = db.collection("colors");

// GET all
app.get("/", async (c) => {
  const data = await colors.find().toArray();
  return c.json(data);
});

// GET by id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const doc = await colors.findOne({ _id: new ObjectId(id) });
  if (!doc) return c.json({ error: "Color not found" }, 404);

  return c.json(doc);
});

// CREATE
app.post("/", async (c) => {
  const { name_color } = await c.req.json();

  if (!name_color) {
    return c.json({ error: "name_color is required" }, 400);
  }

  const result = await colors.insertOne({
    name_color,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ _id: result.insertedId, name_color }, 201);
});

// UPDATE
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();
  const result = await colors.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) return c.json({ error: "Color not found" }, 404);
  return c.json({ message: "Color updated" });
});

// DELETE
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const result = await colors.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return c.json({ error: "Color not found" }, 404);

  return c.json({ message: "Color deleted" });
});

export default app;
