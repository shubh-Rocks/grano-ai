import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },

    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },

    phone: { type: String, trim: true, default: null },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "users" }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);