"use client";

import { useRecoilState } from "recoil";
import { userState } from "@/state/atoms/userState";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";

interface Notification {
  id: string;
  message: string;
  link?: string;
  createdAt: Date;
}

const Page = () => {
  const [user] = useRecoilState(userState);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user.id) return;
    
    // Initial fetch of notifications
    axios.get(`/api/notifications?userId=${user.id}`).then(res => setNotifications(res.data));

    // Subscribe to real-time notifications
    const channel = pusherClient.subscribe(`user-${user.id}-notifications`);
    
    channel.bind("new-notification", (data: string) => {
      const newNotification = JSON.parse(data);
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      pusherClient.unsubscribe(`user-${user.id}-notifications`);
    };
  }, [user.id]);

  return (
    <div className="page flex flex-col items-center justify-start p-8 min-h-screen">
      <h2 className="mb-6 text-2xl font-bold">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No Notifications</div>
      ) : (
        <div className="w-full max-w-xl space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-lg border p-2 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div>
                <p className="font-medium">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="text-blue-600 underline text-xs">View</Link>
                )}
              </div>
              <span className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
