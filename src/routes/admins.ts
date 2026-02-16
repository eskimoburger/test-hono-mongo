import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { connectDB } from "../db";

const app = new Hono();
const db = await connectDB();
const admins = db.collection("admins");

// GET all
app.get("/", async (c) => {
  const data = await admins.find().toArray();
  return c.json(data);
});

// GET by id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const doc = await admins.findOne({ _id: new ObjectId(id) });
  if (!doc) return c.json({ error: "Admin not found" }, 404);

  return c.json(doc);
});

// CREATE
app.post("/", async (c) => {
  const { user_name, password, role } = await c.req.json();

  if (!user_name || !password || !role) {
    return c.json({ error: "user_name, password, and role are required" }, 400);
  }

  if (!["Admin", "SuperAdmin"].includes(role)) {
    return c.json({ error: "role must be Admin or SuperAdmin" }, 400);
  }

  const result = await admins.insertOne({
    user_name,
    password,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ _id: result.insertedId, user_name, role }, 201);
});

// UPDATE
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();

  if (body.role && !["Admin", "SuperAdmin"].includes(body.role)) {
    return c.json({ error: "role must be Admin or SuperAdmin" }, 400);
  }

  const result = await admins.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) return c.json({ error: "Admin not found" }, 404);
  return c.json({ message: "Admin updated" });
});

// DELETE
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) return c.json({ error: "Invalid ID" }, 400);

  const result = await admins.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return c.json({ error: "Admin not found" }, 404);

  return c.json({ message: "Admin deleted" });
});

export default app;
