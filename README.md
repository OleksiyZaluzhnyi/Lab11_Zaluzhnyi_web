# University Students REST API

RESTful API для управління базою даних студентів університету, розроблений на базі **Node.js**, **Express** та реляційної СУБД **PostgreSQL**.

---

## 🛠 Технологічний стек

- **Runtime:** Node.js
- **Фреймворк:** Express.js
- **База даних:** PostgreSQL
- **Драйвер БД:** `pg` (node-postgres)
- **Управління конфігурацією:** `dotenv`
- **Інструменти розробки:** `nodemon`

---

## 📁 Структура проекту

```text
university-api/
├── node_modules/
├── sql/
│   └── setup.sql        # Скрипти створення таблиць та наповнення даними
├── .env                 # Конфіденційні змінні оточення (не комітити в Git)
├── .gitignore           # Список ігнорованих Git файлів
├── db.js                # Налаштування пулу з'єднань до PostgreSQL
├── package.json         # Маніфест залежностей та скриптів
├── README.md            # Документація проекту
└── server.js            # Точка входу, маршрути та бізнес-логіка
```

---

## 🚀 Початок роботи

### 1. Передумови

Переконайтеся, що на вашому комп'ютері встановлено:
- **Node.js** (версія 16.x або новіша)
- **npm** (йде в комплекті з Node.js)
- **PostgreSQL** (версія 12 або новіша)

---

### 2. Клонування та встановлення залежностей

1. Перейдіть до кореневої папки проекту:
   ```bash
   cd university-api
   ```

2. Встановіть необхідні npm-пакети:
   ```bash
   npm install
   ```

---

### 3. Налаштування бази даних PostgreSQL

#### Варіант А: Через термінал (`psql`)

1. Увійдіть у клієнт `psql` (під користувачем за замовчуванням `postgres`):
   ```bash
   psql -U postgres
   ```

2. Створіть базу даних `university`:
   ```sql
   CREATE DATABASE university;
   \q
   ```

3. Виконайте SQL-скрипт ініціалізації таблиці та тестових даних:
   ```bash
   psql -U postgres -d university -f sql/setup.sql
   ```

#### Варіант Б: Через pgAdmin

1. Відкрийте **pgAdmin** та підключіться до вашого сервера PostgreSQL.
2. Створіть нову базу даних з назвою `university` (правою кнопкою на *Databases* -> *Create* -> *Database*).
3. Відкрийте створену базу `university`, відкрийте інструмент **Query Tool** (кнопка на панелі або через контекстне меню).
4. Скопіюйте вміст файлу `sql/setup.sql`, вставте у вікно редактора та натисніть кнопку **Execute (F5)**.

---

### 4. Налаштування змінних середовища (`.env`)

Створіть файл `.env` у кореневій директорії проекту (на основі `.env.example`):

```bash
cp .env.example .env
```

Вкажіть актуальні облікові дані для підключення до вашої PostgreSQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=university
```

---

### 5. Запуск сервера

- **Звичайний запуск:**
  ```bash
  npm start
  ```

- **Режим розробки з автоперезапуском (nodemon):**
  ```bash
  npm run dev
  ```

Сервер стане доступним за адресою: `http://localhost:3000`.

---

## 📡 Документація REST API

Базовий URL: `http://localhost:3000/api`

### Огляд ендпоінтів

| Метод | URL | Опис |
| :--- | :--- | :--- |
| `GET` | `/api/students` | Отримати повний список студентів |
| `GET` | `/api/students/:id` | Отримати конкретного студента за його `id` |
| `POST` | `/api/students` | Додати нового студента |
| `PUT` | `/api/students/:id` | Повністю оновити дані студента за `id` |
| `DELETE`| `/api/students/:id` | Видалити студента за `id` |

---

### Деталі маршрутів

#### 1. Отримати всіх студентів
- **Метод:** `GET`
- **Маршрут:** `/api/students`
- **Коди відповідей:**
  - `200 OK` — Успішне отримання списку.
  - `500 Internal Server Error` — Помилка підключення або запиту до БД.
- **Приклад відповіді (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "age": 20,
      "major": "Computer Science"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "age": 22,
      "major": "Mathematics"
    }
  ]
  ```

---

#### 2. Отримати студента за ID
- **Метод:** `GET`
- **Маршрут:** `/api/students/:id`
- **Параметри:** `id` (ціле число)
- **Коди відповідей:**
  - `200 OK` — Студента знайдено.
  - `400 Bad Request` — `id` не є числом.
  - `404 Not Found` — Студента із зазначеним `id` не існує.
- **Приклад відповіді (`200 OK`):**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "age": 20,
    "major": "Computer Science"
  }
  ```

---

#### 3. Додати нового студента
- **Метод:** `POST`
- **Маршрут:** `/api/students`
- **Заголовки:** `Content-Type: application/json`
- **Тіло запиту (Body):**
  ```json
  {
    "name": "Danylo Halytskyi",
    "age": 19,
    "major": "Software Engineering"
  }
  ```
- **Коди відповідей:**
  - `201 Created` — Запис успішно створено.
  - `400 Bad Request` — Відсутні обов'язкові поля або некоректний вік.
- **Приклад відповіді (`201 Created`):**
  ```json
  {
    "id": 5,
    "name": "Danylo Halytskyi",
    "age": 19,
    "major": "Software Engineering"
  }
  ```

---

#### 4. Оновити студента
- **Метод:** `PUT`
- **Маршрут:** `/api/students/:id`
- **Заголовки:** `Content-Type: application/json`
- **Тіло запиту (Body):**
  ```json
  {
    "name": "Danylo Halytskyi",
    "age": 20,
    "major": "Cybersecurity"
  }
  ```
- **Коди відповідей:**
  - `200 OK` — Дані успішно оновлено.
  - `400 Bad Request` — Некоректні вхідні дані або ID.
  - `404 Not Found` — Студента з таким ID не існує.
- **Приклад відповіді (`200 OK`):**
  ```json
  {
    "id": 5,
    "name": "Danylo Halytskyi",
    "age": 20,
    "major": "Cybersecurity"
  }
  ```

---

#### 5. Видалити студента
- **Метод:** `DELETE`
- **Маршрут:** `/api/students/:id`
- **Коди відповідей:**
  - `200 OK` — Запис видалено.
  - `400 Bad Request` — Некоректний формат ID.
  - `404 Not Found` — Студента з таким ID не існує.
- **Приклад відповіді (`200 OK`):**
  ```json
  {
    "message": "Студента успішно видалено",
    "deletedStudent": {
      "id": 5,
      "name": "Danylo Halytskyi",
      "age": 20,
      "major": "Cybersecurity"
    }
  }
  ```

---

## 🧪 Тестування за допомогою cURL

Команди для швидкої перевірки з терміналу:

```bash
# 1. Отримати всіх
curl -X GET http://localhost:3000/api/students

# 2. Отримати по ID
curl -X GET http://localhost:3000/api/students/1

# 3. Створити
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Max Power","age":21,"major":"Robotics"}'

# 4. Оновити
curl -X PUT http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe Updated","age":21,"major":"AI"}'

# 5. Видалити
curl -X DELETE http://localhost:3000/api/students/1
```