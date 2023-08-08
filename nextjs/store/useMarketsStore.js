import { BACKUP_IMAGE } from "@/constants/Constant";
import { create } from "zustand";

const defaultMarket = {
    id: "",
    question: "",
    imageHash: BACKUP_IMAGE,
    totalAmount: 0,
    totalYesAmount: 0,
    totalNoAmount: 0,
    marketClosed: false,
    outcome: 0,
    isTest: false,
    isSuspended: false,
    endTimestamp: ""
};

export const useMarketsStore = create((set) => ({
    marketCount: 0,
    markets: [defaultMarket],
    yesInfo: [],
    noInfo: [],

    setMarketCount: (count) => set((state) => ({ ...state, marketCount: count })),
    setMarkets: (markets) => set((state) => ({ ...state, markets })),
    setYesInfo: (yesInfo) => set((state) => ({ ...state, yesInfo })),
    setNoInfo: (noInfo) => set((state) => ({ ...state, noInfo }))
}));
