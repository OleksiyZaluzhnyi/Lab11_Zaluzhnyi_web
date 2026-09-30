-- Створення таблиці students
CREATE TABLE IF NOT EXISTS students (
                                        id SERIAL PRIMARY KEY,
                                        name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0),
    major VARCHAR(100) NOT NULL
    );

-- Наповнення початковими записами
INSERT INTO students (name, age, major) VALUES
                                            ('John Doe', 20, 'Computer Science'),
                                            ('Jane Smith', 22, 'Mathematics'),
                                            ('Alice Johnson', 21, 'Physics'),
                                            ('Bob Brown', 23, 'Engineering');