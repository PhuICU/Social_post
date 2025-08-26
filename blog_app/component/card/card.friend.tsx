import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/app/api/AuthApi";
const CardFriend = ({ userId }: { userId: string }) => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const user = userData?.data;
  return (
    <div className=" dark:bg-gray-700 ">
      <Link className="" href={`/user/${user?.slug}`}>
        <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="px-4 py-2">
            <div className="text-center my-2">
              <Image
                className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                src={user?.avatar?.url || "/avatar.png"}
                alt=""
                width={128}
                height={128}
              />
              <div className="py-2">
                <h5 className="font-bold text-1xl text-gray-800 dark:text-white">
                  {user?.full_name || "Unknown User"}
                </h5>
                <h6 className="text-gray-300 dark:text-white mb-1">
                  @{user?.slug || "UnknownUser"}
                </h6>
                <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      className=""
                      d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                    />
                  </svg>
                  {user?.bio || null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardFriend;
