import express from "express";
import { Save, Show, UpdateStatus,fetchUserBooks } from "../controler/library.controller.js";

const r = express.Router();

r.post('/save', Save);               // Issue Book
r.get('/get', Show);                 // Show all issued books
//r.get('/issued', fetchAllBooks);     // Fetch all issued (sorted by date)
r.patch('/status/:id', UpdateStatus); // Update book status (Pending → Submitted)
r.get('/user-books/:email', fetchUserBooks);

export default r;
