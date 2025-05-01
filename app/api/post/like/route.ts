import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const PUT = async (req: any) => {
  const body = await req.json();

  try {
    const post = await prisma.posts.update({
      where: {
        id: body.postId,
      },
      data: {
        likedBy: {
          connect: {
            id: body.userId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    // Send notification to post author if not self-like
    if (post.user.id !== body.userId) {
      const liker = await prisma.users.findUnique({ where: { id: body.userId } });
      await fetch(`/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: post.user.id,
          message: `${liker?.name || 'Someone'} liked your post.`,
          link: `/post/${post.id}`,
          type: 'like',
        }),
      });
    }

    return new NextResponse(JSON.stringify("liked"));
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify("error"));
  }
};
