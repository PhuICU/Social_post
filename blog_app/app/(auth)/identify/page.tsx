"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { forgotPassword, resetPassword } from "@/app/api/AuthApi";

import Alert from "@/component/Alert";

export default function Identify() {
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [OtpCode, setOtpCode] = useState("");
  const [otp, setOtp] = useState({
    otp: "",
  });
  const [newPassword, setNewPassword] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  // Refs for form inputs
  const emailOrPhoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Memoized validation states for each step
  const stepValidation = useMemo(() => {
    const isEmailValid =
      emailOrPhone.includes("@") || emailOrPhone.length >= 10;
    const isOtpValid = otp.otp.length >= 4;
    const isPasswordValid = newPassword.password.length >= 8;
    const isPasswordMatch =
      newPassword.password === newPassword.confirmPassword;
    const isConfirmPasswordValid = newPassword.confirmPassword.length >= 8;

    return {
      step1: {
        canProceed: emailOrPhone.trim() !== "" && isEmailValid,
        isEmailValid,
      },
      step2: {
        canProceed: isOtpValid,
        isOtpValid,
      },
      step3: {
        canProceed:
          isPasswordValid && isPasswordMatch && isConfirmPasswordValid,
        isPasswordValid,
        isPasswordMatch,
        isConfirmPasswordValid,
      },
    };
  }, [emailOrPhone, otp.otp, newPassword]);

  // Memoized alert timeout handler
  const alertTimeoutHandler = useMemo(() => {
    return (message: string, type: "success" | "error" | "warning") => {
      setAlert({ message, type });
      setTimeout(() => setAlert(null), 5000);
    };
  }, []);

  // Focus appropriate input based on current step
  useEffect(() => {
    if (step === 1 && emailOrPhoneRef.current) {
      emailOrPhoneRef.current.focus();
    } else if (step === 2 && otpRef.current) {
      otpRef.current.focus();
    } else if (step === 3 && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [step]);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrPhone(e.target.value);
    setNewPassword((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const submitEmailOrPhone = async () => {
    if (!stepValidation.step1.canProceed) {
      alertTimeoutHandler(
        "Vui lòng nhập email hoặc số điện thoại hợp lệ.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(emailOrPhone);

      console.log("Response:", response);
      setLoading(false);
      handleNextStep();
      setOtpCode(response.data.token);
      alertTimeoutHandler(
        "Mã xác thực đã được gửi đến email/số điện thoại của bạn.",
        "success"
      );
    } catch (error) {
      console.error("Error submitting email or phone:", error);
      setLoading(false);
      alertTimeoutHandler(
        "Định dạng email hoặc số điện thoại không hợp lệ.",
        "error"
      );
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp({ ...otp, otp: e.target.value });
  };

  const verifyOtp = async () => {
    if (!stepValidation.step2.canProceed) {
      alertTimeoutHandler("Vui lòng nhập mã xác thực hợp lệ.", "error");
      return;
    }

    if (otp.otp === OtpCode) {
      handleNextStep();
      alertTimeoutHandler("Xác thực thành công!", "success");
    } else {
      console.error("Invalid OTP");
      alertTimeoutHandler(
        "Mã xác thực không hợp lệ. Vui lòng thử lại.",
        "error"
      );
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("New Password State:", newPassword);

  const handleResetPassword = async () => {
    if (!stepValidation.step3.canProceed) {
      if (!stepValidation.step3.isPasswordValid) {
        alertTimeoutHandler("Mật khẩu phải có ít nhất 8 ký tự.", "error");
      } else if (!stepValidation.step3.isPasswordMatch) {
        alertTimeoutHandler("Mật khẩu không khớp. Vui lòng thử lại.", "error");
      } else {
        alertTimeoutHandler("Vui lòng nhập đầy đủ thông tin.", "error");
      }
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(newPassword);
      setLoading(false);
      console.log("Reset Password Response:", response);
      alertTimeoutHandler("Mật khẩu đã được thay đổi thành công.", "success");
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setLoading(false);
      alertTimeoutHandler(
        "Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.",
        "error"
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (step === 1 && stepValidation.step1.canProceed) {
        submitEmailOrPhone();
      } else if (step === 2 && stepValidation.step2.canProceed) {
        verifyOtp();
      } else if (step === 3 && stepValidation.step3.canProceed) {
        handleResetPassword();
      }
    }
  };

  if (loading) {
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
    <div>
      <div className=" ml-4 fixed bottom-30  bg-gray-50 dark:bg-gray-900 p-3 z-75 border border-gray-200 dark:border-gray-700 rounded-full">
        <button title="Quay lại bước trước" onClick={handlePreviousStep}>
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
              d="m7.49 12-3.75 3.75m0 0 3.75 3.75m-3.75-3.75h16.5V4.499"
            />
          </svg>
        </button>
      </div>
      <section className=" bg-gray-50 dark:bg-gray-900">
        <div className="mt-2 md:mt-0 py-12 pb-6 sm:py-16 lg:pb-24 overflow-hidden">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
            <div className="relative mt-12 lg:mt-20">
              <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                <svg
                  className="w-full"
                  xmlns="http://www.w3.org/2000/svg"
                  width="875"
                  height="48"
                  viewBox="0 0 875 48"
                  fill="none"
                >
                  <path
                    d="M2 29C20.2154 33.6961 38.9915 35.1324 57.6111 37.5555C80.2065 40.496 102.791 43.3231 125.556 44.5555C163.184 46.5927 201.26 45 238.944 45C312.75 45 385.368 30.7371 458.278 20.6666C495.231 15.5627 532.399 11.6429 569.278 6.11109C589.515 3.07551 609.767 2.09927 630.222 1.99998C655.606 1.87676 681.208 1.11809 706.556 2.44442C739.552 4.17096 772.539 6.75565 805.222 11.5C828 14.8064 850.34 20.2233 873 24"
                    stroke="#D4D4D8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="1 12"
                  />
                </svg>
              </div>
              <div className="relative grid grid-cols-1 text-center gap-y-8 sm:gap-y-10 md:gap-y-12 md:grid-cols-3 gap-x-12">
                <div>
                  <div
                    className={`flex items-center justify-center w-16 h-16 mx-auto dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow ${
                      step === 1 ? "bg-green-700 text-white" : "bg-white"
                    }`}
                  >
                    <span
                      className={`text-xl font-semibold ${
                        step === 1
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      1
                    </span>
                  </div>
                  <h3 className="mt-4 sm:mt-6 text-xl font-semibold leading-tight text-gray-900 dark:text-white md:mt-10">
                    Nhập thông tin
                  </h3>
                  <p className="mt-3 sm:mt-4 text-base text-gray-600 dark:text-gray-400">
                    Nhập email hoặc số điện thoại của bạn để nhận mã xác thực.
                  </p>
                </div>
                <div>
                  <div
                    className={`flex items-center justify-center w-16 h-16 mx-auto border-2 border-gray-200 dark:border-gray-700 rounded-full shadow ${
                      step === 2
                        ? "bg-green-700 text-white"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <span
                      className={`text-xl font-semibold ${
                        step === 2
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      2
                    </span>
                  </div>
                  <h3 className="mt-4 sm:mt-6 text-xl font-semibold leading-tight text-gray-900 dark:text-white md:mt-10">
                    Nhập mã xác thực
                  </h3>
                  <p className="mt-3 sm:mt-4 text-base text-gray-600 dark:text-gray-400">
                    Nhập mã xác thực đã gửi đến email hoặc số điện thoại của
                    bạn.
                  </p>
                </div>
                <div>
                  <div
                    className={`flex items-center justify-center w-16 h-16 mx-auto border-2 border-gray-200 dark:border-gray-700 rounded-full shadow ${
                      step === 3
                        ? "bg-green-700 text-white"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <span
                      className={`text-xl font-semibold ${
                        step === 3
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      3
                    </span>
                  </div>
                  <h3 className="mt-4 sm:mt-6 text-xl font-semibold leading-tight text-gray-900 dark:text-white md:mt-10">
                    Thay đổi mật khẩu
                  </h3>
                  <p className="mt-3 sm:mt-4 text-base text-gray-600 dark:text-gray-400">
                    Nhập mật khẩu mới của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        {step === 1 && (
          <div className=" bg-gray-50 dark:bg-gray-900 my-5 rounded-b-md border border-gray-200 dark:border-gray-700 p-3.5">
            <div className="flex flex-col justify-center w-full">
              <div className="flex items-center justify-center w-full">
                {" "}
                <input
                  ref={emailOrPhoneRef}
                  type="text"
                  name="email"
                  placeholder="Nhập email hoặc số điện thoại"
                  className="border border-gray-300 rounded-lg p-2 w-80"
                  value={emailOrPhone}
                  onChange={handleChangeEmail}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="flex items-center justify-center w-full mt-3">
                {" "}
                <button
                  onClick={submitEmailOrPhone}
                  disabled={!stepValidation.step1.canProceed}
                  className={`rounded-lg p-2 w-[200px] transition-colors ${
                    stepValidation.step1.canProceed
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className=" bg-gray-50 dark:bg-gray-900 my-5 rounded-b-md border border-gray-200 dark:border-gray-700 p-3.5">
            <div className="flex justify-center w-full ">
              <div>
                <div className="flex items-center justify-center w-full">
                  {" "}
                  <input
                    ref={otpRef}
                    type="text"
                    name="otp"
                    value={otp.otp}
                    placeholder="Nhập mã xác thực"
                    className="border border-gray-300 rounded-lg p-2 w-80"
                    onChange={handleOtpChange}
                    onKeyDown={handleKeyDown}
                    maxLength={6}
                  />
                </div>
                <div className="flex items-center justify-center w-full mt-3">
                  {" "}
                  <button
                    onClick={verifyOtp}
                    disabled={!stepValidation.step2.canProceed}
                    className={`rounded-lg p-2 w-[200px] transition-colors ${
                      stepValidation.step2.canProceed
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className=" bg-gray-50 dark:bg-gray-900 my-5 rounded-b-md border border-gray-200 dark:border-gray-700 p-3.5">
            <div className="flex justify-center w-full ">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center w-full border border-gray-300 rounded-md px-1 py-1 bg-white">
                  {" "}
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={newPassword.password}
                    placeholder="Nhập mật khẩu mới"
                    className="flex-1 outline-none bg-transparent text-sm pl-2 w-80"
                    onChange={handleChangePassword}
                    onKeyDown={handleKeyDown}
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
                <div className="flex items-center justify-center w-full border border-gray-300 rounded-md px-1 py-1 bg-white">
                  {" "}
                  <input
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={newPassword.confirmPassword}
                    placeholder="Nhập lại mật khẩu mới"
                    className="flex-1 outline-none bg-transparent text-sm pl-2 w-80"
                    onChange={handleChangePassword}
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
                <div className="flex items-center justify-center w-full mt-3">
                  {" "}
                  <button
                    onClick={handleResetPassword}
                    disabled={!stepValidation.step3.canProceed}
                    className={`rounded-lg p-2 ml-2 transition-colors ${
                      stepValidation.step3.canProceed
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center w-full bg-gray-50 dark:bg-gray-900 my-5">
        <div>
          <Link href="/sign-in">
            <button className="bg-gray-500 text-white rounded-[20px] p-2 w-40 hover:bg-gray-600 transition-colors">
              Trở về đăng nhập
            </button>
          </Link>
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
