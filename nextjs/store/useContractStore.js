import { create } from "zustand";

export const useContractStore = create((set) => ({
    sureTokenContract: null,
    sureTokenInterface: null,
    predictionWorldContract: null,
    predictionWorldInterface: null,
    earlyBirdContract: null,
    earlyBirdInterface: null,
    earlyBirdValidState: 0,

    setSureTokenContract: (sureTokenContract) => set((state) => ({ ...state, sureTokenContract })),
    setSureTokenInterface: (sureTokenInterface) => set((state) => ({ ...state, sureTokenInterface })),
    setPredictionWorldContract: (predictionWorldContract) => set((state) => ({ ...state, predictionWorldContract })),
    setPredictionWorldInterface: (predictionWorldInterface) => set((state) => ({ ...state, predictionWorldInterface })),
    setEarlyBirdContract: (earlyBirdContract) => set((state) => ({ ...state, earlyBirdContract })),
    setEarlyBirdInterface: (earlyBirdInterface) => set((state) => ({ ...state, earlyBirdInterface })),
    setEarlyBirdValidState: (earlyBirdValidState) => set((state) => ({ ...state, earlyBirdValidState }))
}));
