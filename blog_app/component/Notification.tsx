import React, { useEffect, useState } from "react";
import useUserStore from "@/app/store/useUserStore";
import socket from "@/app/utils/socket";
import { getNotifications } from "@/app/api/NotificationApi"; // Import your API functions if needed

export default function Notification() {
  const user = useUserStore((state) => state.user);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user?._id) return;

    // Join room
    socket.emit("joinUser", user._id);

    // Nhận notification mới
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    // Nhận event mark read
    socket.on("notification_read", (id) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    });

    socket.on("notification_read_all", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });

    // Fetch ban đầu từ API
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(user._id);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    return () => {
      socket.off("notification");
      socket.off("notification_read");
      socket.off("notification_read_all");
    };
  }, [user?._id]);
  console.log("Notifications:", notifications);

  return (
    <div className="w-full h-full py-10 flex flex-col gap-4 items-center justify-start bg-gray-900 dark:bg-white">
      <div className="md:text-4xl sm:text-3xl text-2xl text-center font-serif font-extrabold border-b-2 dark:border-blue-500 rounded-b-md mb-6 border-yellow-500 text-white dark:text-black">
        Notifications
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600 text-center">
          Không có thông báo nào
        </p>
      ) : (
        <div className="flex flex-col gap-4 w-full sm:w-[70%]">
          {notifications.map((n, i) => (
            <div
              key={i}
              className="sm:w-[100%] w-[94%] mx-auto dark:bg-gray-300 bg-gray-700 p-4 rounded-md flex sm:gap-4 gap-2 items-center justify-center"
            >
              <img
                src="https://lh3.googleusercontent.com/a/ACg8ocIexhmmTS8LcwWo1fPGY5Fl3KXpd-JuBE_Gj56P3rUR2g=s96-c"
                alt="profile"
                className="w-[5rem] object-cover h-[5rem]  outline-2 outline-blue-400 dark:outline-teal-400/20 rounded-full"
              />
              <div className="w-[80%] flex flex-col gap-1">
                <div className="text-lg font-semibold font-serif text-white dark:text-black">
                  {n.type === "message"
                    ? "Tin nhắn mới"
                    : n.type === "like"
                    ? "Ai đó đã like bài viết"
                    : "Ai đó đã favorite bài viết"}
                </div>
                {n.text && (
                  <p className="text-sm dark:text-gray-600 text-gray-300">
                    {n.text}
                  </p>
                )}
                <p className="text-[12px] font-semibold dark:text-gray-700 text-gray-400 text-right">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
