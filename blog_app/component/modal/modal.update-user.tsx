import React, { useEffect, useRef, useState } from "react";
import { updateProfile } from "@/app/api/AuthApi";
import useUserStore from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";

interface CreatePostModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
}

const updateUserModal: React.FC<CreatePostModalProps> = ({
  setIsOpenModal,
}) => {
  const user = useUserStore((state) => state.user);

  const [updateUser, setUpdateUser] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || { url: "", public_id: "" },
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Only allow numbers for phone field
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setUpdateUser((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setUpdateUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const router = useRouter();
  const handleUpdateProfile = async () => {
    try {
      if (updateUser.phone.length < 10) {
        setAlert({
          message: "Số điện thoại phải có ít nhất 10 chữ số.",
          type: "error",
        });
        // Auto dismiss error alerts after 5 seconds
        setTimeout(() => setAlert(null), 3000);
        return;
      }

      const response = await updateProfile(updateUser);
      if (response) {
        useUserStore.getState().setUser(response.data);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        message:
          "Cập nhật thông tin cá nhân không thành công. Vui lòng thử lại.",
        type: "error",
      });
      // Auto dismiss error alerts after 5 seconds
      setTimeout(() => setAlert(null), 5000);
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
        setUpdateUser({
          full_name: user?.full_name || "",
          email: user?.email || "",
          bio: user?.bio || "",
          phone: user?.phone || "",
          address: user?.address || "",
          avatar: user?.avatar || { url: "", public_id: "" },
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);
  return (
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={modalRef}
          className="relative transform overflow-hidden mt-9 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="bg-white p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Chỉnh sửa thông tin cá nhân
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={updateUser.full_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={updateUser.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={updateUser.phone}
                  onChange={handleChange}
                  className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={updateUser.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => {
                setIsOpenModal(false);
                handleUpdateProfile();
              }}
              type="button"
              className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
            >
              Lưu
            </button>
            <button
              onClick={() => setIsOpenModal(false)}
              type="button"
              className="inline-flex justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 mr-2"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default updateUserModal;
