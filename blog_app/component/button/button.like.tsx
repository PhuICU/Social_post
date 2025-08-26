import React, { useState, useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createLike, unlike, getAllLikesOfUser, Like } from "@/app/api/LikeApi";

interface ButtonLikeProps {
  postId: string;
  onLike?: () => void; // Optional callback for when the like action is successful
}

const ButtonLike = ({ postId, onLike }: ButtonLikeProps) => {
  const queryClient = useQueryClient();

  const likeMutationPost = useMutation({
    mutationFn: (data: Like) => createLike(data),
  });

  const handleLike = (
    event: React.MouseEvent<HTMLButtonElement>,
    post_id: string
  ) => {
    event.preventDefault();

    likeMutationPost.mutate(
      { post_id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
          console.log("like success");
          onLike?.();
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

    unlikeMutationPost.mutate(
      { post_id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
          console.log("unlike success");
          onLike?.();
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
  return (
    <>
      {likedPosts?.includes(postId) ? (
        <button
          onClick={(event) => {
            handleUnLike(event, postId);
            onLike?.();
          }}
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
          onClick={(event) => {
            handleLike(event, postId);
            onLike?.();
          }}
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
    </>
  );
};

export default ButtonLike;
