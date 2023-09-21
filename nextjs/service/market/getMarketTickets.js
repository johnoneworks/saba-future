import { API_GET_MARKET_TICKETS } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncMarketTickets = async ({ marketId, token }) => {
    const data = {
        Payload: {
            MarketId: marketId
        }
    };

    const response = await baseAxios({
        method: "POST",
        url: API_GET_MARKET_TICKETS,
        token: token,
        data: data
    });
    return response;
};

export default syncMarketTickets;
