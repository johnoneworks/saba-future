import { API_PLACE_BET } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncPlaceBet = async ({ marketId, BetType, Stake }) => {
    const data = {
        Payload: {
            MarketId: marketId,
            BetTypeName: BetType,
            Stake: Stake
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
