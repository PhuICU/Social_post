import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { changePassword } from "@/app/api/AuthApi";

import useUserStore from "@/app/store/useUserStore";

interface CreatePostModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
}

const ModalChangePassword: React.FC<CreatePostModalProps> = ({
  setIsOpenModal,
}) => {
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const user = useUserStore((state) => state.user);
  const modalRef = useRef<HTMLDivElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validationState = useMemo(() => {
    return {
      old_password: oldPasswordRef.current?.value === password.old_password,
      new_password: newPasswordRef.current?.value === password.new_password,
      confirm_password:
        confirmPasswordRef.current?.value === password.confirm_password,
    };
  }, [password]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !validationState.old_password ||
      !validationState.new_password ||
      !validationState.confirm_password
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password.new_password !== password.confirm_password) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      const user_id = user?._id;
      if (!user_id) {
        alert("Không tìm thấy thông tin người dùng");
        return;
      }
      await changePassword(
        user_id,
        password.new_password,
        password.old_password
      );
      alert("Đổi mật khẩu thành công");
      setIsOpenModal(false);
    } catch (error) {
      alert("Đã xảy ra lỗi khi đổi mật khẩu");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(false);
        // Reset form data when closing without saving
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log(password);
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={modalRef}
          className="relative transform overflow-hidden mt-9 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Đổi mật khẩu</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu hiện tại
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-1 py-1 bg-white">
                  <input
                    ref={oldPasswordRef}
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    name="old_password"
                    onChange={handleChange}
                    className="flex-1 outline-none bg-transparent text-sm pl-2"
                    required
                  />
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => setShowOldPassword(!showOldPassword)}
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
              <div className="mb-4">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu mới
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-1 py-1 bg-white">
                  <input
                    ref={newPasswordRef}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    name="new_password"
                    onChange={handleChange}
                    className="flex-1 outline-none bg-transparent text-sm pl-2"
                    required
                  />
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
              <div className="mb-4">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Xác nhận mật khẩu mới
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-1 py-1 bg-white">
                  <input
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    name="confirm_password"
                    onChange={handleChange}
                    className="flex-1 outline-none bg-transparent text-sm pl-2"
                    required
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
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md items-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Thay đổi mật khẩu tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChangePassword;
