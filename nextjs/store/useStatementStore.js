import { create } from "zustand";

export const useStatementStore = create((set) => ({
    userStatements: [],
    setUserStatements: (userStatements) => set((state) => ({ ...state, userStatements }))
}));
