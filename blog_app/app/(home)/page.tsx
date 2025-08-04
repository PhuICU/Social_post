"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { getAllPosts } from "../api/PostApi";

const CardPost = lazy(() => import("@/component/card/card.post"));
import { Post } from "@/component/card/card.post";

export default function Home() {
  const queryClient = useQueryClient();

  const {
    data: dataPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const posts = dataPosts?.data;

  // if (isLoading)
  //   return (
  //     <div>
  //       {" "}
  //       <div
  //         className="relative z-75"
  //         aria-labelledby="modal-title"
  //         role="dialog"
  //         aria-modal="true"
  //       >
  //         <div
  //           className="fixed inset-0 bg-gray-500/75 transition-opacity"
  //           aria-hidden="true"
  //         ></div>
  //         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
  //           <div className="flex items-center justify-center h-screen">
  //             <div className="relative">
  //               <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
  //               <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="ml-33">
      <div className="card w-[390px] px-10 flex md:justify-items-center md:w-[700px] sm:w-[550px] lg:w-[600px]">
        <div className="container mx-auto mb-7">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div>
              <div className="flex-shrink-0">
                <div className="grid grid-cols-12  ">
                  <div className="col-span-1">
                    <img
                      className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS221fOmoEQSIbhaczO-ag4OUNcia9vwvP9Mg&s"
                      alt=""
                    />
                  </div>
                  <div className="col-span-10 items-center ">
                    <div className="font-semibold px-3.5 text-[13px] md:text-[15px]">
                      Sơn Tùng M-TP
                    </div>
                    <div className="px-4.5 py-1.5 text-[13px] text-[#606770] flex">
                      <span>1 ngày trước . </span>{" "}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                    </svg>
                  </div>
                </div>
                <div className="py-0.5">
                  <div className="hidden md:block text-[13px]">
                    <span className="font-semibold">Sơn Tùng M-TP</span> Sơn
                    Tùng M-TP, tên thật là Nguyễn Thanh Tùng, sinh ngày 5 tháng
                    7 năm 1994 tại Thái Bình, Việt Nam. Anh là một ca sĩ, nhạc
                    sĩ, nhà sản xuất âm nhạc, diễn viên người Việt Nam. Sơn Tùng
                    M-TP được biết đến với những bản hit như: Em Của Ngày Hôm
                    Qua, Chúng Ta Không Thuộc Về Nhau, Lạc Trôi, Nơi Này Có Anh,
                    Hãy Trao Cho Anh, Có Chắc Yêu Là Đây, Chạy Ngay Đi, ...
                  </div>
                  <img
                    className="w-full h-64 object-cover mt-4"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5vYxSRS7cy3aJv9TUQOEMewVHlB3hMVpEuk3ba8sI9-EHpSqyDJ8uoWe1dBUDc7cqAD8&usqp=CAU"
                    alt=""
                  />
                </div>
                <div className="grid grid-cols-12 mx-3 py-2.5">
                  <div className="flex col-span-10">
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
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
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
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
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
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 py-2.5">
                  <div className="font-light text-[13px]">1.000 lượt thích</div>

                  {/* Nội dung đầy đủ (Hiển thị trên màn hình >= 640px) */}

                  {/* Nội dung rút gọn (Hiển thị trên màn hình < 640px) */}
                  <div className="block md:hidden text-[13px] line-clamp-2">
                    <span className="font-semibold">Sơn Tùng M-TP</span> là ca
                    sĩ, nhạc sĩ nổi tiếng với nhiều bản hit đình đám...
                  </div>
                </div>
                <div>
                  <div className="font-semibold px-3.5">Bình luận</div>
                  <div className="flex justify-between my-3.5">
                    <span className="font-light px-3.5 text-[gray]">
                      Có 1.000 bình luận
                    </span>
                    <span>
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
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 mx-3 my-3.5    ">
                    <div className="col-span-1 hidden lg:block">
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS221fOmoEQSIbhaczO-ag4OUNcia9vwvP9Mg&s"
                        alt=""
                      />
                    </div>
                    <div className="col-span-10 hidden lg:block">
                      <div className="bg-gray-100 rounded-md p-2.5">
                        <div className="font-semibold text-[15px]">
                          Sơn Tùng M-TP
                        </div>
                        <div className="font-light text-[13px]">
                          Sơn Tùng M-TP, tên thật là Nguyễn Thanh Tùng, sinh
                          ngày 5 tháng 7 năm 1994 tại Thái Bình, Việt Nam. Anh
                          là một ca sĩ, nhạc sĩ, nhà sản xuất âm nhạc, diễn viên
                          người Việt Nam. Sơn Tùng M-TP được biết đến với những
                          bản hit như: Em Của Ngày Hôm Qua, Chúng Ta Không Thuộc
                          Về Nhau, Lạc Trôi, Nơi Này Có Anh, Hãy Trao Cho Anh,
                          Có Chắc Yêu Là Đây, Chạy Ngay Đi, ...
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 mx-3 ">
                    <div className="col-span-11">
                      <input
                        type="text"
                        title="Comment"
                        placeholder="Bình luận..."
                        className="w-full rounded-md p-2.5 mt-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                    <div className="my-4.5 col-span-1 flex justify-end">
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
                          d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[390px] px-10 flex md:justify-items-center md:w-[700px] sm:w-[550px] lg:w-[600px]">
        <div>
          {posts?.map((post: Post) => (
            <div key={post._id} className="mb-4">
              {" "}
              <CardPost data={post} />
            </div>
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
}
