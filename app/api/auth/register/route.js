// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashPassword, generateToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { z } from "zod";
import { connectDB as dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: z.flattenError
            ? z.flattenError(result.error)
            : result.error.format(),
        },
        { status: 400 },
      );
    }

    const { name, email, password, phone } = result.data;

    await dbConnect();

    // 2. Email check (Mongoose .findOne)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    if (phone && phone.trim() !== "") {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return NextResponse.json(
          { error: "Phone number already registered" },
          { status: 409 },
        );
      }
    }

    // 4. Password Hash Karna
    const hashedPassword = await hashPassword(password);

    // 5. Naya User Create Karna (Mongoose Model)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone && phone.trim() !== "" ? phone : null,
      image: null,
      emailVerified: null,
    });

    // 6. JWT Token Generate Karna
    const token = await generateToken(user);

    // 7. Cookie Store me Token Set Karna
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
      path: "/",
    });

    return NextResponse.json(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
