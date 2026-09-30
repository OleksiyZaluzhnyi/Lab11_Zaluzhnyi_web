const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Перевірка з'єднання при запуску
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Помилка підключення до PostgreSQL:', err.stack);
    }
    console.log('Успішне підключення до бази даних PostgreSQL');
    release();
});

module.exports = pool;