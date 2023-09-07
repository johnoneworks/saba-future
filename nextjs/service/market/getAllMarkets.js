import { API_GET_ALL_MARKET } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncAllMarkets = async () => {
    const response = await baseAxios({
        method: "POST",
        url: API_GET_ALL_MARKET
    });
    return response;
};

export default syncAllMarkets;
