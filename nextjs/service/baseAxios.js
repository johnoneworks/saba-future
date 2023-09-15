import { currentDate } from "@/utils/ConvertDate";
import uuidv4 from "@/utils/Uuid";
import axios from "axios";
import { API_URL_DOMAIN } from "../constants/api.js";

const localstorageToken = () => {
    if (typeof window !== "undefined" && JSON.parse(localStorage.getItem("saba_web2_login_info"))) {
        return JSON.parse(localStorage.getItem("saba_web2_login_info")).token;
    } else return "";
};

const baseAxios = async ({ method, url, header = {}, data = {} }) => {
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
                // 要有字串才有 test 的 Market
                Token: localstorageToken(), // TODO: Jim 說要做成 token
                ...data
            } // 注意這裡
        });
        return response.data;
    } catch (error) {
        console.error(`api is ${method} method and api url is ${API_URL_DOMAIN + url} and error is ${error}`);
        console.log("%c⧭ error data", "color: #cc0036", data);
    }
};

export default baseAxios;
