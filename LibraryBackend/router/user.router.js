import express from "express";
import { createUser, getUsers, login, verifyEmail } from "../controler/user.controller.js";

const router = express.Router();

router.post("/createUser", createUser);
router.get("/fetch", getUsers);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);

export default router;
