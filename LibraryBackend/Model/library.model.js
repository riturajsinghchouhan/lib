import mongoose from "mongoose";

const LibrarySchema = new mongoose.Schema({
  Bookname: { type: String, required: true, trim: true },
  Authorname: { type: String, required: true, trim: true },
  Studentname: { type: String, required: true, trim: true },
  StudentEmail: { type: String, required: true, trim: true }, // ✅ new field
  Price: { type: Number, required: true, min: [1, "Price must be positive"] },
  IssueDate: { type: Date, default: Date.now },
  ReturnDate: { type: Date },
  DurationInMonths: { type: Number, default: 1 },
  Status: { type: String, enum: ["Pending", "Submitted"], default: "Pending" }
});


// Auto calculate ReturnDate
LibrarySchema.pre("save", function (next) {
  if (!this.ReturnDate) {
    let returnDate = new Date(this.IssueDate);
    returnDate.setMonth(returnDate.getMonth() + this.DurationInMonths);
    this.ReturnDate = returnDate;
  }
  next();
});

export default mongoose.model("Library", LibrarySchema);
