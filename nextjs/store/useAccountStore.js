import { SESSIONSTORAGE } from "@/constants/Constant";
import { create } from "zustand";

const sessionStorageToken = () => {
    if (typeof window !== "undefined" && JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.LOGIN_INFO))) {
        return JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.LOGIN_INFO)).token;
    } else return null;
};

export const useAccountStore = create((set) => ({
    socialLoginSDK: null,
    account: null,
    balance: null,
    email: null,
    isAdmin: null,
    provider: null,
    smartAccount: null,
    isNew: null,
    token: sessionStorageToken(),
    setSocialLoginSDK: (socialLoginSDK) => set((state) => ({ ...state, socialLoginSDK })),
    setAccount: (account) => set((state) => ({ ...state, account })),
    setEmail: (email) => set((state) => ({ ...state, email })),
    setBalance: (balance) => set((state) => ({ ...state, balance })),
    setIsAdmin: (isAdmin) => set((state) => ({ ...state, isAdmin })),
    setProvider: (provider) => set((state) => ({ ...state, provider })),
    setSmartAccount: (smartAccount) => set((state) => ({ ...state, smartAccount })),
    setIsNew: (isNew) => set((state) => ({ ...state, isNew })),
    setToken: (token) => set((state) => ({ ...state, token })),
    setCleanSessionStorage: () => set((state) => ({ ...state, account: null, email: null, isAdmin: null, isNew: null, token: null }))
}));
