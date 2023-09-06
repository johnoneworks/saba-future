import { API_GET_ALL_MARKET } from "@/constants/api";
import uuidv4 from "@/utils/Uuid";
import baseAxios from "../baseAxios";

const syncAllMarkets = async ({ currentDate }) => {
    const data = {
        TimeStamp: currentDate,
        Seq: uuidv4(),
        Token: " "
    };

    const response = await baseAxios({
        method: "POST",
        url: API_GET_ALL_MARKET,
        data: data
    });
    return response;
};

export default syncAllMarkets;
