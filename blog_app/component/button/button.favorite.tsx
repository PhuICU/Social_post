import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createFavorite,
  unFavorite,
  getAllFavoritesOfUser,
  Favorite,
} from "@/app/api/FavoriteApi";

interface ButtonFavoriteProps {
  postId: string;
}

const ButtonFavorite = ({ postId }: ButtonFavoriteProps) => {
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

    unLikeMutation.mutate(post_id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        console.log("unFavorite success");
      },
    });
  };
  return (
    <>
      {favorite?.includes(postId) ? (
        <button
          onClick={(event) => handleUnFavorite(event, postId)}
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
          onClick={(event) => handleFavorite(event, postId)}
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
    </>
  );
};

export default ButtonFavorite;
