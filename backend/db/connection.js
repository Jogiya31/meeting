const sql = require("mssql");
const config = require("../config/dbconfig.js"); // Import the database configuration

let pool;

const connectToDatabase = async () => {
  try {
    if (!pool) {
      pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log("✅ Connected to SQL Server");
    }
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = { connectToDatabase, sql, getPool: () => pool };
