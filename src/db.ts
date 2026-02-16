// Fix SRV DNS resolution on Windows
// Source - https://stackoverflow.com/a/79874273
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "test-hono-mongo";

const client = new MongoClient(uri);

let db: Db;

export async function connectDB(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB: ${dbName}`);
  }
  return db;
}

export { db, client };
