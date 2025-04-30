import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const notifications = await prisma.notification.findMany({
    where: { userId: userId! },
    orderBy: { createdAt: "desc" },
  });

  return new NextResponse(JSON.stringify(notifications));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, message, link } = body;

  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      link,
    },
  });

  // Trigger real-time notification
  await pusherServer.trigger(
    `user-${userId}-notifications`,
    "new-notification",
    JSON.stringify(notification)
  );

  return new NextResponse(JSON.stringify(notification));
} 