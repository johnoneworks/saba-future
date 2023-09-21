import { API_GET_BALANCE } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncGetBalance = async (token) => {
    const response = await baseAxios({
        method: "POST",
        url: API_GET_BALANCE,
        token: token
    });
    return response;
};

export default syncGetBalance;
