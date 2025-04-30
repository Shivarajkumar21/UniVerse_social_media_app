import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    // Find the OTP
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(), // Check if OTP is not expired
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Delete the used OTP
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
} 