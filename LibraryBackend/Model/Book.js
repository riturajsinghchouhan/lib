import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  slot: { type: String, required: true },   // Example: A1, B3
  rack: { type: String, required: true },   // Example: Rack 1, Rack 2
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 }
});

export default mongoose.model("Book", bookSchema);
