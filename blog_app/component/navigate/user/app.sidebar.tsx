"use client";
import React, { useEffect, useRef, useState, lazy } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useUserStore, { User } from "@/app/store/useUserStore";
import { useShallow } from "zustand/shallow";

import CreatePostModal from "@/component/modal/create-post.modal";
import ThemeToggle from "@/component/ThemeToggle";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}
const AppSidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();
  // const { user } = useUserStore<UserStore>(
  //   useShallow((state) => ({
  //     user: state.user,
  //     setUser: state.setUser,
  //   }))
  // );
  const onLogout = () => {
    router.push("/sign-in");
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useUserStore.getState().setUser(null);
  };

  const user = useUserStore((state) => state.user);

  const userRouter = user?.full_name.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="sidebar">
      <ul className="py-2.5 mx-2.5">
        <li className="my-4 flex items-center ">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className="mx-3.5 my-3 font-bold">Trang chủ</span>
          </Link>
        </li>
        <li className="my-4 flex items-center">
          <Link
            href={`/user/${userRouter}/saved`}
            className="flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
            <span className="mx-3.5 my-3 font-bold">Đã lưu</span>
          </Link>
        </li>
        <li className="my-4 flex items-center">
          <CreatePostModal />
        </li>
        <li className="my-4 ">
          <Link href="/users" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>

            <span className="mx-3.5 my-3 font-bold">Users</span>
          </Link>
        </li>

        <li className="my-4 flex items-center relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <span className="mx-3.5 my-3 font-bold">Cài đặt</span>
          </button>
          {isDropdownOpen && (
            <ul className="absolute left-0 mt-2 w-48 bg-gray-800 dark:bg-gray-900 text-white shadow-lg rounded-md">
              <li>
                <a
                  className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-800"
                  href=""
                >
                  Cài đặt
                </a>
              </li>
              <li>
                <hr className="border-gray-600" />
              </li>
              <li>
                <button
                  onClick={onLogout}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-700 dark:hover:bg-gray-800"
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i> Đăng
                  xuất
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default AppSidebar;
