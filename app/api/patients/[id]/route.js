import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/Patient";

export async function GET(request, { params }) {
  try {
    const id = String(params?.id || "").trim();

    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Missing or invalid patient id" },
        { status: 400 },
      );
    }

    await connectDB();

    const patient = await Patient.findById(id).lean();
    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        id: patient._id.toString(),
        name: patient.name,
        phone: patient.phone,
        relationship: patient.relationship,
        preferredLanguage: patient.preferredLanguage,
        isActive: patient.isActive,
        notes: patient.notes,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Patient detail API error:", error);
    return NextResponse.json(
      { error: "Unable to load patient detail" },
      { status: 500 },
    );
  }
}
