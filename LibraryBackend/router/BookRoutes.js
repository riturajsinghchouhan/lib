import express from "express";
import { addBook, getBooks, updateCopies } from "../controler/bookController.js";

const router = express.Router();

router.post("/add", addBook);      // Admin adds a new book
router.get("/all", getBooks);      // Get all books
router.patch("/copies/:id", updateCopies); // Update available copies (issue/return)

export default router;
