"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useSyncLocalStorage, setLocalStorage } from "@/app/hook/LocalStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/app/store/useUserStore";
import { createChat, getChats } from "@/app/api/ChatApi";
import { getMessages, createMessage } from "@/app/api/MessageApi";
import { getUserById } from "@/app/api/AuthApi";
import { send } from "process";
import { t } from "i18next";

const AppContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isChat, setIsChat] = useState(false);
  const user = useUserStore((state) => state.user);
  const [message, setMessages] = useState({
    chatId: "",
    senderId: user?._id || "",
    text: "",
  });

  const chatLocal = useSyncLocalStorage("chat");

  const parsedChat =
    (typeof chatLocal === "string" && chatLocal.trim() !== ""
      ? (() => {
          try {
            return JSON.parse(chatLocal);
          } catch (err) {
            console.error("Invalid JSON:", err);
            return {};
          }
        })()
      : typeof chatLocal === "object" && chatLocal !== null
      ? chatLocal
      : {}) || {}; // fallback luôn là {}

  const { id: customUserId, idChat: chats } = parsedChat;

  const queryClient = useQueryClient();

  const { data: customUserData } = useQuery({
    queryKey: ["user", customUserId],
    queryFn: () => {
      if (!customUserId) throw new Error("User ID is undefined");
      return getUserById(customUserId);
    },
    enabled: !!customUserId,
  });
  const customUser = useMemo(
    () => customUserData?.data,
    [customUserData?.data]
  );

  console.log("messages:", message);

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessages((prev) => ({
      ...prev,
      chatId: chats || "",
      text: e.target.value,
    }));
  };

  const messageMutation = useMutation({
    mutationFn: (data: { chatId: string; senderId: string; text: string }) =>
      createMessage(data),
  });

  const handleSendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      messageMutation.mutate(
        {
          chatId: message.chatId,
          senderId: message.senderId,
          text: message.text,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["messages", chats],
            });

            setMessages((prev) => ({
              ...prev,
              text: "",
            }));
          },
        }
      );
    }
  };

  const { data: messagesData } = useQuery({
    queryKey: ["messages", chats],
    queryFn: () => {
      if (!chats) throw new Error("Chat ID is undefined");
      return getMessages(chats);
    },
    enabled: !!chats,
  });
  const messages = useMemo(() => messagesData?.data, [messagesData?.data]);
  const handleOffChat = () => {
    setLocalStorage("chat", JSON.stringify({}));
  };

  return (
    <div className="fixed bottom-0 right-4 w-[250px]">
      {customUserId && (
        <div
          className={`transition-transform duration-300 ease-in-out transform
      ${customUserId ? "translate-y-0" : "translate-y-full"}`}
        >
          {isChat ? (
            <div className="bg-white p-2 rounded-t-lg shadow-md">
              <div className="flex justify-between items-center mb-1">
                <div className="flex">
                  <Image
                    src={customUser?.avatar?.url || "/avatar.png"}
                    className="w-8 h-8 rounded-full"
                    alt=""
                    width={32}
                    height={32}
                  />{" "}
                  <span className="text-[12px] pt-2 ml-2">
                    {customUser?.full_name}
                  </span>
                </div>
                <div>
                  <button
                    className="text-gray-500 hover:text-gray-700 mr-2"
                    onClick={() => setIsChat(!isChat)}
                  >
                    x
                  </button>
                </div>{" "}
              </div>

              <div>
                {messages?.length > 0 ? (
                  <div className="h-[200px] overflow-y-auto">
                    {messages.map((message: any) => (
                      <div
                        key={message._id}
                        className={`p-2 rounded-md mb-2 ${
                          message.senderId === user?._id
                            ? "bg-blue-100 text-blue-800 flex justify-start"
                            : "bg-gray-100 text-gray-800 flex justify-end"
                        }`}
                      >
                        <p className="text-[12px]">{message.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No messages yet</p>
                )}
              </div>
              <div className="flex justify-between items-center border-t border-gray-200">
                <input
                  type="text"
                  name="text"
                  placeholder=".."
                  value={message.text}
                  className="border-none outline-none ml-2 flex-1 w-[70px]"
                  onChange={handleChangeMessage}
                  onKeyDown={handleSendMessage}
                  autoComplete="off"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                title="User Avatar"
                className="relative group"
                onClick={() => setIsChat(!isChat)}
              >
                {/* Avatar */}
                <Image
                  src={customUser?.avatar?.url || "/avatar.png"}
                  className="w-8 h-8 rounded-full"
                  alt=""
                  width={32}
                  height={32}
                />

                {/* Nút X đè lên avatar */}
                <div
                  className="absolute -top-1 -left-1  bg-gray-800 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full shadow-md cursor-pointer invisible group-hover:visible"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn không cho bấm X bị trigger avatar
                    handleOffChat();
                  }}
                >
                  x
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sidebar người liên hệ */}
      <div className="my-2 flex justify-end">
        {isOpen === false ? (
          <div className="flex items-center bg-white rounded-full shadow-md m-2.5 p-1.5 w-[35px]">
            <button
              title="Toggle Contact"
              onClick={() => setIsOpen(true)}
              className="w-full"
            >
              {/* icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 
              1.123 2.994 2.707 3.227 1.129.166 2.27.293 
              3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 
              1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 
              3.423-.379c1.584-.233 2.707-1.626 
              2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 
              48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 
              3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="sidebar px-2.5 py-2.5 flex justify-between bg-white rounded-md shadow-md mx-2.5 w-[250px]">
            <p className="font-light text-neutral-500 line-clamp-3">
              Người liên hệ
            </p>
            <div className="flex gap-2">
              {/* Search + Menu */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 
              5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 
              12.452 4.391l3.328 3.329a.75.75 0 
              1 1-1.06 1.06l-3.329-3.328A7 7 0 
              0 1 2 9Z"
                  clipRule="evenodd"
                />
              </svg>
              <button
                title="Toggle Menu"
                onClick={() => setIsOpenMenu(!isOpenMenu)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    d="M3 10a1.5 1.5 0 1 1 3 0 1.5 
                1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 
                1 1 3 0 1.5 1.5 0 0 1-3 
                0ZM15.5 8.5a1.5 1.5 0 1 0 0 
                3 1.5 1.5 0 0 0 0-3Z"
                  />
                </svg>
              </button>
              {isOpenMenu && (
                <div className="absolute right-0 p-2.5 bg-white rounded-md shadow-md bottom-10">
                  <button
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      setIsOpenMenu(false);
                    }}
                  >
                    <p>Menu</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppContact;
