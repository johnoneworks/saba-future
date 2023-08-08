import { create } from "zustand";

export const usePlayerInfoStore = create((set) => ({
    email: "",
    balance: 0,
    totalBetValue: 0,
    hasGetFirstInformation: false,
    isSendAccountReady: false,
    setEmail: (email) => set((state) => ({ ...state, email })),
    setBalance: (balance) => set((state) => ({ ...state, balance })),
    setTotalBetValue: (totalBetValue) => set((state) => ({ ...state, totalBetValue })),
    setHasGetFirstInformation: (hasGetFirstInformation) => set((state) => ({ ...state, hasGetFirstInformation })),
    setIsSendAccountReady: (isSendAccountReady) => set((state) => ({ ...state, isSendAccountReady }))
}));
