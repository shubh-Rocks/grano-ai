import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Current User API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
