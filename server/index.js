import cors from "cors";
import express from "express";
import crypto from "node:crypto";
import { db, initializeDatabase, mapRestaurant } from "./db.js";
import { seedRestaurants } from "./seed.js";

const app = express();
const port = Number(process.env.PORT || 5174);

initializeDatabase();
seedRestaurants();

app.use(cors());
app.use(express.json());

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(hashPassword(password, salt).split(":")[1], "hex")
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function makeToken(user) {
  return Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64url");
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/restaurants", (req, res) => {
  const search = String(req.query.search || "").trim().toLowerCase();
  const galaxy = String(req.query.galaxy || "").trim();
  const cuisine = String(req.query.cuisine || "").trim();
  const tag = String(req.query.tag || "").trim();
  const maxDistance = Number(req.query.maxDistance || 0);
  const maxDelivery = Number(req.query.maxDelivery || 0);
  const sort = String(req.query.sort || "recommended");
  const filters = [];
  const params = {};

  if (search) {
    filters.push(`(
      lower(name) LIKE @search OR
      lower(galaxy) LIKE @search OR
      lower(cuisine) LIKE @search OR
      lower(tag) LIKE @search
    )`);
    params.search = `%${search}%`;
  }

  if (galaxy) {
    filters.push("galaxy = @galaxy");
    params.galaxy = galaxy;
  }

  if (cuisine) {
    filters.push("cuisine = @cuisine");
    params.cuisine = cuisine;
  }

  if (tag) {
    filters.push("tag = @tag");
    params.tag = tag;
  }

  if (maxDistance > 0) {
    filters.push("CAST(distance AS REAL) <= @maxDistance");
    params.maxDistance = maxDistance;
  }

  if (maxDelivery > 0) {
    filters.push("CAST(delivery_time AS INTEGER) <= @maxDelivery");
    params.maxDelivery = maxDelivery;
  }

  const sortSql = {
    recommended: "rating DESC, name ASC",
    rating: "rating DESC, name ASC",
    deliveryFee: "delivery_fee ASC, rating DESC",
    distance: "CAST(distance AS REAL) ASC, rating DESC",
    deliveryTime: "CAST(delivery_time AS INTEGER) ASC, rating DESC",
    name: "name ASC",
  }[sort] || "rating DESC, name ASC";

  const rows = db.prepare(`
    SELECT *
    FROM restaurants
    ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
    ORDER BY ${sortSql}
  `).all(params);
  const restaurants = rows.map(mapRestaurant);

  res.json({ restaurants });
});

app.get("/api/restaurants/meta", (_req, res) => {
  const distinct = (column) => db
    .prepare(`SELECT DISTINCT ${column} AS value FROM restaurants ORDER BY value ASC`)
    .all()
    .map((row) => row.value);

  res.json({
    galaxies: distinct("galaxy"),
    cuisines: distinct("cuisine"),
    tags: distinct("tag"),
  });
});

app.get("/api/restaurants/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM restaurants WHERE id = ?").get(id);

  if (!row) {
    res.status(404).json({ error: "Restaurant not found." });
    return;
  }

  res.json({ restaurant: mapRestaurant(row) });
});

app.post("/api/auth/signup", (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!name || !email || password.length < 4) {
    res.status(400).json({ error: "Name, email, and a 4+ character password are required." });
    return;
  }

  try {
    const result = db
      .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
      .run(name, email, hashPassword(password));
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ user: publicUser(user), token: makeToken(user) });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.status(409).json({ error: "An account with that email already exists." });
      return;
    }

    res.status(500).json({ error: "Could not create account." });
  }
});

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: "Email or password did not match." });
    return;
  }

  res.json({ user: publicUser(user), token: makeToken(user) });
});

app.get("/api/order/sample", (_req, res) => {
  res.json({
    store: "Orbit Diner",
    address: "123 Orbit Ave, Houston, TX 77002",
    phone: "(281) 555-4821",
    payment: "Visa ending in 8267",
    items: [
      { name: "Galactic Burger", price: 23.0, quantity: 1 },
      { name: "Moon Fries", price: 6.5, quantity: 1 },
      { name: "Nebula Soda", price: 4.5, quantity: 1 },
    ],
    tax: 2.81,
    serviceFee: 1.75,
    deliveryFee: 3.49,
    savings: 0,
  });
});

app.post("/api/orders", (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const customerName = String(req.body.customerName || "Guest").trim();
  const email = String(req.body.email || "guest@orbiteats.local").trim();
  const phone = String(req.body.phone || "(000) 000-0000").trim();
  const deliveryAddress = String(req.body.deliveryAddress || "123 Orbit Ave, Houston, TX").trim();
  const paymentMethod = String(req.body.paymentMethod || "card").trim();
  const tip = Number(req.body.tip || 0);
  const deliveryFee = Number(req.body.deliveryFee || 3.49);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const serviceFee = 1.75;
  const total = Number((subtotal + tax + serviceFee + deliveryFee + tip).toFixed(2));

  const createOrder = db.transaction(() => {
    const orderResult = db
      .prepare(`
        INSERT INTO orders
          (customer_name, email, phone, delivery_address, payment_method, subtotal, tax, service_fee, delivery_fee, tip, total)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(customerName, email, phone, deliveryAddress, paymentMethod, subtotal, tax, serviceFee, deliveryFee, tip, total);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, name, quantity, price)
      VALUES (?, ?, ?, ?)
    `);

    items.forEach((item) => {
      insertItem.run(
        orderResult.lastInsertRowid,
        String(item.name || "Menu item"),
        Number(item.quantity || 1),
        Number(item.price || 0)
      );
    });

    return orderResult.lastInsertRowid;
  });

  const orderId = createOrder();
  res.status(201).json({ orderId, total });
});

app.listen(port, () => {
  console.log(`Orbit Eats API running on http://localhost:${port}`);
});
