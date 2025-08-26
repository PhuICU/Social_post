import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/app/store/useUserStore";

import {
  getCommentsOfPostId,
  createComment,
  updateComment,
  deleteComment,
} from "@/app/api/CommentApi";

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

interface CardCommentProps {
  postId: string;
  isComment?: boolean;
}

const CardComment = ({ postId, isComment }: CardCommentProps) => {
  const [viewComment, setViewComment] = useState(false);
  const user = useUserStore((state) => state.user);
  const [addComment, setAddComment] = useState<CreateComment>({
    content: "",
    user_id: user?._id || "",
    post_id: postId,
  });
  const [updateCommentState, setUpdateCommentState] = useState<CreateComment>({
    content: "",
    user_id: "",
    post_id: "",
  });
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [setUpdateComment, setSetUpdateComment] = useState(false);
  const [updateId, setUpdateId] = useState("");

  useEffect(() => {
    setViewComment(isComment ?? false);
  }, [isComment]);

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
  return (
    <div className="border-t-2 border-gray-200 py-2.5">
      <div className="font-semibold px-3.5">Bình luận</div>
      <div className="flex justify-between my-3.5">
        <span className="font-light px-3.5 text-[gray] text-[13px]">
          Có {comment?.length || 0} bình luận
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
              <div className="grid grid-cols-12 mx-3 my-3.5" key={item._id}>
                <div className="col-span-1 hidden lg:block">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={item?.user?.avatar.url || "/avatar.png"}
                    alt=""
                  />
                </div>
                <div className="col-span-10 hidden lg:block">
                  <div className="bg-gray-100 rounded-md p-2.5">
                    <div className="font-semibold text-[15px]">
                      {item?.user?.full_name}
                    </div>
                    <div className="font-light text-[13px]">{item.content}</div>
                  </div>
                </div>

                {user?._id === item?.user?._id ? (
                  <div className="relative col-span-12 lg:col-span-1 flex justify-center ml-1 mt-2 h-5 w-5">
                    <button
                      className="hover:bg-gray-100 rounded-full"
                      title="Menu"
                      onClick={() =>
                        setShowMenuId(showMenuId === item._id ? null : item._id)
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
                          <button onClick={() => handleDeleteComment(item._id)}>
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
            <div className="text-center text-gray-500">Không có bình luận</div>
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
  );
};

export default CardComment;
