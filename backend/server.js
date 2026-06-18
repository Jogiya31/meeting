const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./db/connection");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", apiRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Node.js SQL Server API is running!");
});

// Start server and DB
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Closing SQL Server connection...");
  const pool = require("./db/connect").getPool();
  if (pool) await pool.close();
  console.log("✅ Connection closed. Exiting...");
  process.exit(0);
});
