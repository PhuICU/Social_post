"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore, { User } from "@/app/store/useUserStore";
import { useShallow } from "zustand/shallow";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";
import { getPostByUserId } from "@/app/api/PostApi";
import { useQuery } from "@tanstack/react-query";
import CardPost, { Post } from "@/component/card/card.post";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", user?._id],
    queryFn: () => {
      if (!user?._id) throw new Error("User ID is undefined");
      return getPostByUserId(user._id);
    },
    enabled: !!user?._id,
  });
  console.log("Posts data:", posts);
  const dataPosts = posts?.data;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("Posts data:", dataPosts);

  return (
    <div className="container mx-auto mb-7 px-1 ">
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="flex items-center gap-4 mb-6 py-5">
          <div>
            {user?.avatar && user?.avatar?.url !== "" ? (
              <Image
                className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                src={user?.avatar?.url}
                alt="avatar"
                width={40}
                height={40}
              />
            ) : (
              <Image
                className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                src={"/avatar.png"}
                alt="avatar"
                width={40}
                height={40}
              />
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold">{user?.full_name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div></div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-4 mt-6">
        <div className="bg-white p-4 rounded-md shadow-md col-span-3"></div>
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
    </div>
  );
}
