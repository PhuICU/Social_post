"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getAllFavoritePostsByUserId } from "@/app/api/FavoriteApi";

const CardPost = dynamic(() => import("@/component/card/card.favorite"));
import { Post } from "@/component/card/card.favorite";

const ModalPost = dynamic(() => import("@/component/modal/modal.post"));

export default function SavedPostsPage() {
  const [idPost, setIdPost] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: favoritePosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favoritePosts"],
    queryFn: () => getAllFavoritePostsByUserId(), // Replace with actual user ID
  });

  const favoritePostsData = favoritePosts?.data || [];

  return (
    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {" "}
      {favoritePostsData
        ?.slice()
        .reverse()
        .map((post: Post) => (
          <div
            key={post._id}
            onClick={() => {
              setIdPost(post._id);
              setIsOpenModal(true);
            }}
            className="col-span-1 "
          >
            <CardPost data={post} />
          </div>
        ))}
      {isOpenModal && (
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
          <ModalPost postId={idPost} setIsOpenModal={setIsOpenModal} />
        </div>
      )}
    </div>
  );
}
