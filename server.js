const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсингу JSON у тілі запитів
app.use(express.json());

// ==========================================
// 1. GET /api/students — Отримати всіх студентів
// ==========================================
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Помилка при отриманні списку студентів:', err.message);
        res.status(500).json({ error: 'Помилка сервера при отриманні даних' });
    }
});

// ==========================================
// 2. GET /api/students/:id — Отримати студента за ID
// ==========================================
app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Некоректний формат ID. Очікується ціле число.' });
    }

    try {
        const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Студента з ID ${id} не знайдено` });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Помилка при отриманні студента з ID ${id}:`, err.message);
        res.status(500).json({ error: 'Помилка сервера при отриманні студента' });
    }
});

// ==========================================
// 3. POST /api/students — Створити нового студента
// ==========================================
app.post('/api/students', async (req, res) => {
    const { name, age, major } = req.body;

    // Валідація обов'язкових полів
    if (!name || age === undefined || !major) {
        return res.status(400).json({
            error: "Обов'язкові поля для заповнення: name, age, major",
        });
    }

    if (typeof age !== 'number' || age <= 0) {
        return res.status(400).json({
            error: 'Вік (age) повинен бути додатним числом',
        });
    }

    try {
        const query = `
      INSERT INTO students (name, age, major)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const values = [name.trim(), age, major.trim()];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Помилка при додаванні студента:', err.message);
        res.status(500).json({ error: 'Помилка сервера при збереженні студента' });
    }
});

// ==========================================
// 4. PUT /api/students/:id — Оновити дані студента за ID
// ==========================================
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, major } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Некоректний формат ID' });
    }

    if (!name || age === undefined || !major) {
        return res.status(400).json({
            error: "Для повного оновлення потрібні всі поля: name, age, major",
        });
    }

    try {
        const query = `
      UPDATE students
      SET name = $1, age = $2, major = $3
      WHERE id = $4
      RETURNING *;
    `;
        const values = [name.trim(), age, major.trim(), id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Студента з ID ${id} не знайдено` });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Помилка при оновленні студента з ID ${id}:`, err.message);
        res.status(500).json({ error: 'Помилка сервера при оновленні даних' });
    }
});

// ==========================================
// 5. DELETE /api/students/:id — Видалити студента за ID
// ==========================================
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Некоректний формат ID' });
    }

    try {
        const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Студента з ID ${id} не знайдено` });
        }

        res.status(200).json({
            message: 'Студента успішно видалено',
            deletedStudent: result.rows[0],
        });
    } catch (err) {
        console.error(`Помилка при видаленні студента з ID ${id}:`, err.message);
        res.status(500).json({ error: 'Помилка сервера при видаленні студента' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});