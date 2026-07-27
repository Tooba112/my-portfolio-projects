/**
 * AdFlow Pro — Category Seed Script
 * Run: node seedCategories.js
 *
 * Clears the categories collection and inserts the 5 required default categories.
 * Does NOT touch users, gigs, orders, payments, or reviews.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./src/models/Category");

const DEFAULT_CATEGORIES = [
  "Digital Marketing",
  "SEO",
  "Web Development",
  "Graphic Design",
  "Content Writing"
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Remove all existing categories (including any with undefined/null names)
  const deleted = await Category.deleteMany({});
  console.log(`Cleared ${deleted.deletedCount} existing category record(s)`);

  // Insert the 5 required categories
  const inserted = await Category.insertMany(
    DEFAULT_CATEGORIES.map((name) => ({ name }))
  );

  console.log(`\nInserted ${inserted.length} categories:`);
  inserted.forEach((cat, i) => {
    console.log(`  ${i + 1}. ${cat.name}  (id: ${cat._id})`);
  });

  console.log("\nCategories are ready. Both dropdowns will now show:");
  DEFAULT_CATEGORIES.forEach((name) => console.log(`  - ${name}`));

  await mongoose.disconnect();
  console.log("\nDone.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Category seed failed:", err.message);
  process.exit(1);
});
