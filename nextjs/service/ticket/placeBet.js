import { API_PLACE_BET } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncPlaceBet = async ({ marketId, betType, stake }) => {
    const data = {
        Payload: {
            MarketId: marketId,
            BetTypeName: betType,
            Stake: stake
        }
    };
    const response = await baseAxios({
        method: "POST",
        url: API_PLACE_BET,
        data: data
    });

    return response;
};

export default syncPlaceBet;
