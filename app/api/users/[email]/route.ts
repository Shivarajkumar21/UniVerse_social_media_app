import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  const { email } = params;
  try {
    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
      include: {
        following: true,
        savedPosts: {
          include: {
            user: true,
            likedBy: true,
            savedby: true,
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(user));
  } catch (error) {
    return new NextResponse("error");
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  const { email } = params;
  try {
    await prisma.users.delete({
      where: { email },
    });
    return new NextResponse(JSON.stringify({ success: true }));
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, error }), { status: 500 });
  }
};
