import { API_GET_ALL_MARKET } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncAllMarkets = async ({ currentDate }) => {
    console.log("in syncAllMarkets");
    const data = {
        TimeStamp: currentDate,
        Seq: "string",
        Token: "string"
    };

    const response = await baseAxios({
        method: "POST",
        url: API_GET_ALL_MARKET,
        data: data
    });
    return response;
};

export default syncAllMarkets;
