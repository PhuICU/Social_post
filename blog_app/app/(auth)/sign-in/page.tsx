"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/app/api/AuthApi";
import Cookies from "js-cookie";
import useUserStore, { User } from "@/app/store/useUserStore";
import { useShallow } from "zustand/shallow";
import Alert from "@/component/Alert";

interface RecentAccount {
  id: string;
  email: string;
  name: string;
  avatar: {
    url: string;
  };
  lastLogin: number;
}

export default function SignIn() {
  const [userLogin, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [recentAccounts, setRecentAccounts] = useState<RecentAccount[]>([]);

  // Refs for form inputs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { user, setUser: setUserStore } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    }))
  );

  const router = useRouter();

  // Memoized validation state
  const validationState = useMemo(() => {
    const { email, password } = userLogin;
    const isFormValid = email && password;
    const isEmailValid = email.includes("@") && email.includes(".");

    return {
      isFormValid,
      isEmailValid,
      canSubmit: isFormValid && isEmailValid,
    };
  }, [userLogin]);

  // Memoized alert timeout handler
  const alertTimeoutHandler = useMemo(() => {
    return (message: string, type: "success" | "error" | "warning") => {
      setAlert({ message, type });
      setTimeout(() => setAlert(null), 5000);
    };
  }, []);

  // Load recent accounts from localStorage
  useEffect(() => {
    const savedAccounts = localStorage.getItem("recentAccounts");
    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);
        setRecentAccounts(accounts);
      } catch (error) {
        console.error("Error parsing recent accounts:", error);
      }
    }
  }, []);

  // Focus first input on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  // Save account to recent accounts
  const saveRecentAccount = (userData: any) => {
    const newAccount: RecentAccount = {
      id: userData.id || userData.email,
      email: userData.email,
      name: userData.full_name || userData.name || userData.email.split("@")[0],
      avatar:
        userData.avatar ||
        "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png",
      lastLogin: Date.now(),
    };

    setRecentAccounts((prev) => {
      const existingIndex = prev.findIndex(
        (acc) => acc.email === newAccount.email
      );
      let updatedAccounts;

      if (existingIndex !== -1) {
        // Update existing account's last login time
        updatedAccounts = [...prev];
        updatedAccounts[existingIndex] = newAccount;
      } else {
        // Add new account, keep only the 5 most recent
        updatedAccounts = [newAccount, ...prev].slice(0, 5);
      }

      // Sort by last login time (most recent first)
      updatedAccounts.sort((a, b) => b.lastLogin - a.lastLogin);

      // Save to localStorage
      localStorage.setItem("recentAccounts", JSON.stringify(updatedAccounts));

      return updatedAccounts;
    });
  };

  // Handle quick login with saved account
  const handleQuickLogin = (account: RecentAccount) => {
    setUser((prev: { email: string; password: string }) => ({
      ...prev,
      email: account.email,
    }));

    // Focus password field for quick login
    setTimeout(() => {
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
    }, 100);

    alertTimeoutHandler(`Đã chọn tài khoản ${account.name}`, "success");
  };

  // Remove account from recent accounts
  const removeRecentAccount = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentAccounts((prev) => {
      const updatedAccounts = prev.filter((acc) => acc.id !== accountId);
      localStorage.setItem("recentAccounts", JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
    alertTimeoutHandler("Đã xóa tài khoản khỏi danh sách gần đây", "success");
  };

  const handleLogin = async () => {
    if (!validationState.canSubmit) {
      alertTimeoutHandler("Vui lòng điền đầy đủ thông tin hợp lệ.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(userLogin);
      console.log("response", response.data);
      const { access_token, refresh_token, user } = response.data;
      Cookies.set("access_token", access_token, { expires: 1 });
      Cookies.set("refresh_token", refresh_token, { expires: 7 });
      console.log("User data:", user);
      setUserStore(user);

      // Save to recent accounts
      saveRecentAccount(user);

      alertTimeoutHandler("Đăng nhập thành công!", "success");
      router.push("/");
    } catch (error) {
      console.error("Error logging in:", error);
      alertTimeoutHandler(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        "error"
      );
    } finally {
      setIsLoading(false);
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
    if (e.key === "Enter" && validationState.canSubmit) {
      handleLogin();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  if (isLoading) {
    return (
      <div
        className="relative z-75"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-center justify-center h-screen">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className=" px-20 flex md:justify-items-center justify-around items-center h-[87vh] bg-gray-100">
        <div className="flex flex-col gap-4 mb-6 px-6">
          <h1 className="text-2xl font-bold">Đăng nhập gần đây</h1>
          <p className="text-sm text-gray-500">
            Nhấn vào avatar để đăng nhập nhanh hơn
          </p>
          <div className="flex flex-col gap-4">
            {recentAccounts.length > 0 ? (
              recentAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-4 bg-white shadow-md rounded-md p-4 cursor-pointer hover:shadow-lg transition-shadow relative group"
                  onClick={() => handleQuickLogin(account)}
                >
                  {account.avatar.url !== "" ? (
                    <img
                      src={account.avatar.url}
                      alt="Avatar"
                      className="rounded-full w-10 h-10"
                    />
                  ) : (
                    <img
                      src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png"
                      alt="Avatar"
                      className="rounded-full w-10 h-10"
                    />
                  )}
                  <span className="flex-1">{account.name}</span>
                  <button
                    onClick={(e) => removeRecentAccount(account.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1"
                    title="Xóa khỏi danh sách gần đây"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-4 bg-white shadow-md rounded-md p-4 opacity-50">
                <img
                  src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png"
                  alt="Avatar"
                  className="rounded-full w-10 h-10"
                />
                <span>Chưa có tài khoản gần đây</span>
              </div>
            )}
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <p className="text-[13px] py-1.5">Email của bạn</p>
                <input
                  ref={emailRef}
                  type="email"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  name="email"
                  onChange={handleChange}
                  value={userLogin.email}
                  onKeyDown={handleKeyDown}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="">
                <p className="text-[13px] py-1.5">Mật khẩu của bạn</p>

                <div className="flex items-center border border-gray-300 rounded-md px-1 py-1 bg-white">
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    name="password"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none bg-transparent text-sm pl-2"
                    required
                  />
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {" "}
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
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!validationState.canSubmit}
                className={`rounded-[20px] p-2 w-full ${
                  validationState.canSubmit
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
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
                <Link href="/identify" className="text-sm text-blue-500">
                  Quên mật khẩu?
                </Link>
              </div>
            </form>
          </div>
          <div className="flex items-center justify-center mt-4">
            <Link href="/sign-up">
              <button className="border-[1px] border-black-300 rounded-[20px] p-2 w-full bg-white shadow-md mx-6.5">
                Tạo tài khoản mới
              </button>
            </Link>
          </div>
        </div>
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
