import { SESSION_STORAGE } from "@/constants/Constant";
import { create } from "zustand";

const getInitialToken = () => {
    if (typeof window !== "undefined" && JSON.parse(sessionStorage.getItem(SESSION_STORAGE.LOGIN_INFO))) {
        return JSON.parse(sessionStorage.getItem(SESSION_STORAGE.LOGIN_INFO)).token;
    } else return "";
};

export const useAccountStore = create((set) => ({
    account: null,
    balance: null,
    email: null,
    isAdmin: null,
    isNew: null,
    token: getInitialToken(),
    setAccount: (account) => set((state) => ({ ...state, account })),
    setEmail: (email) => set((state) => ({ ...state, email })),
    setBalance: (balance) => set((state) => ({ ...state, balance })),
    setIsAdmin: (isAdmin) => set((state) => ({ ...state, isAdmin })),
    setIsNew: (isNew) => set((state) => ({ ...state, isNew })),
    setToken: (token) => set((state) => ({ ...state, token })),
    setClearAllAccount: () => set((state) => ({ ...state, account: null, email: null, isAdmin: null, isNew: null, token: "" }))
}));
