import { connectDB } from "./db";

const db = await connectDB();
const admins = db.collection("admins");

const defaultAdmins = [
  { user_name: "Admin", password: "1234", role: "Admin" },
  { user_name: "SuperAdmin", password: "4321", role: "SuperAdmin" },
];

for (const admin of defaultAdmins) {
  const exists = await admins.findOne({ user_name: admin.user_name });
  if (!exists) {
    await admins.insertOne({ ...admin, createdAt: new Date(), updatedAt: new Date() });
    console.log(`Created admin: ${admin.user_name}`);
  } else {
    console.log(`Admin already exists: ${admin.user_name}`);
  }
}

console.log("Seed complete.");
process.exit(0);
