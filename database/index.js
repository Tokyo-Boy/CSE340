const { Pool } = require("pg")
require("dotenv").config()

console.log("Current DATABASE_URL:", process.env.DATABASE_URL ? "Exists" : "MISSING")

let pool

if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} else {
  // PRODUCTION (Render)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}