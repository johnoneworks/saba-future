import { create } from "zustand";

export const useMarketDetailStore = create((set) => ({
    marketDetail: {
        id: null,
        title: "title of market",
        imageHash: "",
        endTimestamp: "1681681545",
        totalAmount: 0,
        totalYesAmount: 0,
        totalNoAmount: 0,
        description: "",
        resolverUrl: null,
        isClose: undefined,
        isTest: false,
        isSuspended: false
    },
    setMarketDetail: (marketDetail) => set({ marketDetail })
}));
