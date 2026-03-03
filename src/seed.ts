import { connectDB } from "./db";

const db = await connectDB();
const admins = db.collection("admins");
const units = db.collection("units");
const printTypes = db.collection("print_types");

const defaultAdmins = [
  { user_name: "Admin", password: "1234", role: "Admin" },
  { user_name: "SuperAdmin", password: "4321", role: "SuperAdmin" },
];

const defaultUnits = [
  { name_unit: "แผ่น" },
  { name_unit: "เล่ม" },
  { name_unit: "ชิ้น" },
  { name_unit: "ใบ" },
];

const defaultPrintTypes = [
  { name_print_type: "Digital" },
  { name_print_type: "Offset" },
  { name_print_type: "Inkjet" },
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

for (const unit of defaultUnits) {
  const exists = await units.findOne({ name_unit: unit.name_unit });
  if (!exists) {
    await units.insertOne({ ...unit, createdAt: new Date(), updatedAt: new Date() });
    console.log(`Created unit: ${unit.name_unit}`);
  } else {
    console.log(`Unit already exists: ${unit.name_unit}`);
  }
}

for (const printType of defaultPrintTypes) {
  const exists = await printTypes.findOne({ name_print_type: printType.name_print_type });
  if (!exists) {
    await printTypes.insertOne({ ...printType, createdAt: new Date(), updatedAt: new Date() });
    console.log(`Created print type: ${printType.name_print_type}`);
  } else {
    console.log(`Print type already exists: ${printType.name_print_type}`);
  }
}

console.log("Seed complete.");
process.exit(0);
