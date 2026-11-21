
async function createProductTable(pool) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      seller_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image VARCHAR(500) DEFAULT '',
      category VARCHAR(100) DEFAULT 'General',
      stock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES sellers(id)
        ON DELETE CASCADE
    )
  `);
}

// Add Product
async function create(pool, product) {
  const {
    seller_id,
    name,
    description = '',
    price,
    image = '',
    category = 'General',
    stock = 0
  } = product;

  const [result] = await pool.execute(
    `INSERT INTO products
    (seller_id, name, description, price, image, category, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [seller_id, name, description, price, image, category, stock]
  );

  return { id: result.insertId, ...product };
}

// View Seller Products
async function findBySeller(pool, sellerId) {
  const [rows] = await pool.execute(
    'SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC',
    [sellerId]
  );

  return rows;
}

// Count Seller Products
async function countBySeller(pool, sellerId) {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM products WHERE seller_id = ?',
    [sellerId]
  );

  return rows[0].total;
}

// Update Product
async function update(pool, productId, sellerId, product) {
  const {
    name,
    description,
    price,
    image,
    category,
    stock
  } = product;

  const [result] = await pool.execute(
    `UPDATE products
     SET name = ?, description = ?, price = ?,
         image = ?, category = ?, stock = ?
     WHERE id = ? AND seller_id = ?`,
    [
      name,
      description,
      price,
      image,
      category,
      stock,
      productId,
      sellerId
    ]
  );

  return result.affectedRows > 0;
}

// Delete Product
async function remove(pool, productId, sellerId) {
  const [result] = await pool.execute(
    'DELETE FROM products WHERE id = ? AND seller_id = ?',
    [productId, sellerId]
  );

  return result.affectedRows > 0;
}

module.exports = {
  createProductTable,
  create,
  findBySeller,
  countBySeller,
  update,
  remove
};
