"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/app/store/useUserStore";
import { getImageByIdUser } from "@/app/api/ImageApi";

interface ImageData {
  url: string;
  public_id: string;
  _id: string;
  poster_id: string;
}

const PhotosPage = () => {
  const user = useUserStore((state) => state.user);
  const user_id = user?._id;
  const [showAll, setShowAll] = useState(false);

  const { data: images, isLoading } = useQuery({
    queryKey: ["userImages", user_id],
    queryFn: () => {
      if (!user_id) throw new Error("User ID is undefined");
      return getImageByIdUser(user_id);
    },
    enabled: !!user_id,
  });

  const photos = useMemo(() => images?.data || [], [images?.data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Giới hạn 15 ảnh nếu chưa bấm "xem thêm"
  const displayedPhotos = showAll ? photos : photos.slice(0, 15);

  return (
    <div className="mt-4">
      <div className="bg-white p-4 rounded-md shadow-md col-span-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ảnh</h2>
          {photos.length > 15 && (
            <button
              className="text-blue-500"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Ẩn bớt" : "Xem tất cả"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1">
          {displayedPhotos.length > 0 ? (
            displayedPhotos.map((photo: ImageData, index: number) => (
              <div className="group cursor-pointer relative" key={photo._id}>
                <Image
                  src={photo.url}
                  alt={photo.public_id}
                  className="rounded-md object-cover"
                  width={200}
                  height={200}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Link key={index} href={`/photo/${photo._id}?set=${index}`}>
                      Xem
                    </Link>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-5">Chưa có ảnh nào</p>
          )}
        </div>

        {/* Nút "Xem thêm" ở dưới */}
        {!showAll && photos.length > 15 && (
          <div className="flex justify-center mt-3 relative bottom-25 ">
            <div className="h-24 bg-gradient-to-b from-gray-400/50 to-gray-700 flex items-end justify-center w-full">
              <button
                className=" text-white px-4 py-2 w-full rounded-md text-sm"
                onClick={() => setShowAll(true)}
              >
                Xem thêm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosPage;
