import { generateToken, verifyPassword } from "@/lib/auth";
import { connectDB as dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email & Password is required or not valid",
        },
        { status: 400 },
      );
    }

    // 1. Database Connection Ensure Karein
    await dbConnect();

    // 2. User Find Karein (Password by default hidden hota hai schema me, isliye .select("+password") zaroori hai)
    const userFromDb = await User.findOne({ email }).select("+password");

    if (!userFromDb) {
      return NextResponse.json(
        { message: "Invalid user not found" },
        { status: 401 },
      );
    }

    // 3. Password Verify Karein
    const isValidPassword = await verifyPassword(password, userFromDb.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 4. Token Generate Karein
    const token = await generateToken(userFromDb);

    const response = NextResponse.json({
      user: {
        id: userFromDb._id.toString(),
        name: userFromDb.name,
        email: userFromDb.email,
        image: userFromDb.image,
        emailVerified: userFromDb.emailVerified,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
