"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import useUserStore from "@/app/store/useUserStore";

import { getLikeCountByPostId } from "@/app/api/LikeApi";

import { getUserById } from "@/app/api/AuthApi";

import CardComment from "./card.comp/card.comment";
import ButtonFavorite from "../button/button.favorite";
import ButtonLike from "../button/button.like";
import ModalCustomPost from "../modal/modal.custom-post";

export interface Post {
  _id: string;
  content: string;
  poster_id: string;
  images: {
    url: string;
    public_id: string;
    _id: string;
  }[];
  video: string[];
  like: number;
  view: number;
  created_date: Date;
}

const CardPost = ({ data }: { data: Post }) => {
  const user = useUserStore((state) => state.user);
  const [isComment, setIsComment] = useState(false);
  const postId = data._id;
  const [isModalCustomPost, setIsModalCustomPost] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: likeCountData, refetch } = useQuery({
    queryKey: ["likePosts", postId],
    queryFn: () => getLikeCountByPostId(postId),
  });

  const likeCount = likeCountData?.data.count || 0;

  const { data: authorData } = useQuery({
    queryKey: ["author", data.poster_id],
    queryFn: () => getUserById(data.poster_id),
  });
  const author = authorData?.data;

  const TimePost = () => {
    const createdAt = new Date(data.created_date);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - createdAt.getTime()) / 1000
    );

    let timeAgo = "";
    if (diffInSeconds < 60) {
      timeAgo = `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      timeAgo = `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 86400) {
      timeAgo = `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else {
      timeAgo = `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    }

    return <span>{timeAgo}</span>;
  };

  return (
    <div className="card ">
      <div className="container mx-auto mb-7">
        <div className="bg-white rounded-md shadow-md">
          <div>
            <div className="flex-shrink-0">
              <div className="grid grid-cols-12 p-3">
                <div className="col-span-1">
                  {author?.avatar && author?.avatar?.url !== "" ? (
                    <Image
                      className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                      src={author?.avatar?.url}
                      alt="avatar"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                      src="/avatar.png"
                      alt="avatar"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <div className="col-span-10 items-center ">
                  <div className="font-semibold px-1.5 text-[13px] md:text-[15px]">
                    <Link href={`/user/${author?.slug}`}>
                      {author?.full_name}
                    </Link>
                  </div>
                  <div className="px-1.5 py-0.5 text-[13px] text-[#606770] flex">
                    <span>{TimePost()} . </span>{" "}
                    <span>
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 3.757a5.5 5.5 0 1 0 6.857-.114l-.65.65a.707.707 0 0 0-.207.5c0 .39-.317.707-.707.707H8.427a.496.496 0 0 0-.413.771l.25.376a.481.481 0 0 0 .616.163.962.962 0 0 1 1.11.18l.573.573a1 1 0 0 1 .242 1.023l-1.012 3.035a1 1 0 0 1-1.191.654l-.345-.086a1 1 0 0 1-.757-.97v-.305a1 1 0 0 0-.293-.707L6.1 9.1a.849.849 0 0 1 0-1.2c.22-.22.22-.58 0-.8l-.721-.721A3 3 0 0 1 4.5 4.257v-.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    title="Mở cài đặt"
                    onClick={() => setIsModalCustomPost(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="pt-1.5">
                {data.content && data.content !== "" ? (
                  <div className="hidden md:block text-[13px] px-3">
                    <span className="font-semibold">{author?.full_name}</span>{" "}
                    {data.content}
                  </div>
                ) : null}

                {data.images.length <= 4 ? (
                  <div
                    className={`grid gap-1 ${
                      data.images.length === 1
                        ? "grid-cols-1"
                        : data.images.length === 2
                        ? "grid-cols-2"
                        : data.images.length === 3
                        ? "grid-cols-3"
                        : "grid-cols-4"
                    }`}
                  >
                    {data.images.map((image, index) => (
                      <Link
                        key={index}
                        href={`/photo/${data._id}?set=${index}`}
                      >
                        <Image
                          className="w-full h-64 object-cover mt-4 col-span-1 cursor-pointer"
                          src={image.url}
                          alt={`Post image ${index + 1}`}
                          width={400}
                          height={400}
                          unoptimized
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  //hiện 3 hình còn lại cộng số lượng hình còn lại
                  <div className="grid grid-cols-4 gap-1 mt-4">
                    {data.images.slice(0, 3).map((image, index) => (
                      <Link
                        key={index}
                        href={`/photo/${data._id}?set=${index}`}
                      >
                        <Image
                          className="w-full h-64 object-cover col-span-1 cursor-pointer"
                          src={image.url}
                          alt={`Post image ${index + 1}`}
                          width={400}
                          height={400}
                          unoptimized
                        />
                      </Link>
                    ))}
                    <button className="text-center">
                      <div className="relative w-full h-64">
                        <img
                          src={data.images[3].url}
                          alt={`Post image 4`}
                          className="w-full h-full object-cover"
                        />
                        {/* overlay tối + chữ */}
                        <div className="absolute inset-0 bg-gray-900/75 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            +{data.images.length - 3}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-12 p-2.5">
                <div className="flex col-span-10">
                  <div className="pr-2.5">
                    <ButtonLike postId={data._id} onLike={refetch} />
                  </div>
                  <div className="px-2.5">
                    <button
                      title="View comments"
                      onClick={() => setIsComment(!isComment)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="px-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </div>
                </div>
                <div className="col-span-2 flex justify-end mx-2.5">
                  <ButtonFavorite postId={data._id} />
                </div>
              </div>
              <div className=" p-2.5">
                <div className="font-light text-[13px]">
                  {likeCount} lượt thích
                </div>

                <div className="block md:hidden text-[13px] line-clamp-2">
                  <span className="font-semibold">Sơn Tùng M-TP</span> là ca sĩ,
                  nhạc sĩ nổi tiếng với nhiều bản hit đình đám...
                </div>
              </div>
              <CardComment postId={data._id} isComment={isComment} />
            </div>
          </div>
        </div>
      </div>
      {isModalCustomPost && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          ref={modalRef}
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
          <ModalCustomPost setIsOpenModal={setIsModalCustomPost} />
        </div>
      )}
    </div>
  );
};

export default CardPost;
