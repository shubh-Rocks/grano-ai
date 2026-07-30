import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^\+[1-9]\d{7,14}$/,
    },

    relationship: {
      type: String,
      enum: ["Mother", "Father", "Grandmother", "Grandfather", "Other family"],
      default: "Other family",
    },

    preferredLanguage: {
      type: String,
      enum: ["hi", "en"],
      default: "hi",
    },
    isActive: { type: Boolean, default: true },

    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

PatientSchema.index({ caregiverId: 1, isActive: 1 });

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);