"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUserById } from "@/app/api/AuthApi";
import {
  getCommentsOfPostId,
  createComment,
  updateComment,
  deleteComment,
} from "@/app/api/CommentApi";
import {
  createFavorite,
  unFavorite,
  getAllFavoritesOfUser,
  Favorite,
} from "@/app/api/FavoriteApi";

import {
  createLike,
  unlike,
  getAllLikesOfUser,
  Like,
  getLikeCountByPostId,
} from "@/app/api/LikeApi";

export interface Post {
  _id: string;
  content: string;
  poster_id: string;
  images: string[];
  video: string[];
  like: number;
  view: number;
}

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
};

type CreateComment = {
  content: string;
  user_id: string;
  post_id: string;
};

const CardPost = ({ data }: { data: Post }) => {
  const [user, setUser] = useState<{
    _id: string;
    full_name: string;
    avatar: { url: string };
  } | null>(null);
  const postId = data._id;
  const [updateId, setUpdateId] = useState("");

  const [viewComment, setViewComment] = useState(false);
  const [addComment, setAddComment] = useState<CreateComment>({
    content: "",
    user_id: user?._id || "",
    post_id: data._id,
  });
  const [updateCommentState, setUpdateCommentState] = useState<CreateComment>({
    content: "",
    user_id: "",
    post_id: "",
  });
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [setUpdateComment, setSetUpdateComment] = useState(false);

  useEffect(() => {
    if (!user) {
      getUserById(data.poster_id).then((response) => {
        setUser(response.data);
      });
    }
  }, [data.poster_id, user, setUser]);

  const handleViewComment = () => {
    setViewComment(!viewComment);
  };

  const { data: commentData } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsOfPostId(postId),
  });

  const comment = commentData?.data;

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddComment({
      ...addComment,
      user_id: user?._id || "",
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

  const handleCreateComment = (data: CreateComment) => {
    commentMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        setAddComment({
          content: "",
          user_id: user?._id || "",
          post_id: postId,
        });
        setViewComment(true);
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
        setShowMenuId(null);
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

  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getAllFavoritesOfUser(),
  });

  const favorite = favoritesData?.data.post_ids;

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (data: Favorite) => createFavorite(data),
  });

  const handleFavorite = (
    event: React.MouseEvent<HTMLButtonElement>,
    post_id: string
  ) => {
    event.preventDefault();
    console.log("favorite");
    likeMutation.mutate(
      { post_id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["favorites"] });
          console.log("like success");
        },
        onError: (error) => {
          console.error("Error liking post:", error);
        },
      }
    );
  };

  const unLikeMutation = useMutation({
    mutationFn: (id: string) => unFavorite(id),
  });

  const handleUnFavorite = (
    event: React.MouseEvent<HTMLButtonElement>,
    post_id: string
  ) => {
    event.preventDefault();
    console.log("unFavorite");
    unLikeMutation.mutate(post_id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        console.log("unFavorite success");
      },
    });
  };
  const likeMutationPost = useMutation({
    mutationFn: (data: Like) => createLike(data),
  });

  const handleLike = (
    event: React.MouseEvent<HTMLButtonElement>,
    post_id: string
  ) => {
    event.preventDefault();
    console.log("like");
    likeMutationPost.mutate(
      { post_id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
          console.log("like success");
        },
        onError: (error) => {
          console.error("Error liking post:", error);
        },
      }
    );
  };

  const unlikeMutationPost = useMutation({
    mutationFn: (data: { post_id: string }) => unlike(data.post_id),
  });

  const handleUnLike = (
    event: React.MouseEvent<HTMLButtonElement>,
    post_id: string
  ) => {
    event.preventDefault();
    console.log("unlike");
    unlikeMutationPost.mutate(
      { post_id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
          console.log("unlike success");
        },
        onError: (error) => {
          console.error("Error unliking post:", error);
        },
      }
    );
  };

  const { data: likedPostsData } = useQuery({
    queryKey: ["likedPosts"],
    queryFn: () => getAllLikesOfUser(),
  });

  const likedPosts = likedPostsData?.data.post_ids;

  const { data: likeCountData } = useQuery({
    queryKey: ["likePosts", postId],
    queryFn: () => getLikeCountByPostId(postId),
    refetchInterval: 1000,
  });

  const likeCount = likeCountData?.data.count || 0;

  return (
    <div className="card ">
      <div className="container mx-auto mb-7">
        <div className="bg-white p-4 rounded-md shadow-md">
          <div>
            <div className="flex-shrink-0">
              <div className="grid grid-cols-12  ">
                <div className="col-span-1">
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
                <div className="col-span-10 items-center ">
                  <div className="font-semibold px-3.5 text-[13px] md:text-[15px]">
                    {user?.full_name}
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
                {data.content && data.content !== "" ? (
                  <div className="hidden md:block text-[13px]">
                    <span className="font-semibold">{user?.full_name}</span>{" "}
                    {data.content}
                  </div>
                ) : null}

                {data.images.length > 0 ? (
                  <Image
                    className="w-full h-64 object-cover mt-4"
                    src={data.images[0]}
                    alt="image"
                    width={100}
                    height={100}
                  />
                ) : null}
              </div>
              <div className="grid grid-cols-12 py-2.5">
                <div className="flex col-span-10">
                  <div className="pr-2.5">
                    {likedPosts?.includes(data._id) ? (
                      <button
                        onClick={(event) => handleUnLike(event, data._id)}
                        title="Bỏ thích bài viết"
                        aria-label="Bỏ thích bài viết"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={(event) => handleLike(event, data._id)}
                        title="Thích bài viết"
                        aria-label="Thích bài viết"
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
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="px-2.5">
                    <button title="View comments" onClick={handleViewComment}>
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
                  {favorite?.includes(data._id) ? (
                    <button
                      onClick={(event) => handleUnFavorite(event, data._id)}
                      title="Bỏ lưu bài viết"
                      aria-label="Bỏ lưu bài viết"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-yellow-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={(event) => handleFavorite(event, data._id)}
                      title="Lưu bài viết"
                      aria-label="Lưu bài viết"
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
                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className=" py-2.5">
                <div className="font-light text-[13px]">
                  {likeCount} lượt thích
                </div>

                <div className="block md:hidden text-[13px] line-clamp-2">
                  <span className="font-semibold">Sơn Tùng M-TP</span> là ca sĩ,
                  nhạc sĩ nổi tiếng với nhiều bản hit đình đám...
                </div>
              </div>
              <div className="border-t-2 border-gray-200 py-2.5">
                <div className="font-semibold px-3.5">Bình luận</div>
                <div className="flex justify-between my-3.5">
                  <span className="font-light px-3.5 text-[gray] text-[13px]">
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
                {viewComment ? (
                  <>
                    {comment && comment.length > 0 ? (
                      comment.map((item: Comment) => (
                        <div
                          className="grid grid-cols-12 mx-3 my-3.5"
                          key={item._id}
                        >
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
                                {item.user.full_name}
                              </div>
                              <div className="font-light text-[13px]">
                                {item.content}
                              </div>
                            </div>
                          </div>

                          {user?._id === item.user._id ? (
                            <div className="relative col-span-12 lg:col-span-1 flex justify-center ml-1 mt-2 h-5 w-5">
                              <button
                                className="hover:bg-gray-100 rounded-full"
                                title="Menu"
                                onClick={() =>
                                  setShowMenuId(
                                    showMenuId === item._id ? null : item._id
                                  )
                                }
                              >
                                <Image
                                  src={"/ellipsis-vertical-solid-full.svg"}
                                  alt="menu"
                                  width={15}
                                  height={15}
                                />
                              </button>
                              {showMenuId === item._id && (
                                <div className="absolute z-10 top-8 right-0 w-64 bg-white rounded-xl shadow-lg p-4">
                                  <div className="font-semibold cursor-pointer hover:bg-gray-100 p-2 rounded">
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(item._id)
                                      }
                                    >
                                      Xóa bình luận
                                    </button>
                                  </div>
                                  <div className="font-semibold cursor-pointer hover:bg-gray-100 p-2 rounded">
                                    <button
                                      onClick={() => {
                                        setSetUpdateComment(true);
                                        setUpdateCommentState({
                                          content: item.content,
                                          user_id: item.user._id,
                                          post_id: postId,
                                        });
                                        setShowMenuId(null);
                                        setUpdateId(item._id);
                                      }}
                                    >
                                      Chỉnh sửa bình luận
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">
                        Không có bình luận
                      </div>
                    )}
                  </>
                ) : null}{" "}
                <div className="grid grid-cols-12 mx-3 ">
                  <div className="col-span-11">
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
  );
};

export default CardPost;
