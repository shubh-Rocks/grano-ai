import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/Patient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const caregiverId = searchParams.get("caregiverId");

    if (!caregiverId) {
      return NextResponse.json(
        { error: "Missing caregiverId query parameter" },
        { status: 400 },
      );
    }

    await connectDB();

    const patients = await Patient.find({ caregiverId }).lean();

    const safePatients = patients.map((patient) => ({
      id: patient._id.toString(),
      name: patient.name,
      phone: patient.phone,
      relationship: patient.relationship,
      preferredLanguage: patient.preferredLanguage,
      isActive: patient.isActive,
      notes: patient.notes,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }));

    return NextResponse.json(safePatients, { status: 200 });
  } catch (error) {
    console.error("Patients API GET error:", error);
    return NextResponse.json(
      { error: "Unable to load patients" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { caregiverId, name, phone, relationship, preferredLanguage, notes } = body;

    if (!caregiverId || !name || !phone) {
      return NextResponse.json(
        { error: "caregiverId, name, and phone are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const patient = await Patient.create({
      caregiverId,
      name,
      phone,
      relationship: relationship || "Other family",
      preferredLanguage: preferredLanguage || "hi",
      notes: notes || "",
      isActive: true,
    });

    const responsePayload = {
      id: patient._id.toString(),
      name: patient.name,
      phone: patient.phone,
      relationship: patient.relationship,
      preferredLanguage: patient.preferredLanguage,
      isActive: patient.isActive,
      notes: patient.notes,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error) {
    console.error("Patients API POST error:", error);
    return NextResponse.json(
      { error: "Unable to create patient" },
      { status: 500 },
    );
  }
}
