import mongoose from "mongoose";

const userDetail = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, default: "user" },  // admin/user
    status: { type: Number, default: 0 },     // 0 = not verified, 1 = verified
    info: String,
    cid:Number,
    // ✅ Extra fields for verification
    verificationToken: String,
    isVerified: { type: Boolean, default: false }
});

export default mongoose.model("User", userDetail);
