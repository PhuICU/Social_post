"use client";
import Link from "next/link";

import { register } from "@/app/api/AuthApi";
import Alert from "@/component/Alert";
import { useState, useEffect, useMemo, useRef } from "react";

export default function SignUp() {
  const [account, setAccount] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs for form inputs
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // Memoized validation state
  const validationState = useMemo(() => {
    const { full_name, email, password, confirmPassword } = account;
    const isFormValid = full_name && email && password && confirmPassword;
    const isPasswordMatch = password === confirmPassword;
    const isPasswordValid = password.length >= 8;

    return {
      isFormValid,
      isPasswordMatch,
      isPasswordValid,
      canSubmit: isFormValid && isPasswordMatch && isPasswordValid,
    };
  }, [account]);

  // Memoized alert timeout handler
  const alertTimeoutHandler = useMemo(() => {
    return (message: string, type: "success" | "error" | "warning") => {
      setAlert({ message, type });
      setTimeout(() => setAlert(null), 5000);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { full_name, email, password, confirmPassword } = account;

    if (!validationState.isFormValid) {
      alertTimeoutHandler("Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }

    if (!validationState.isPasswordMatch) {
      alertTimeoutHandler("Mật khẩu không khớp", "error");
      return;
    }

    if (!validationState.isPasswordValid) {
      alertTimeoutHandler("Mật khẩu phải có ít nhất 8 ký tự", "error");
      return;
    }

    setIsLoading(true);
    try {
      const data = await register(account);
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.data));
      }
      console.log(data);
      alertTimeoutHandler("Đăng ký thành công", "success");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alertTimeoutHandler(
        "Đăng ký không thành công. Vui lòng thử lại.",
        "error"
      );
    }
  };

  // Focus first input on mount
  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, []);

  console.log("account", account);

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
    <div className="grid justify-items-center  my-10">
      <div className=" px-10 flex md:justify-items-center ">
        <h1 className="text-2xl font-bold">
          Đăng ký với địa chỉ email của bạn
        </h1>
      </div>
      <div>
        <form
          className="flex flex-col gap-4 w-96 my-10"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="text-gray-600">Tên tài khoản của bạn</p>
            <input
              ref={fullNameRef}
              type="text"
              placeholder="Tên đăng nhập"
              name="full_name"
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <p className="text-gray-600">Địa chỉ email của bạn</p>
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <div className="flex flex-col  justify-between">
              <div>
                {" "}
                <p className="text-gray-600">
                  Mật khẩu của bạn{" "}
                  <span className="text-sm">(Tối thiểu 8 ký tự)</span>
                </p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md px-1 py-1 bg-white">
                {" "}
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  name="password"
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent text-sm  rounded-md pl-2 w-full"
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
          </div>
          <div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-gray-600">Xác nhận mật khẩu của bạn</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md px-1 py-1 bg-white">
                <input
                  ref={confirmPasswordRef}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  name="confirmPassword"
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent text-sm  rounded-md pl-2 w-full"
                />
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          </div>
          <div>
            <p>
              By creating an account, you agree to the terms of service and
              privacy policy.
              <span className="text-sm text-blue-500 cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-sm text-blue-500 cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
            <div className="flex items-center gap-2 border-[1px] border-black-300 rounded-[10px]  shadow-md w-70 p-3.5 my-2.5">
              <input type="checkbox" id="robot" className="mr-2" />
              <label htmlFor="robot" className="text-sm">
                Tôi không phải là người máy
              </label>
              <div className="flex items-end ">
                <img
                  src="data:image/png;base64,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"
                  alt="Captcha"
                  className="h-8 w-8"
                />
              </div>
            </div>
          </div>
          <div>
            {" "}
            <button className="bg-gray-500 text-white rounded-[20px] p-2 w-full">
              Đăng ký
            </button>
          </div>
        </form>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          Bạn đã có tài khoản?{" "}
          <span className="text-sm text-blue-500 cursor-pointer hover:underline">
            <Link href="/sign-in"> Đăng nhập</Link>
          </span>
        </p>
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
