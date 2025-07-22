import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { getRequest } from "@/utils/request";

interface ItemsState {
  items: any[];
  isLoading: boolean;
  error: string | null;
  setItems: (data: any) => void;
  getItems: () => Promise<void>;
  reset: () => void;
}

const useItemsStore = create(
  devtools(
    persist(
      (set, get): ItemsState => ({
        items: [],
        isLoading: false,
        error: null,
        setItems: (data: any) => set({ items: data }),
        

        reset: () =>
          set({
            items: [],
            isLoading: false,
            error: null,
          }),


        // Get Items
        getItems: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await getRequest({ endpoint: `/upload` });
            set({ items: response.data });
            return response.data;
          } catch (err: any) {
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: "items-storage",
        version: 1,
        storage: createJSONStorage(() => {
          if (typeof window !== "undefined") {
            return localStorage;
          }
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          };
        }),
        migrate: (persistedState: any, version: any) => {
          if (typeof persistedState !== "object" || !persistedState?.items) {
            return { items: [], isLoading: false, error: null };
          }
          return persistedState;
        },
      }
    )
  )
);

export default useItemsStore;
 