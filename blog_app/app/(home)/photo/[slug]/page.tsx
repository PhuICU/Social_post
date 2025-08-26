"use client";

import React, { useState, useEffect, useRef } from "react";
import { use } from "react"; // Hook mới
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useUserStore from "@/app/store/useUserStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSyncLocalStorage } from "@/app/hook/LocalStore";
import { getUserById } from "@/app/api/AuthApi";
import { getPostById, getPostByImageId } from "@/app/api/PostApi";
import {
  getCommentsOfPostId,
  updateComment,
  createComment,
  deleteComment,
} from "@/app/api/CommentApi";
import { getLikeCountByPostId } from "@/app/api/LikeApi";
import ButtonLike from "@/component/button/button.like";
import ButtonFavorite from "@/component/button/button.favorite";
import CustomePostModal from "@/component/modal/modal.custom-post";

type Comment = {
  _id: string;
  content: string;
  user_id: string;
  post_id: string;
  user: {
    _id: string;
    full_name: string;
    avatar: {
      url: string;
    };
  };
  created_date: string;
};

type CreateComment = {
  content: string;
  user_id: string;
  post_id: string;
};
type Image = {
  _id: string;
  url: string;
  public_id: string;
  poster_id: string;
};

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap params Promise
  const { slug } = use(params);
  const user = useUserStore((state) => state.user);

  const [updateCommentState, setUpdateCommentState] = useState<CreateComment>({
    content: "",
    user_id: "",
    post_id: "",
  });

  const [itemId, setItemId] = useState<Comment | null>(null);
  const [setUpdateComment, setSetUpdateComment] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isModalPost, setIsModalPost] = useState(false);
  const searchParams = useSearchParams();
  const setImageIndex = searchParams.get("set");

  const [isClient, setIsClient] = useState(false);
  const [indexImage, setIndexImage] = useState<number>(
    setImageIndex ? parseInt(setImageIndex) : 0
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: postData, error: postError } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostById(slug),
  });

  const { data: postImageData, error: postImageError } = useQuery({
    queryKey: ["postImage", slug],
    queryFn: () => getPostByImageId(slug),
  });

  const post = postData?.data ? postData?.data : postImageData?.data;

  const { data: authorData } = useQuery({
    queryKey: ["author", post?.poster_id],
    queryFn: () => getUserById(post?.poster_id),
    enabled: !!post?.poster_id,
  });

  const author = authorData?.data || {};

  const postId = post?._id;
  const [addComment, setAddComment] = useState<CreateComment>({
    content: "",
    user_id: user?._id || "",
    post_id: postId,
  });

  const { data: commentData } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsOfPostId(postId!),
    enabled: !!postId, // chỉ chạy query khi postId có giá trị
  });

  const comments = commentData?.data || [];

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddComment({
      ...addComment,
      user_id: user?._id || "",
      post_id: postId,
      content: e.target.value,
    });
    setUpdateCommentState({
      ...updateCommentState,
      content: e.target.value,
    });
  };

  const commentMutation = useMutation({
    mutationFn: (data: CreateComment) => createComment(data),
  });
  const queryClient = useQueryClient();
  const handleCreateComment = (data: CreateComment) => {
    commentMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        setAddComment({
          content: "",
          user_id: user?._id || "",
          post_id: postId,
        });
      },
    });
  };

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => deleteComment(id),
  });
  const handleDeleteComment = (id: string) => {
    deleteCommentMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      },
    });
  };

  const updateCommentMutation = useMutation({
    mutationFn: (data: CreateComment) => updateComment(updateId, data),
  });
  const handleUpdateComment = (data: CreateComment) => {
    updateCommentMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        setItemId(null);
        setUpdateCommentState({
          content: "",
          user_id: "",
          post_id: "",
        });
        setSetUpdateComment(false);
        setUpdateId("");
        setAddComment({
          content: "",
          user_id: "",
          post_id: "",
        });
      },
    });
  };
  const { data: likeCountData, refetch } = useQuery({
    queryKey: ["likePosts", postId],
    queryFn: () => getLikeCountByPostId(postId!),
    enabled: !!postId, // chỉ chạy query khi postId có giá trị
  });

  const likeCount = likeCountData?.data.count || 0;

  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const isOpen = useSyncLocalStorage("isOpen");

  console.log("Current isOpen state:", typeof isOpen);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;
    const years = Math.floor(months / 12);
    return `${years} năm trước`;
  };

  if (!postData?.data && !postImageData?.data) {
    return (
      <div className="flex justify-center items-center mt-4">
        <div className="relative h-screen w-full">
          <Image
            src="/errorimage.jpg"
            alt="Background Image"
            className="absolute inset-0 w-full h-full object-cover filter blur-sm"
            width={1920}
            height={1080}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl text-white font-bold">
              Không tìm thấy ảnh!
            </h1>
            <div className="mt-4 text-white">
              <Link href="/">Trở về trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-10 h-creen gap-5.5 bg-white">
      <div className="col-span-6 flex justify-center shadow-md  overflow-hidden bg-black">
        {post?.images && post?.images.length > 0 && (
          <div className="flex justify-between items-center">
            <button
              onClick={() =>
                setIndexImage((prev) =>
                  prev > 0 ? prev - 1 : post.images.length - 1
                )
              }
              className={`px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors m-9 ${
                post.images.length <= 1 ? "hidden" : ""
              }`}
            >
              «
            </button>
            <Image
              src={post.images[indexImage || 0]?.url || "/avatar.png"}
              alt="Item"
              className="w-[400px] h-[400px] object-cover my-6"
              width={400}
              height={400}
            />
            <button
              onClick={() =>
                setIndexImage((prev) =>
                  prev < post.images.length - 1 ? prev + 1 : 0
                )
              }
              className={`px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors m-9 ${
                post.images.length <= 1 ? "hidden" : ""
              }`}
            >
              »
            </button>
          </div>
        )}
      </div>
      <div className="col-span-4 p-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-300">
          <div className="flex">
            {author?.avatar?.url ? (
              <Image
                src={author.avatar.url}
                alt=""
                className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                width={40}
                height={40}
              />
            ) : (
              <Image
                src="/avatar.png"
                alt=""
                className="md:h-10 md:w-10 h-8 w-9 rounded-full"
                width={40}
                height={40}
              />
            )}
            <h6 className="p-2 mx-2">{author?.full_name}</h6>
          </div>
          <div className="pr-7">
            <button title="More options" onClick={() => setIsModalPost(true)}>
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
        <div className="grid grid-rows-3 gap-3 ">
          <div className="mt-4 overflow-y-auto max-h-[250px] row-end-3 row-start-1">
            {/* Nội dung bài post */}
            {post?.content && (
              <div className="flex">
                <div>
                  <Image
                    src={author?.avatar?.url || "/avatar.png"}
                    alt={post?.content || "User avatar"}
                    className="md:h-7 md:w-7 h-7 w-7 rounded-full"
                    width={400}
                    height={400}
                    unoptimized
                  />
                </div>
                <div className="">
                  <div className="hidden md:block text-[13px] px-3">
                    <div className="flex">
                      <span className="font-semibold">{author?.full_name}</span>
                      <div className="text-[13px] px-4 text-gray-600">
                        {timeAgo(post?.created_date)}
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap"> {post.content}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Danh sách bình luận */}
            {comments &&
              comments.length > 0 &&
              comments.map((item: Comment) => (
                <div
                  className={`${
                    isOpen === "true" ? "" : "group relative"
                  }  flex items-start my-2`}
                  key={item._id}
                >
                  <Image
                    src={item.user?.avatar?.url || "/avatar.png"}
                    alt={item.user?.avatar?.url || "avatar"}
                    className="md:h-7 md:w-7 h-7 w-7 rounded-full"
                    width={400}
                    height={400}
                  />
                  <div className="m-1 px-3">
                    <div className="flex items-center text-[13px]">
                      <span className="font-semibold">
                        {item.user?.full_name}
                      </span>
                      <span className="px-4 text-gray-600">
                        {timeAgo(item?.created_date)}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{item.content}</div>

                    {/* Menu ẩn/hiện khi hover */}
                    <button
                      className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100 invisible group-hover:visible"
                      onClick={() => {
                        setItemId(item);
                        setIsModal(true);
                      }}
                    >
                      ...
                    </button>
                  </div>
                </div>
              ))}

            <div ref={commentsEndRef} />
          </div>
          <div className=" row-end-4">
            <div className="grid grid-cols-12 py-2.5">
              <div className="flex col-span-10">
                <div className="pr-2.5">
                  <ButtonLike postId={post?._id} onLike={refetch} />
                </div>
                <div className="px-2.5">
                  <button title="View comments">
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
                <ButtonFavorite postId={post?._id} />
              </div>
            </div>
            <div>
              <div className="font-bold text-[13px]">
                {likeCount} lượt thích
              </div>
            </div>
            {!setUpdateComment ? (
              <input
                type="content"
                title="Comment"
                placeholder="Bình luận..."
                className="w-full rounded-md p-2.5 mt-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                onChange={(e) => {
                  handleChangeComment(e as any);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateComment(addComment);
                  }
                }}
                value={addComment.content}
              />
            ) : (
              <input
                type="content"
                title="Comment"
                placeholder="Bình luận..."
                className="w-full rounded-md p-2.5 mt-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                onChange={(e) => {
                  handleChangeComment(e as any);
                }}
                value={updateCommentState.content}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateComment(updateCommentState);
                  }
                }}
              />
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
            <div className="flex min-h-full items-end justify-center  p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden mt-9 rounded-lg py-2 bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className=" justify-center flex flex-col gap-4 px-4 py-3 items-center ">
                  <div
                    className={` border border-t-0 border-x-0 w-full  items-center justify-center flex pb-4  ${
                      itemId?.user_id === user?._id ? "text-red-500" : "hidden"
                    }`}
                  >
                    <button
                      title="Xóa bình luận"
                      onClick={() => {
                        if (itemId?._id) handleDeleteComment(itemId._id);
                        setIsModal(false);
                      }}
                    >
                      Xóa bình luận
                    </button>
                  </div>
                  <div
                    className={`border border-t-0 border-x-0 w-full  items-center justify-center flex pb-4 ${
                      itemId?.user_id === user?._id ? "text-red-500" : "hidden"
                    }`}
                  >
                    <button
                      title="Cập nhật bình luận"
                      onClick={() => {
                        setSetUpdateComment(true);
                        if (itemId) {
                          setUpdateCommentState({
                            content: itemId.content,
                            user_id: itemId.user._id,
                            post_id: post._id,
                          });
                          setUpdateId(itemId._id);
                        }
                        setItemId(null);
                      }}
                    >
                      Cập nhật bình luận
                    </button>
                  </div>
                  <div className="border border-t-0 border-x-0 w-full  items-center justify-center flex pb-4">
                    <button className="text-red-500">Báo cáo</button>
                  </div>
                  <div className=" w-full  items-center justify-center flex pb-1.5">
                    <button
                      className="text-gray-500"
                      onClick={() => {
                        setItemId(null), setIsModal(false);
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalPost && (
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
          <CustomePostModal setIsOpenModal={setIsModalPost} />
        </div>
      )}
    </div>
  );
}
