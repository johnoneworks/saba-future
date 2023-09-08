import { create } from "zustand";

export const useMarketDetailStore = create((set) => ({
    marketDetail: {
        id: null,
        title: "title of market",
        imageHash: "",
        endTimestamp: "1681681545",
        description: "",
        resolverUrl: null,
        isClose: undefined,
        isTest: false,
        isSuspended: false
    },
    setMarketDetail: (marketDetail) => set({ marketDetail })
}));
