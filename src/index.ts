import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { connectDB } from "./db";

const app = new Hono();

// Connect to MongoDB on startup
const db = await connectDB();
const posts = db.collection("posts");

// Health check
app.get("/", (c) => {
  return c.json({ message: "Hono + MongoDB API" });
});

// GET all posts
app.get("/posts", async (c) => {
  const allPosts = await posts.find().toArray();
  return c.json(allPosts);
});

// GET single post
app.get("/posts/:id", async (c) => {
  const id = c.req.param("id");

  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const post = await posts.findOne({ _id: new ObjectId(id) });

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

// CREATE post
app.post("/posts", async (c) => {
  const body = await c.req.json();
  const { title, content } = body;

  if (!title || !content) {
    return c.json({ error: "title and content are required" }, 400);
  }

  const result = await posts.insertOne({
    title,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ _id: result.insertedId, title, content }, 201);
});

// UPDATE post
app.put("/posts/:id", async (c) => {
  const id = c.req.param("id");

  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const body = await c.req.json();
  const { title, content } = body;

  const result = await posts.updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, content, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json({ message: "Post updated" });
});

// DELETE post
app.delete("/posts/:id", async (c) => {
  const id = c.req.param("id");

  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const result = await posts.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json({ message: "Post deleted" });
});

export default {
  port: 8080,
  fetch: app.fetch,
};

console.log("Server running on http://localhost:8080");
