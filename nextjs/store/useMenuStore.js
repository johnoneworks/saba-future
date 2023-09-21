import { create } from "zustand";

export const useMenuStore = create((set) => ({
    currentMenu: null,
    currentMarketID: null,
    setCurrentMenu: (currentMenu) => set((state) => ({ ...state, currentMenu })),
    setCurrentMarketID: (currentMarketID) => set((state) => ({ ...state, currentMarketID }))
}));
