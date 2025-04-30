import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: any) => {
  try {
    const user = await req.json();
    
    // Check if user with email already exists
    const existingUser = await prisma.users.findFirst({
      where: { email: user.email }
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 });
    }

    // Create new user
    const createUser = await prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        usn: user.usn || null,
        password: await bcrypt.hash(user.password, 10),
        imageUrl: user.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010",
        about: user.about || "Student at the university",
        tag: user.tag || user.usn || user.email.split("@")[0] + Math.floor(Math.random() * 1000),
      },
    });

    return new NextResponse(JSON.stringify("Created New Account"));
  } catch (error) {
    console.error("Signup error:", error);
    return new NextResponse("Failed to create account", { status: 500 });
  }
};
