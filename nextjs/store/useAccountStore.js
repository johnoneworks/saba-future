import { create } from "zustand";

export const useAccountStore = create((set) => ({
    socialLoginSDK: null,
    account: null,
    provider: null,
    smartAccount: null,
    setSocialLoginSDK: (socialLoginSDK) => set((state) => ({ ...state, socialLoginSDK })),
    setAccount: (account) => set((state) => ({ ...state, account })),
    setProvider: (provider) => set((state) => ({ ...state, provider })),
    setSmartAccount: (smartAccount) => set((state) => ({ ...state, smartAccount }))
}));
