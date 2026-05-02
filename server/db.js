import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "orbit-eats.sqlite");
const schemaPath = path.join(__dirname, "schema.sql");

fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function initializeDatabase() {
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);

  const columns = db.prepare("PRAGMA table_info(restaurants)").all();
  const columnNames = new Set(columns.map((column) => column.name));
  const migrations = [
    ["description", "ALTER TABLE restaurants ADD COLUMN description TEXT NOT NULL DEFAULT ''"],
    ["address", "ALTER TABLE restaurants ADD COLUMN address TEXT NOT NULL DEFAULT ''"],
    ["menu_items", "ALTER TABLE restaurants ADD COLUMN menu_items TEXT NOT NULL DEFAULT '[]'"],
  ];

  migrations.forEach(([name, statement]) => {
    if (!columnNames.has(name)) {
      db.exec(statement);
    }
  });
}

export function mapRestaurant(row) {
  let menuItems = [];

  try {
    menuItems = JSON.parse(row.menu_items || "[]");
  } catch {
    menuItems = [];
  }

  return {
    id: row.id,
    name: row.name,
    galaxy: row.galaxy,
    cuisine: row.cuisine,
    distance: row.distance,
    deliveryTime: row.delivery_time,
    tag: row.tag,
    image: row.image,
    rating: row.rating,
    deliveryFee: row.delivery_fee,
    description: row.description,
    address: row.address,
    menuItems,
  };
}
