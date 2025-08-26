"use client";
import React, { useEffect, useState, useMemo, useRef, use } from "react";
import { useRouter } from "next/navigation";
import useUserStore, { User } from "@/app/store/useUserStore";

import Image from "next/image";
import { useSyncLocalStorage, setLocalStorage } from "@/app/hook/LocalStore";
import { getPostByUserId } from "@/app/api/PostApi";
import { updateProfile, getUserBySlug } from "@/app/api/AuthApi";
import { useQuery } from "@tanstack/react-query";
import CardPost, { Post } from "@/component/card/card.post";

import { getImageByIdUser } from "@/app/api/ImageApi";

interface ImageData {
  url: string;
  public_id: string;
  _id: string;
  poster_id: string;
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = useUserStore((state) => state.user);
  const [isBio, setIsBio] = useState(false);
  const { slug } = use(params);

  const { data: userData } = useQuery({
    queryKey: ["user", slug],
    queryFn: () => getUserBySlug(slug),
  });

  const customUserData = useMemo(() => userData?.data, [userData?.data]);

  const [updateUser, setUpdateUser] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const router = useRouter();

  const memoizedUser = useMemo(() => user, [user]);
  const user_id = customUserData?._id;
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", user_id],
    queryFn: () => {
      if (!user_id) throw new Error("User ID is undefined");
      return getPostByUserId(user_id);
    },
    enabled: !!user?._id,
  });

  console.log("User ID:", user_id);

  const { data: userImage, isLoading: isLoadingImage } = useQuery({
    queryKey: ["userImage", user_id],
    queryFn: () => {
      if (!user_id) throw new Error("User ID is undefined");
      return getImageByIdUser(user_id);
    },
    enabled: !!user_id,
  });

  const imageData = useMemo(() => userImage?.data, [userImage?.data]);
  console.log("User Image:", imageData);
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
      const response = await updateProfile(updateUser);
      if (response) {
        useUserStore.getState().setUser(response.data);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const open = useSyncLocalStorage("isOpen");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-8 gap-4 mt-6">
      <div
        className={`col-span-3 
     ${
       open ? "" : "sticky"
     } top-[80px] h-[calc(100vh-100px)] overflow-y-auto" : "hidden"}`}
      >
        <div className="bg-white p-4 rounded-md shadow-md top-30">
          {customUserData?._id === user?._id ? (
            <>
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
            </>
          ) : (
            <div className="mb-4 justify-center items-center flex">
              {" "}
              <p className="text-gray-600">
                {customUserData?.bio || "Chưa có tiểu sử"}
              </p>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-md shadow-md mt-4">
          <div className="flex justify-between items-center mt-4">
            <div>Ảnh</div>
            <div className="text-blue-500">Xem tất cả</div>
          </div>
          <div className="grid grid-cols-3 grid-rows-3 gap-1">
            {imageData?.length > 0 ? (
              imageData?.slice(0, 9).map((image: ImageData) => (
                <div key={image._id} className="">
                  <Image
                    src={image.url}
                    alt="user-image"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Chưa có ảnh nào</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md shadow-md col-span-5">
        <div>
          {dataPosts?.length > 0 ? (
            dataPosts
              ?.slice()
              .reverse()
              .map((post: Post) => (
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
  );
}
