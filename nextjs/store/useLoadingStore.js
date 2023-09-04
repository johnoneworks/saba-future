import { create } from "zustand";

export const useLoadingStore = create((set) => ({
    isPageLoading: false,
    isMarketLoading: false,
    setIsPageLoading: (isPageLoading) => set((state) => ({ ...state, isPageLoading })),
    setIsMarketLoading: (isMarketLoading) => set((state) => ({ ...state, isMarketLoading }))
}));
