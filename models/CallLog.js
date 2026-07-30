import mongoose from "mongoose";

const CallLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
      index: true,
    },

    scheduledFor: { type: Date, required: true },

    callAnswered: { type: Boolean, required: true, default: false },

    medicineTaken: {
      type: String,
      enum: ["yes", "no", "uncertain", "not_applicable"],
      default: "not_applicable",
    },

    confidence: {
      type: String,
      enum: ["high", "low", "not_applicable"],
      default: "not_applicable",
    },

    summary: { type: String, trim: true, default: "" },

    vapiCallId: { type: String, default: null },
    durationSeconds: { type: Number, default: 0 },
    attemptNumber: { type: Number, default: 1 },

    rawTranscript: { type: String, default: "" },
  },
  { timestamps: true }
);

CallLogSchema.index({ patientId: 1, scheduledFor: -1 });
CallLogSchema.index({ medicineId: 1, scheduledFor: -1 });

export default mongoose.models.CallLog || mongoose.model("CallLog", CallLogSchema);