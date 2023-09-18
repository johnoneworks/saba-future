import { API_GET_ALL_MARKET } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncAllMarkets = async (token) => {
    const response = await baseAxios({
        method: "POST",
        url: API_GET_ALL_MARKET,
        token: token
    });

    return response;
};

export default syncAllMarkets;
