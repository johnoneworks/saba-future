import { API_GET_BALANCE } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncGetBalance = async () => {
    const response = await baseAxios({
        method: "POST",
        url: API_GET_BALANCE
    });
    return response;
};

export default syncGetBalance;
