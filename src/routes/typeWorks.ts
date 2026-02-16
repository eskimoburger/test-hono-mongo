import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new Hono();
const db = await connectDB();
const typeWorks = db.collection("type_works");

// GET all
app.get("/", async (c) => {
  const data = await typeWorks.find().toArray();
  return c.json(data);
});

// GET by id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const doc = await typeWorks.findOne({ _id: new ObjectId(id) });
  if (!doc) return c.json({ error: "Type Work not found" }, 404);

  return c.json(doc);
});

// CREATE
app.post("/", async (c) => {
  const { name_tw } = await c.req.json();

  if (!name_tw) {
    return c.json({ error: "name_tw is required" }, 400);
  }

  const result = await typeWorks.insertOne({
    name_tw,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ _id: result.insertedId, name_tw }, 201);
});

// UPDATE
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();
  const result = await typeWorks.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) return c.json({ error: "Type Work not found" }, 404);
  return c.json({ message: "Type Work updated" });
});

// DELETE
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const result = await typeWorks.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return c.json({ error: "Type Work not found" }, 404);

  return c.json({ message: "Type Work deleted" });
});

export default app;
