import { API_GET_MARKET_TICKETS } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncMarketTickets = async ({ marketId }) => {
    const data = {
        Payload: {
            MarketId: marketId
        }
    };

    const response = await baseAxios({
        method: "POST",
        url: API_GET_MARKET_TICKETS,
        data: data
    });
    return response;
};

export default syncMarketTickets;
