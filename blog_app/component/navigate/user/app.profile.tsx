import React, { useEffect, useState, useMemo, useRef } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/app/store/useUserStore";
import { getUserBySlug } from "@/app/api/AuthApi";
import { removeFriendRequest, blockUser } from "@/app/api/FriendApi";
import { createChat, getChats } from "@/app/api/ChatApi";
import { setLocalStorage } from "@/app/hook/LocalStore";
const ModalUpdateUser = dynamic(
  () => import("@/component/modal/modal.update-user")
);
const ModalChangeAvatar = dynamic(
  () => import("@/component/modal/modal.change-avatar")
);
const ModalChangePassword = dynamic(
  () => import("@/component/modal/modal.change-password")
);
const ModalAccount = dynamic(
  () => import("@/component/modal/modal.custom-account")
);
const ButtonFriend = dynamic(() => import("@/component/button/button.friend"));
import { useParams } from "next/navigation";

const AppProfile = () => {
  const user = useUserStore((state) => state.user);
  const slug = useParams<{ slug: string }>().slug;
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalAvatar, setIsModalAvatar] = useState(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [isModalPassword, setIsModalPassword] = useState(false);
  const [isModalAccount, setIsModalAccount] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); // Thêm ref cho nút mở dropdown

  const { data: userData } = useQuery({
    queryKey: ["user", slug],
    queryFn: () => getUserBySlug(slug),
  });

  const customUserData = useMemo(() => userData?.data, [userData?.data]);

  const queryClient = useQueryClient();
  console.log("User ID:", user?._id);
  console.log("Custom User Data:", customUserData?._id);

  const removeFriendRequestMutation = useMutation({
    mutationFn: (data: { friend_id: string }) =>
      removeFriendRequest(data.friend_id),
  });

  const handleRemoveFriendRequest = (
    event: React.MouseEvent<HTMLButtonElement>,
    friend_id: string
  ) => {
    event.preventDefault();
    removeFriendRequestMutation.mutate(
      {
        friend_id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["friendRequests"],
          });
          alert("Đã hủy yêu cầu kết bạn.");
        },
        onError: (error) => {
          console.error("Error removing friend request:", error);
          alert("Đã có lỗi xảy ra khi hủy yêu cầu kết bạn.");
        },
      }
    );
  };

  const blockMutation = useMutation({
    mutationFn: (friend_id: string) => blockUser(friend_id),
  });

  const handleBlockUser = (
    event: React.MouseEvent<HTMLButtonElement>,
    friend_id: string
  ) => {
    event.preventDefault();
    blockMutation.mutate(friend_id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["friends"],
        });
        alert("Đã chặn người dùng.");
      },
      onError: (error) => {
        console.error("Error blocking user:", error);
        alert("Đã có lỗi xảy ra khi chặn người dùng.");
      },
    });
  };

  const createChatMutation = useMutation({
    mutationFn: (data: { members: string[] }) => createChat(data),
  });
  const userId = user?._id || "";
  const handleCreateChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (user && customUserData) {
      createChatMutation.mutate(
        {
          members: [user?._id, customUserData?._id],
        },
        {
          onSuccess: (response) => {
            console.log("Chat created successfully:", response.data);
            queryClient.invalidateQueries({
              queryKey: ["chats", userId, customUserData?._id],
            });
            setLocalStorage(
              "chat",
              JSON.stringify({
                id: customUserData?._id,
                idChat: response.data._id,
              })
            );
          },
          onError: (error) => {
            console.error("Error creating chat:", error);
            alert("Đã có lỗi xảy ra khi tạo cuộc trò chuyện.");
          },
        }
      );
      console.log("Chat created successfully");
    }
  };

  const { data: chatsData } = useQuery({
    queryKey: ["chats", userId, customUserData?._id],
    queryFn: () => {
      if (!userId || !customUserData?._id)
        throw new Error("User ID or Custom User ID is undefined");
      return getChats(userId, customUserData?._id);
    },
    enabled: !!userId && !!customUserData?._id,
  });
  const chats = useMemo(() => chatsData?.data, [chatsData?.data]);
  console.log("Chats:", chats?._id);

  // const memoizedUser = useMemo(() => user, [user]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) // kiểm tra thêm nút
      ) {
        setIsOpenDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenChat = () => {
    setLocalStorage(
      "chat",
      JSON.stringify({ id: customUserData?._id, idChat: chats?._id })
    );
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex items-center gap-4  py-5">
        <div className="flex-shrink-0 mx-5">
          {user?._id === customUserData?._id ? (
            <>
              <div>
                <button
                  title="Thay đổi ảnh đại diện"
                  onClick={() => setIsModalAvatar(true)}
                >
                  <Image
                    className="md:h-[120px] md:w-[120px] h-12 w-12 rounded-full"
                    src={customUserData?.avatar?.url || "/avatar.png"}
                    alt="avatar"
                    width={120}
                    height={120}
                    onClick={() => {
                      setIsModalAvatar(true);
                    }}
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              <Image
                src={customUserData?.avatar?.url || "/avatar.png"}
                alt="avatar"
                width={120}
                height={120}
                className="md:h-[120px] md:w-[120px] h-12 w-12 rounded-full"
              />
            </>
          )}
        </div>
        <div className="grid grid-rows-3">
          <div className="row-span-2 row-start-2 row-end-3">
            <h1 className="text-lg font-semibold">
              {customUserData?.full_name}
            </h1>
            <p className="text-sm text-gray-500">{customUserData?.email}</p>
          </div>
          <div className="row-span-1 row-start-3 row-end-4 mt-5">
            <div className="flex gap-2">
              <div>
                {" "}
                {user?._id && customUserData?._id && (
                  <ButtonFriend
                    userId={user._id}
                    customUserId={customUserData._id}
                  />
                )}
              </div>
              <div>
                {user?._id !== customUserData?._id ? (
                  <>
                    {chats?._id ? (
                      <button
                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md"
                        onClick={handleOpenChat}
                      >
                        Nhắn tin
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md"
                        onClick={(e) => handleCreateChat(e)}
                      >
                        Nhắn tin
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-auto">
          {user?._id === customUserData?._id ? (
            <button
              className="bg-gray-200 text-black text-[13px] px-4 py-2 rounded-md"
              onClick={() => setIsModalUpdate(true)}
            >
              <p>Chỉnh sửa trang cá nhân</p>
            </button>
          ) : (
            <button className="bg-gray-200 text-black text-[13px] px-4 py-2 rounded-md">
              <p>Theo dõi</p>
            </button>
          )}
        </div>
      </div>
      <div className=" border-t border-gray-200 pt-4">
        <div className="justify-between flex items-center">
          <div>
            {" "}
            <ul className="flex w-full gap-7 px-4">
              <li>
                <Link href={`/user/${slug}`} prefetch>
                  Bài viết
                </Link>
              </li>
              <li>
                <Link href={`/user/${slug}/friends`} prefetch>
                  Bạn bè
                </Link>
              </li>
              <li>
                <Link href={`/user/${slug}/saved`} prefetch>
                  Đã lưu
                </Link>
              </li>
              <li>
                <Link href={`/user/${slug}/groups`} prefetch>
                  Nhóm
                </Link>
              </li>
              <li>
                <Link href={`/user/${slug}/photos`} prefetch>
                  Ảnh
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex justify-end px-3">
            {" "}
            <button
              title="Tùy chọn"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsOpenDropDown(!isOpenDropDown)}
              ref={buttonRef} // Gán ref cho nút
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
              </svg>
            </button>
            {isOpenDropDown && (
              <div
                className="absolute right-15 z-50 mt-2 w-48 rounded-md bg-white shadow-lg"
                ref={dropdownRef}
              >
                {user?._id === customUserData?._id ? (
                  <ul className="py-1" role="menu">
                    <li
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <button
                        onClick={() => {
                          setIsModalAccount(true), setIsOpenDropDown(false);
                        }}
                      >
                        Tài khoản
                      </button>
                    </li>
                    <li
                      role="menuitem"
                      tabIndex={-1}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <button
                        onClick={() => {
                          setIsModalPassword(true), setIsOpenDropDown(false);
                        }}
                      >
                        Đổi mật khẩu
                      </button>
                    </li>
                    <li
                      role="menuitem"
                      tabIndex={-1}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Link href={`/sign-in`}>Đăng xuất</Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="py-1">
                    <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <button
                        onClick={(event) => {
                          handleBlockUser(event, customUserData._id);
                        }}
                      >
                        Chặn
                      </button>
                    </li>
                    <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <button>Báo cáo</button>
                    </li>
                    <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <button
                        onClick={(event) => {
                          handleRemoveFriendRequest(event, customUserData._id);
                        }}
                      >
                        Hủy kết bạn
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalUpdate && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          ref={modalRef}
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
          <ModalUpdateUser setIsOpenModal={setIsModalUpdate} />
        </div>
      )}
      {isModalAvatar && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          ref={modalRef}
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
          <ModalChangeAvatar setIsOpenModal={setIsModalAvatar} />
        </div>
      )}
      {isModalPassword && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          ref={modalRef}
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
          <ModalChangePassword setIsOpenModal={setIsModalPassword} />
        </div>
      )}
      {isModalAccount && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          ref={modalRef}
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
          <ModalAccount setIsOpenModal={setIsModalAccount} />
        </div>
      )}
    </div>
  );
};

export default AppProfile;
