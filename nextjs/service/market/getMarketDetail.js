import { API_GET_MARKET_DETAIL } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncMarketDetail = async ({ marketId }) => {
    const data = {
        Payload: {
            MarketId: marketId
        }
    };

    const response = await baseAxios({
        method: "POST",
        url: API_GET_MARKET_DETAIL,
        data: data
    });

    return response;
};

export default syncMarketDetail;
