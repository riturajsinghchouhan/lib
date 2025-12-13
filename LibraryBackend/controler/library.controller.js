import Library from '../Model/library.model.js'
import Book from '../Model/Book.js';  // Book model import

// ✅ Issue Book (Save)
export const Save = async (req, res) => {
  try {
    const LibData = req.body;

    // Book check
    const book = await Book.findOne({ title: LibData.Bookname, author: LibData.Authorname });
    if (!book) {
      return res.status(404).json({ message: "Book not found in system" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available!" });
    }

    // Save Library record
    const lib = new Library(LibData);
    await lib.save();

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ message: "Book issued successfully", data: lib });
  } catch (error) {
    res.status(500).json({ message: "Book not issued", error });
  }
};

// ✅ Fetch all issued books (no cid now)
// export const fetchAllBooks = async (req, res) => {
//   try {
//     const userbook = await Library.find().sort({ IssueDate: -1 });
//     res.json(userbook);
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     res.status(500).json({ message: "Failed to load books" });
//   }
// };


// 📌 Get books issued by a specific student (by email)
// 📌 Get books issued by a specific student (by email)
export const fetchUserBooks = async (req, res) => {
  try {
    const { email } = req.params;
    const userBooks = await Library.find({ StudentEmail: email }).sort({ IssuedDate: -1 }); // ✅ fix
    res.json(userBooks);
  } catch (error) {
    console.error("Error fetching user books:", error);
    res.status(500).json({ message: "Failed to load books" });
  }
};


// ✅ Update Status (Return/Submitted)
export const UpdateStatus = async (req, res) => {
  try {
    const { Status } = req.body;
    const { id } = req.params;

    const updated = await Library.findByIdAndUpdate(
      id,
      { Status: Status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Library record not found" });
    }

    // 🔑 If returned → increase availableCopies
    if (Status === "Submitted") {
      await Book.findOneAndUpdate(
        { title: updated.Bookname, author: updated.Authorname },
        { $inc: { availableCopies: 1 } }
      );
    }

    res.status(200).json({ message: "Status updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};

// ✅ Show all issued records
export const Show = async (req, res) => {
  try {
    const lib = await Library.find();
    res.status(200).json(lib);
  } catch (error) {
    res.status(500).json({ message: "No data available", error });
  }
};
