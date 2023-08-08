import { MENU_TYPE } from "@/constants/Constant";
import { useRouter } from "next/router";
import { create } from "zustand";

const router = useRouter();
const { menu, marketid } = router.query;

export const useMenuStore = create((set) => ({
    currentMenu: menu ? menu : MENU_TYPE.MARKET,
    currentMarketID: marketid ? marketid : null,

    setCurrentMenu: (currentMenu) => set((state) => ({ ...state, currentMenu })),
    setCurrentMarketID: (currentMarketID) => set((state) => ({ ...state, currentMarketID }))
}));
