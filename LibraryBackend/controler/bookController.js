import Book from "../Model/Book.js";

// ➤ Add new book
export const addBook = async (req, res) => {
  try {
    const { title, author, slot, rack, totalCopies } = req.body;

    const book = new Book({
      title,
      author,
      slot,
      rack,
      totalCopies,
      availableCopies: totalCopies // default same as total
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully", data: book });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
};

// ➤ Fetch all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// ➤ Update available copies when issued/returned
export const updateCopies = async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body; // +1 for return, -1 for issue

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (change === -1 && book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    book.availableCopies += change;
    await book.save();

    res.json({ message: "Copies updated", data: book });
  } catch (error) {
    res.status(500).json({ message: "Error updating copies", error });
  }
};
