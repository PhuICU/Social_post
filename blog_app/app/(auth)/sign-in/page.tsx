"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/app/api/AuthApi";
import Cookies from "js-cookie";
import useUserStore, { User } from "@/app/store/useUserStore";
import { useShallow } from "zustand/shallow";

export default function SignIn() {
  const [userLogin, setUser] = useState({
    email: "",
    password: "",
  });
  const { user, setUser: setUserStore } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    }))
  );

  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await login(userLogin);
      console.log("response", response.data);
      const { access_token, refresh_token, user } = response.data;
      Cookies.set("access_token", access_token, { expires: 1 });
      Cookies.set("refresh_token", refresh_token, { expires: 7 });
      console.log("User data:", user);
      setUserStore(user);
      router.push("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="grid">
      <div className=" px-20 flex md:justify-items-center justify-around items-center h-[87vh] bg-gray-100">
        <div className="flex flex-col gap-4 mb-6 px-6">
          <h1 className="text-2xl font-bold">Đăng nhập gần đây</h1>
          <p className="text-sm text-gray-500">
            Nhấn vào avatar để đăng nhập nhanh hơn
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white shadow-md rounded-md p-4">
              <img
                src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png"
                alt="Avatar"
                className="rounded-full w-10 h-10"
              />
              <span>Nguyễn Văn A</span>
            </div>
            <div className="flex items-center gap-4 bg-white shadow-md rounded-md p-4">
              <img
                src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png"
                alt="Avatar"
                className="rounded-full w-10 h-10"
              />
              <span>Trần Thị B</span>
            </div>
            <div className="flex items-center justify-center gap-4 bg-white shadow-md rounded-md p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 items-center"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <div className="w-96 bg-white shadow-md rounded-md p-6">
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <p className="text-[13px] py-1.5">Email của bạn</p>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  name="email"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Email"
                />
              </div>
              <div className="">
                <p className="text-[13px] py-1.5">Mật khẩu của bạn</p>

                <div className="flex items-center justify-between">
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    name="password"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  <svg
                    className="px-1.5 h-8 w-8 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleLogin}
                type="button"
                disabled={!userLogin.email || !userLogin.password}
                // onClick={handleLogin}
                className="bg-gray-500 text-white rounded-[20px] p-2 w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Đăng nhập
              </button>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember" className="text-sm">
                    Nhớ mật khẩu
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button className="border-[1px] border-black-300 rounded-[20px] p-2 w-full bg-white shadow-md mx-6.5">
              Tạo tài khoản mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
