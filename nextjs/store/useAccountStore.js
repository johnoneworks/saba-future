import { create } from "zustand";

export const useAccountStore = create((set) => ({
    socialLoginSDK: null,
    account: null,
    isAdmin: null,
    provider: null,
    smartAccount: null,
    isNew: null,
    setSocialLoginSDK: (socialLoginSDK) => set((state) => ({ ...state, socialLoginSDK })),
    setAccount: (account) => set((state) => ({ ...state, account })),
    setIsAdmin: (isAdmin) => set((state) => ({ ...state, isAdmin })),
    setProvider: (provider) => set((state) => ({ ...state, provider })),
    setSmartAccount: (smartAccount) => set((state) => ({ ...state, smartAccount })),
    setIsNew: (isNew) => set((state) => ({ ...state, isNew }))
}));
