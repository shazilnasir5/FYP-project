
const bcrypt = require("bcryptjs");

async function createSellerTable(pool) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS sellers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function findByEmail(pool, email) {
  const [rows] = await pool.execute(
    "SELECT id, name, email FROM sellers WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

// Find seller with password hash for login
async function findByEmailForLogin(pool, email) {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password FROM sellers WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

async function create(pool, { name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 12);

  const [result] = await pool.execute(
    "INSERT INTO sellers (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  return {
    id: result.insertId,
    name,
    email
  };
}

module.exports = {
  createSellerTable,
  findByEmail,
  findByEmailForLogin,
  create
};
