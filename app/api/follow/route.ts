import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const PUT = async (req: any) => {
  const body = await req.json();
  console.log('FOLLOW PUT BODY:', body);
  try {
    await prisma.users.update({
      where: {
        id: body.followedById,
      },
      data: {
        following: {
          connect: {
            id: body.followedToId,
          },
        },
      },
    });

    await prisma.users.update({
      where: {
        id: body.followedToId,
      },
      data: {
        followers: {
          connect: {
            id: body.followedById,
          },
        },
      },
    });

    // Send notification to followed user
    if (body.followedById !== body.followedToId) {
      const follower = await prisma.users.findUnique({ where: { id: body.followedById } });
      await fetch(`/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: body.followedToId,
          message: `${follower?.name || 'Someone'} started following you.`,
          link: `/profile/${follower?.tag || ''}`,
          type: 'follow',
        }),
      });
    }
    return new NextResponse(JSON.stringify("followed"));
  } catch (error) {
    console.log('FOLLOW PUT ERROR:', error);
    return new NextResponse(JSON.stringify(error), { status: 403 });
  }
};

export const DELETE = async (req: any) => {
  const body = await req.json();
  try {
    await prisma.users.update({
      where: {
        id: body.fromUserId,
      },
      data: {
        following: {
          disconnect: {
            id: body.toUserId,
          },
        },
      },
    });

    await prisma.users.update({
      where: {
        id: body.toUserId,
      },
      data: {
        followers: {
          disconnect: {
            id: body.fromUserId,
          },
        },
      },
    });
    return new NextResponse(JSON.stringify("unfollowed"));
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify(error), { status: 403 });
  }
};
