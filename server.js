const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432, // Default PostgreSQL port
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EagleHacks API!" });
});

// Fetch menu items from PostgreSQL
app.get("/menu", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Place an order and store in PostgreSQL
app.post("/order", async (req, res) => {
  const { item, quantity } = req.body;

  if (!item || !quantity) {
    return res.status(400).json({ message: "Please provide item and quantity" });
  }

  try {
    await pool.query("INSERT INTO orders (item, quantity) VALUES ($1, $2)", [item, quantity]);

    res.status(201).json({
      message: "Order received!",
      order: { item, quantity },
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
