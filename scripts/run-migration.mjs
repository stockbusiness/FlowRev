#!/usr/bin/env node
// Usage: SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/run-migration.mjs [migration-file]

import { readFileSync } from "fs";
import { resolve } from "path";

const token     = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = "vexsxlimmqhhmvhcwuuc";
const file      = process.argv[2] ?? "supabase/migrations/20260519000005_products_purchases.sql";

if (!token) {
  console.error("Error: SUPABASE_ACCESS_TOKEN env var is required");
  console.error("Get it from: https://supabase.com/dashboard/account/tokens");
  process.exit(1);
}

const sql = readFileSync(resolve(file), "utf8");

console.log(`Running migration: ${file}`);
console.log(`Project: ${projectRef}`);

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const body = await res.json().catch(() => res.text());

if (!res.ok) {
  console.error("Migration failed:", res.status);
  console.error(body);
  process.exit(1);
}

console.log("Migration completed successfully!");
if (body && typeof body === "object") {
  console.log("Result:", JSON.stringify(body, null, 2));
}
