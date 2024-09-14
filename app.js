import express from "express";
import sequelize from "./config/db.js";
import Book from "./models/book.js";

const app = express();
const PORT = 3000;

// Middleware для обработки JSON
app.use(express.json());

// GET-запрос для получения всех книг
app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении книг" });
  }
});

// POST-запрос для создания новой книги
app.post("/books", async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const newBook = await Book.create({ title, author, year });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании книги" });
  }
});

// PUT-запрос для обновления книги по ID
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  try {
    const book = await Book.findByPk(id);
    if (book) {
      book.title = title;
      book.author = author;
      book.year = year;
      await book.save();
      res.json(book);
    } else {
      res.status(404).json({ error: "Книга не найдена" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении книги" });
  }
});

// DELETE-запрос для удаления книги по ID
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (book) {
      await book.destroy();
      res.json({ message: "Книга удалена" });
    } else {
      res.status(404).json({ error: "Книга не найдена" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении книги" });
  }
});

// Запуск сервера
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных установлено");
  } catch (error) {
    console.error("Не удалось подключиться к базе данных:", error);
  }
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
