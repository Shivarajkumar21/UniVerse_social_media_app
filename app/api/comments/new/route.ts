import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  const body = await req.json();
  try {
    const comment = await prisma.comments.create({
      data: {
        postId: body.id,
        UserEmail: body.email,
        text: body.text,
      },
      include: {
        user: true,
      },
    });

    // Get the post and author
    const post = await prisma.posts.findUnique({
      where: { id: body.id },
      include: { user: true },
    });
    if (post && post.user.email !== body.email) {
      await fetch(`/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: post.user.id,
          message: `${comment.user.name || 'Someone'} commented on your post.`,
          link: `/post/${post.id}?tab=comments`,
          type: 'comment',
        }),
      });
    }
    return new NextResponse(JSON.stringify(comment));
  } catch (error) {
    return new NextResponse(JSON.stringify("error"));
  }
};
