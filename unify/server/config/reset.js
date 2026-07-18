import { pool } from './db.js'
import './dotenv.js'
import categoryData from './data/categories.js'

const createUsersTable = async () => {
  const createTableQuery = `
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            bio TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `

  try {
    const res = await pool.query(createTableQuery)
    console.log('✅ users table created successfully')
  } catch (err) {
    console.error('❌ error creating users table:', err)
  }
}

const createCategoriesTable = async () => {
  const createTableQuery = `
        DROP TABLE IF EXISTS categories;

        CREATE TABLE categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
    `

  try {
    const res = await pool.query(createTableQuery)
    console.log('✅ categories table created successfully')
  } catch (err) {
    console.error('❌ error creating categories table:', err)
  }
}

const seedCategoriesTable = async () => {
  const insertQuery = `
        INSERT INTO categories (name)
        VALUES ($1);
    `
  categoryData.forEach((category) => {
    const values = [category.name]
    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error('⚠️ error inserting category', err)
      } else {
        console.log(`✅ category "${category.name}" added successfully`)
      }
    })
  })
}

const createEventsTable = async () => {
  const createTableQuery = `
        DROP TABLE IF EXISTS events;

        CREATE TABLE events (
            id SERIAL PRIMARY KEY,
            host_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            category_id INT REFERENCES categories(id) ON DELETE SET NULL,
            title VARCHAR(150) NOT NULL,
            details TEXT,
            event_date TIMESTAMPTZ NOT NULL,
            location VARCHAR(255) NOT NULL,
            max_capacity INT (max_capacity IS NULL OR max_capacity > 0),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `
  try {
    const res = await pool.query(createTableQuery)
    console.log('✅ events table created successfully')
  } catch (err) {
    console.error('❌ error creating events table:', err)
  }
}

const createRsvpsTable = async () => {
  const createTableQuery = `
        DROP TABLE IF EXISTS rsvps;

        CREATE TABLE rsvps (
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
            status VARCHAR(20) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            PRIMARY KEY (user_id, event_id)
        );
    `
  try {
    const res = await pool.query(createTableQuery)
    console.log('✅ rsvps table created successfully')
  } catch (err) {
    console.error('❌ error creating rsvps table:', err)
  }
}
