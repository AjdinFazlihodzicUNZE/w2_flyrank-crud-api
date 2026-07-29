require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDb() {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN DEFAULT false
    )
  `);

  const res = await pool.query('SELECT COUNT(*) FROM tasks');
  const count = parseInt(res.rows[0].count, 10);


  if (count === 0) {
    await pool.query(`
      INSERT INTO tasks (title, done)
      VALUES 
        ('Ajdin', false),
        ('Dzejlan', false),
        ('Medin', false)
    `);
    console.log('Database created with 3 default tasks.');
  }
}

module.exports = { pool, initDb };