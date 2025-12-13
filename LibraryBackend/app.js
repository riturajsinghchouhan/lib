import express from 'express';
import cors from 'cors';
import connectDb from "./connection/connection.js";
import userRouter from "./router/user.router.js"; 
import libRouter from "./router/library.router.js";
import bookRouters from "./router/BookRoutes.js"
const app = express();
// Connect to MongoDB
connectDb();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});
// Routes
app.use("/api/users", userRouter);
app.use("/library",libRouter);
app.use("/api/books",bookRouters);
// Start server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
