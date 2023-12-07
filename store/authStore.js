import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const authStore = create(
  persist(
    (set) => ({
      loginUser: null,
      setLoginUser: (loginUser) =>
        set((state) => ({
          ...state,
          loginUser: loginUser,
        })),
      resetLoginUser: () =>
        set((state) => ({
          ...state,
          loginUser: null,
        })),
    }),
    {
      name: "auth-store-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default authStore;
