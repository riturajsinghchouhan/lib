import User from '../Model/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// ================== NODEMAILER SETUP ==================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "crituraj008@gmail.com",
    pass: "tyhz vqib mbge xfrt",
  },
});

// ================== REGISTER USER ==================
export const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1. Email validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "❌ Invalid email format" });
    }

    // 2. Duplicate check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ Email already registered" });
    }

    // 3. Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user with verification token
    const token = crypto.randomBytes(32).toString("hex");
    const user = new User({
      name,
      email,
      cid,
      password: hashedPassword,
      status: 0,
      info:Date(),
      isVerified: false,
      verificationToken: token,
    });

    await user.save();

    // 5. Send verification mail
    const verifyUrl = ` https://a1544a62e7e7.ngrok-free.app/api/users/verify/${token}`;

    await transporter.sendMail({
      from: '"My App" <yourgmail@gmail.com>',
      to: email,
      subject: "Verify your email",
      html: `<h3>Welcome ${name}!</h3>
             <p>Please click below to verify your email:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    res.status(201).json({ 
      message: "✅ User registered. Check your email for verification link!" 
    });

  } catch (error) {
    console.error("❌ CreateUser Error:", error.message);
    res.status(500).json({ message: "User not created", error: error.message });
  }
};

// ================== VERIFY EMAIL ==================
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "❌ Invalid or expired token" });
    }

    user.status = 1;
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "✅ Email verified successfully!" });
  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
};

// ================== GET ALL USERS ==================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== LOGIN (FIXED) ==================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🚀 Login Attempt:", { email, password });

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    console.log("🔍 Fetched User from DB:", user);

    if (!user) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    // 2️⃣ Check if email is verified
    if (!user.isVerified || user.status !== 1) {
      return res.status(403).json({ message: "❌ Please verify your email first" });
    }

    // 3️⃣ Compare password
    // console.log("🗝 Comparing password...");
    // console.log("Entered Password:", password);
    // console.log("Hashed Password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    // 4️⃣ Generate JWT
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, "mysecretkey123", { expiresIn: "1d" });

    console.log("🎫 JWT Token Generated:", token);

    // 5️⃣ Send response (✅ FIXED TO MATCH FRONTEND EXPECTATIONS)
    res.status(200).json({
      message: "✅ Login successful",
      token: token,
      userList: {                    // ✅ Changed from 'user' to 'userList'
        _id: user._id,               // ✅ Changed from 'id' to '_id'
        name: user.name,
        email: user.email,
        cid:user.cid,
        role: user.role,             // ✅ Added missing role
        status: user.status,         // ✅ Added missing status
        info: user.info || '',       // ✅ Added missing info with fallback
      },
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

// ================== DELETE USER ==================
export const delet = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    res.status(200).json({ message: "✅ User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
