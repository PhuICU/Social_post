"use client";
import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getAllFavoritePostsByUserId } from "@/app/api/FavoriteApi";
export default function SavedPostsPage() {
  const queryClient = useQueryClient();
  const {
    data: favoritePosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favoritePosts"],
    queryFn: () => getAllFavoritePostsByUserId(), // Replace with actual user ID
  });
  console.log("favoritePosts", favoritePosts);

  return <div></div>;
}
