import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { emptyArray } from "../constants";

const postStore = create(
  persist(
    (set, get) => ({
      posts: emptyArray,
      post: null,
      setPosts: (posts) =>
        set((state) => ({
          ...state,
          posts: posts,
        })),
      setPost: (post) =>
        set((state) => ({
          ...state,
          post: post,
        })),
      resetPosts: () => set({ posts: [] }),
      resetPost: () => set({ post: null }),
    }),
    {
      name: "post-store-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default postStore;
