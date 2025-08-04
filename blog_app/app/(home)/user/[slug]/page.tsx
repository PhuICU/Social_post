"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import useUserStore, { User } from "@/app/store/useUserStore";

import Image from "next/image";
import { getPostByUserId } from "@/app/api/PostApi";
import { updateProfile } from "@/app/api/AuthApi";
import { useQuery } from "@tanstack/react-query";
import CardPost, { Post } from "@/component/card/card.post";

import Alert from "@/component/Alert";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [isBio, setIsBio] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [updateUser, setUpdateUser] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const memoizedUser = useMemo(() => user, [user]);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", user?._id],
    queryFn: () => {
      if (!user?._id) throw new Error("User ID is undefined");
      return getPostByUserId(user._id);
    },
    enabled: !!user?._id,
  });

  const dataPosts = useMemo(() => posts?.data, [posts?.data]);

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

  console.log("User data:", updateUser.phone.length);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModal(false);
        // Reset form data when closing without saving
        setUpdateUser({
          full_name: user?.full_name || "",
          email: user?.email || "",
          bio: user?.bio || "",
          phone: user?.phone || "",
          address: user?.address || "",
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mb-7 px-1 ">
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="flex items-center gap-4  py-5">
          <div className="flex-shrink-0 mx-5">
            {memoizedUser?.avatar && memoizedUser?.avatar?.url !== "" ? (
              <Image
                className="md:h-[120px] md:w-[120px] h-12 w-12 rounded-full"
                src={memoizedUser?.avatar?.url}
                alt="avatar"
                width={120}
                height={120}
              />
            ) : (
              <Image
                className="md:h-[120px] md:w-[120px] h-12 w-12 rounded-full"
                src={"/avatar.png"}
                alt="avatar"
                width={120}
                height={120}
              />
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold">{memoizedUser?.full_name}</h1>
            <p className="text-sm text-gray-500">{memoizedUser?.email}</p>
          </div>
          <div className="ml-auto">
            <button
              className="bg-gray-200 text-black text-[13px] px-4 py-2 rounded-md"
              onClick={() => setIsModal(true)}
            >
              <p>Chỉnh sửa trang cá nhân</p>
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-4 mt-6">
        <div className="bg-white p-4 rounded-md shadow-md col-span-3">
          {isBio === true ? (
            <div className="flex flex-col">
              <div className="">
                <textarea
                  className="w-full h-full border-2 border-black p-2 rounded"
                  placeholder="Nhập nội dung..."
                  name="bio"
                  value={updateUser.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  className="bg-gray-200 text-black text-[12px] px-4 py-2 rounded-md"
                  onClick={() => setIsBio(false)}
                >
                  Hủy
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-[12px]"
                  onClick={() => {
                    setIsBio(false);
                    handleUpdateProfile();
                  }}
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 justify-center items-center flex">
                {" "}
                {memoizedUser?.bio ? (
                  <p className="text-gray-600">{memoizedUser?.bio}</p>
                ) : (
                  <p className="text-gray-400">Chưa có tiểu sử</p>
                )}
              </div>
              <div className="">
                <button
                  title=""
                  className="bg-gray-200 text-black text-[13px] px-4 py-2 rounded-md w-full"
                  onClick={() => setIsBio(true)}
                >
                  Chỉnh sửa tiểu sử
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-md shadow-md col-span-5">
          <div>
            {dataPosts?.length > 0 ? (
              dataPosts?.map((post: Post) => (
                <div key={post._id} className="mb-4">
                  <CardPost data={post} />
                </div>
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </div>
        </div>
      </div>
      {isModal && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
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
                      setIsModal(false);
                      handleUpdateProfile();
                    }}
                    type="button"
                    className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setIsModal(false)}
                    type="button"
                    className="inline-flex justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 mr-2"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
