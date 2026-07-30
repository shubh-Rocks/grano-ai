import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true }, // e.g. "Metformin"

    time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    appearance: { type: String, required: true, trim: true }, // e.g. "small white round tablet"
    dosageInstructions: { type: String, required: true, trim: true }, // e.g. "1 tablet after breakfast"

    dosageAmount: { type: String, trim: true, default: "" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MedicineSchema.index({ patientId: 1, isActive: 1 });

export default mongoose.models.Medicine || mongoose.model("Medicine", MedicineSchema);