import { GOOGLE_LOGIN, SESSION_STORAGE } from "@/constants/Constant.js";
import { currentDate } from "@/utils/ConvertDate";
import uuidv4 from "@/utils/Uuid";
import axios from "axios";
import { API_URL_DOMAIN } from "../constants/api.js";

const baseAxios = async ({ method, url, header = {}, token, data = {} }) => {
    try {
        const response = await axios({
            method: method,
            url: API_URL_DOMAIN + url,
            headers: {
                "Content-Type": "application/json",
                ...header
            },
            data: {
                TimeStamp: currentDate(),
                Seq: uuidv4(),
                Token: token,
                ...data
            }
        });

        if (response.data.ErrorCode === 1012) {
            if (typeof window !== "undefined" && JSON.parse(sessionStorage.getItem(SESSION_STORAGE.LOGIN_INFO))) {
                JSON.parse(sessionStorage.removeItem(SESSION_STORAGE.LOGIN_INFO));
            }
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_LOGIN.CLIENT_ID}&response_type=code&scope=${GOOGLE_LOGIN.SCOPE}&redirect_uri=${location.origin}`;
        }

        return response.data;
    } catch (error) {
        console.error(`api is ${method} method and api url is ${API_URL_DOMAIN + url} and error is ${error}`);
        console.log("%c⧭ error data", "color: #cc0036", data);
    }
};

export default baseAxios;
