import { API_LOGIN } from "@/constants/api";
import baseAxios from "./baseAxios";

const syncLogin = async ({ code, redirectUrl }) => {
    const response = await baseAxios({
        method: "GET",
        url: `${API_LOGIN}?code=${code}&redirectUrl=${redirectUrl}`
    });
    return response;
};

export default syncLogin;
