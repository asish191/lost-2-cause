import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { getRequest, postRequest } from "@/utils/request";
import { Item } from "@/types/item";

interface ItemsState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  setItems: (data: any) => void;
  getItems: (search?: string, page?: number) => Promise<void>;
  reset: () => void;
  uploadItem: (data: any) => Promise<void>;
}

const useItemsStore = create(
  devtools(
    persist(
      (set, get): ItemsState => ({
        items: [],
        isLoading: false,
        error: null,
        currentPage: 1,
        hasMore: true,
        setItems: (data: Item[]) => set({ items: data }),
        

        reset: () =>
          set({
            items: [],
            isLoading: false,
            error: null,
          }),


        // Get Items
        getItems: async (search = '', page = 1) => {
          set({ isLoading: true, error: null });
          try {
            const response = await getRequest({ 
              endpoint: `/upload?limit=20&page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`
            });
            const { items, total, totalPages } = response.data;
            set((state: ItemsState) => ({
              items: page === 1 ? items : [...state.items, ...items],
              currentPage: page,
              hasMore: page < totalPages
            }));
            return items;
          } catch (err: any) {
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // Upload Item
        uploadItem: async (data: any) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ endpoint: `/upload`, payload: data });
            const updatedItems = await getRequest({ endpoint: `/upload?limit=20` });
            set({ items: updatedItems.data.items });
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
 