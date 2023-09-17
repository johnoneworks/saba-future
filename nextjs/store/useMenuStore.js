import { create } from "zustand";

export const useMenuStore = create((set) => ({
    currentMenu: null,
    currentMarketID: null,
    refreshStatement: 0,
    setCurrentMenu: (currentMenu) => set((state) => ({ ...state, currentMenu })),
    setCurrentMarketID: (currentMarketID) => set((state) => ({ ...state, currentMarketID })),
    setRefreshStatement: (refreshStatement) => set((state) => ({ ...state, refreshStatement }))
}));
