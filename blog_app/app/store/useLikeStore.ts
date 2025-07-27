import { create } from "zustand";

interface LikeState {
  likes: Record<string, boolean>; // postId -> liked
  setLike: (postId: string, liked: boolean) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
  likes: {},
  setLike: (postId, liked) =>
    set((state) => ({
      likes: { ...state.likes, [postId]: liked },
    })),
}));
